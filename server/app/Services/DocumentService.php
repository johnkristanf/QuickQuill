<?php

namespace App\Services;

use App\Models\Document;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Auth;

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
}