<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    private $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    public function saveDocument(Request $request)
    {
        $validated = $request->validate([
            'document_name' => 'required|string',
            'document_content' => 'required|array',
        ]);

        $documentName = $validated['document_name'];
        $documentContent = $validated['document_content'];

        $isDocumentNameExist = $this->documentService->isDocumentNameExist($documentName);
        
        if(!$isDocumentNameExist){
            $this->documentService->saveDocumentMetaDataToDB($documentName);
        }

        $this->documentService->saveDocumentToBucket($documentName, $documentContent);

        return response()->json(['message' => 'Document Saved!'], 201);
    }


    public function getDocumentMetaDataDB()
    {
        $document = $this->documentService->getDocumentMetaData();
        return response()->json(['documents' => $document], 200);
    }

    public function getDocumentContent($documentName)
    {
        $documentContent = $this->documentService->getDocumentContentFromBucket($documentName);
        return response()->json(json_decode($documentContent), 200);
    }


    public function renameDocument(Request $request, $id)
    {
        $validated = $request->validate([
            'document_name' => 'required|string',
            'old_document_name' => 'required|string',
        ]);

        $documentName = $validated['document_name'];
        $oldDocumentName = $validated['old_document_name'];

        $renamed = $this->documentService->renameDocument($id, $documentName, $oldDocumentName);

        if($renamed){
            return response()->json(['message' => 'Document updated successfully.'], 200);
        }

        return response()->json(['message' => 'Error in renaming document'], 500);


    }


    public function deleteDocument($id, $documentName)
    {
        $deleted = $this->documentService->deleteDocument($id, $documentName);

        if($deleted){
            return response()->json(['message' => 'Document deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Error in deleting document'], 500);
    }
}
