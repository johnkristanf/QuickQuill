<?php

namespace App\Services;

use App\Models\Document;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DocumentService
{
    private $s3Client;

    public function __construct()
    {
        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region' => env("AWS_DEFAULT_REGION"),
            'credentials' => [
                'key' => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);
    }


    public function isDocumentNameExist($documentName)
    {
        $isDocumentNameExists = Document::select('name')
            ->where('name', 'LIKE', "{$documentName}%")
            ->get()
            ->pluck('name')
            ->toArray();

        // if ($isDocumentNameExists) {
        //     $existingNumbers = array_map(function ($name) use ($documentName) {
        //         if (preg_match('/' . preg_quote($documentName, '/') . '\((\d+)\)$/', $name, $matches)) {
        //             return (int) $matches[1];
        //         }
        //         return 0;
        //     }, $isDocumentNameExists);

        //     $nextNumber = count($existingNumbers) > 0 ? max($existingNumbers) + 1 : 1;

        //     $documentName = "{$documentName}({$nextNumber})";
        // }

        if($isDocumentNameExists){
            return true;
        }

        return false;
    }


    public function saveDocumentToBucket($documentName, $documentContent)
    {
        $filePath = 'documents/' . $documentName . '.json';
        $jsonDocumentContent = json_encode($documentContent, JSON_PRETTY_PRINT);

        return $this->s3Client->putObject([
            'Bucket' => env("AWS_BUCKET"),
            'Key' => $filePath,
            'Body' => $jsonDocumentContent,
            'ContentType' => 'application/json'
        ]);

    }

    public function saveDocumentMetaDataToDB($documentName)
    {
        return Document::create([
            'name' => $documentName,
            'user_id' => Auth::id()
        ]);
    }


    public function getDocumentMetaData()
    {
        return Document::select('id', 'name', 'user_id', 'created_at')
                ->where('user_id', Auth::id())
                ->get()
                ->toArray();
    }

    public function getDocumentContentFromBucket($documentName)
    {
        $s3Key = 'documents/' . $documentName . '.json';

        $result = $this->s3Client->getObject([
            'Bucket' => env("AWS_BUCKET"),
            'Key'    => $s3Key
        ]);

        return $result['Body']->getContents();
    }

    public function renameDocument($documentID, $documentName, $OldDocumentName)
    {
        Document::where('id', $documentID)->update([
            'name' => $documentName,
        ]);

        $bucket = env("AWS_BUCKET");
        $oldKey = 'documents/' . $OldDocumentName . '.json';
        $newKey = 'documents/' . $documentName . '.json';

        Log::info("old Key: " . $oldKey);
        Log::info("new Key: " . $newKey);

        $this->s3Client->copyObject([
            'Bucket' => $bucket,
            'CopySource' => "{$bucket}/{$oldKey}", 
            'Key'        => $newKey,
        ]);

        $this->s3Client->deleteObject([
            'Bucket' => $bucket,
            'Key'    => $oldKey,
        ]);

        return "Renamed {$oldKey} to {$newKey} successfully.";

    }


    public function deleteDocument($documentID, $documentName)
    {
        Document::where('id', $documentID)->delete();

        $s3Key = 'documents/' . $documentName . '.json';
        $bucket = env("AWS_BUCKET");

        $this->s3Client->deleteObject([
            'Bucket' => $bucket,
            'Key'    => $s3Key,
        ]);

        return "Document Deleted Successfully";


    }
}