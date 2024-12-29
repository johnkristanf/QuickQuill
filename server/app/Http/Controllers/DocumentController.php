<?php

namespace App\Http\Controllers;

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

        // ADD A CONDITIONAL FUNCTION HERE IF THE DOCUMENT NAME EXIST (SELECT IT IN DB)
        // CHANGE THE NAME WITH (1) CONDITION THE LEN OF THE SELECTED DATA 
        // TO PUT WHAT CORRECT PARENTHESIS NUMBER

        $this->documentService->saveDocumentMetaDataToDB($validated['document_name']);
        $this->documentService->saveDocumentToBucket($validated['document_name'], $validated['document_content']);

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
}
