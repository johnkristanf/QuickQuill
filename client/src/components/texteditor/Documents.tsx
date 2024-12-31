/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSavedDocumentContents, getSavedDocuments } from "@/api/get/document"
import { DocumentData, SavedDocuments } from "@/types/document";
import { faEdit, faFile, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisV, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";


import { saveDocument } from "@/api/post/document";
import {  useState } from "react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { classNames } from "@/lib/utils";

import { 
    Dialog, 
    DialogContent, 
    DialogHeader 
} from "@/components/ui/dialog"; 

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { renameDocument } from "@/api/put/document";
import { useDocumentStore } from "@/store/documentStore";

import '../../assets/scroll_style.css'
import { deleteDocument } from "@/api/delete/document";

export function DocumentList({pages, activePageIndex, setPages, setIsLoadingDocumentContent}: {
    pages: any,
    activePageIndex: number,
    setPages: any,
    setIsLoadingDocumentContent: React.Dispatch<React.SetStateAction<boolean>>
}){

    const [activeDocumentID, setActiveDocumentID] = useState<number>();

    const response = useQuery({
        queryKey: ['documents'],
        queryFn: getSavedDocuments
    });
    

    const mutation = useMutation({
        mutationFn: getSavedDocumentContents,
        onSuccess: (data) => {
            console.log("reponse from getSavedDocumentContents: ", data);
            setIsLoadingDocumentContent(false)

            const savedSlateContents = data && data.map((data: any) => {
                return {
                    id: data.id,
                    editor: withReact(withHistory(createEditor())),
                    content: cleanSlateContent(data.document_content)
                }
            });

            console.log("savedSlateContents: ", savedSlateContents);
            

            setPages(savedSlateContents)
        },
    });


    const cleanSlateContent = (content: any[]): any[] => {
        return content.map((node) => {
          const type = node.type || "paragraph"; 
          const children = Array.isArray(node.children) ? node.children : [];
      
          const cleanedChildren = children.map((child: any) => {

            if (child.text !== undefined) {
              return { ...child, text: typeof child.text === "string" ? child.text : "" };
            } else {
              return cleanSlateContent([child])[0];
            }

          });
      
          return { ...node, type, children: cleanedChildren };
        });
      };
      

    const clearEditorContent = () => {
        const updatedPages = [...pages];
        updatedPages[activePageIndex] = {
            ...updatedPages[activePageIndex],
            id: Date.now(),
            editor: withReact(withHistory(createEditor())),
            content: [
                {
                    type: "paragraph",
                    children: [{ text: "" }],
                },
            ],
        };
        setPages(updatedPages);
    };


    const handleGetDocumentContent = (documentID: number, documentName: string) => {
        setActiveDocumentID(documentID);
        clearEditorContent();
        setIsLoadingDocumentContent(true);
        mutation.mutate(documentName);
    }

    const documents: SavedDocuments[] = response.data?.documents;

    
    return(
        <div className="fixed left-0 top-[11rem] flex flex-col items-center gap-5 p-8 w-[20%] h-full bg-white font-semibold dark:text-white dark:bg-black">
            <h1 className="text-xl">Saved Documents</h1>

            <div className="w-full h-[60%] flex flex-col gap-2 overflow-auto ">
                {
                    response.isLoading ? (
                        <h1 className="mt-2 text-lg text-gray-500">Loading...</h1>

                    ) : response.isError && (response.error as AxiosError)?.response?.status === 401 ? (
                        <h1 className="mt-2 text-lg text-gray-500 text-center">
                            You need to login first before you can access your saved documents
                        </h1>

                    ) : documents && documents.length > 0 ? (

                        documents.map((item) => (
                            <div
                                key={item.id}
                                className={classNames(
                                    "flex items-center justify-between w-full p-2 hover:bg-gray-100 hover:cursor-pointer",
                                    activeDocumentID === item.id ? 'bg-gray-200 rounded-xl dark:text-black dark:bg-white' : ''
                                )}
                                onClick={() => handleGetDocumentContent(item.id, item.name)}
                            >
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faFile} />
                                    <h1>{item.name}</h1>
                                </div>

                                <ElipsisOptionDropDown 
                                    id={item.id}
                                    document_name={item.name}
                                />
                                
                            </div>
                        ))

                    ) : (
                        <h1 className="mt-2 text-lg text-gray-500 text-center">
                            No saved documents found
                        </h1>
                    )
                }
            </div>

            
        </div>
    )
}


function ElipsisOptionDropDown({id, document_name}: {
    id: number,
    document_name: string
}){

    const setDocumentDialogOpenState = useDocumentStore((state) => state.setDocumentDialogOpenState);
    const updateDocumentState = useDocumentStore((state) => state.updateDocumentState);
    const setOldDocumentState = useDocumentStore((state) => state.setOldDocumentNameState);

    const handleRenameDocumentDialog = (data: DocumentData) => {
        setDocumentDialogOpenState("renaming")
        setOldDocumentState(data.document_name)
        updateDocumentState(data)
    }



    const handleDeleteDocumentDialog = (data: DocumentData) => {
        setDocumentDialogOpenState("deleting")
        updateDocumentState(data)
    }

   
    
    
    return(
        <>
        
            <DropdownMenu>

                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                    <FontAwesomeIcon 
                        icon={faEllipsisV} 
                        className="text-xl p-2 hover:bg-gray-300" 
                    />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => handleRenameDocumentDialog({ id, document_name })}>
                        <FontAwesomeIcon icon={faEdit}/>
                        Rename
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleDeleteDocumentDialog({ id, document_name })}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <DocumentReNameDialog />
            <DocumentDeleteDialog />

        </>

    )
}


export function DocumentSavingNameDialog({pages}: {
    pages: any
}){

    const [documentName, setDocumentName] = useState<string>("Untitled document");
    const queryClient = useQueryClient();

    const DocumentDialogOpen = useDocumentStore((state) => state.DocumentDialogOpen);
    const setDocumentDialogOpenState = useDocumentStore((state) => state.setDocumentDialogOpenState);


    const mutation = useMutation({
        mutationFn: saveDocument,
        onSuccess: (data) => {
            console.log("reponse from save document: ", data);
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            setDocumentDialogOpenState("")
        },
    })
    

    const handleSaveDocument = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const document_content = pages.map((page: any) => ({
            id: page.id,
            document_content: page.content
        }));
    
    
        console.log("document_content: ", document_content);
            
        mutation.mutate({
            document_name: documentName,
            document_content
        })
    }

   
        

    return (
        <Dialog open={DocumentDialogOpen == "saving" ? true : false} onOpenChange={() => setDocumentDialogOpenState("")}>
            <DialogContent className="bg-white font-semibold">

                <DialogHeader>
                    <DialogTitle className="text-2xl">Save your document</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Your documents will be save in a secured amazon cloud service
                    </DialogDescription>
                </DialogHeader>

                
                <form onSubmit={(event) => handleSaveDocument(event)} className="w-full flex flex-col items-center justify-center">
                    <input 
                        type="text" 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-gray-300 " 
                        onChange={(e) => setDocumentName(e.target.value)}
                        value={documentName}
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className={classNames(
                           "w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded",
                            mutation.isPending ? 'bg-gray-300': ''
                        )}
                    >
                        { mutation.isPending ? 'Saving....': 'Save' }
                    </button>
                </form>

                
            </DialogContent>
        </Dialog>
    )
}



export function DocumentReNameDialog(){

    const document = useDocumentStore((state) => state.data);

    const old_document_name = useDocumentStore((state) => state.old_document_name);
    const updateState = useDocumentStore((state) => state.updateDocumentState);
    const setOldDocumentNameState = useDocumentStore((state) => state.setOldDocumentNameState);

    const DocumentDialogOpen = useDocumentStore((state) => state.DocumentDialogOpen);
    const setDocumentDialogOpenState = useDocumentStore((state) => state.setDocumentDialogOpenState);


    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: renameDocument,
        onSuccess: () => {
            console.log("rename success");
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            setDocumentDialogOpenState("")
            updateState({id: 0, document_name: ""})
            setOldDocumentNameState("")
        }
    })
    

    const handleRenameDocument = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        document.old_document_name = old_document_name
        mutation.mutate(document)
    }

    return (
        <Dialog open={DocumentDialogOpen == "renaming" ? true : false} onOpenChange={() => setDocumentDialogOpenState("")}>
            <DialogContent className="bg-white font-semibold">

                <DialogHeader>
                    <DialogTitle className="text-2xl">Rename your document</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Your documents will be save in a secured amazon cloud service
                    </DialogDescription>
                </DialogHeader>

                
                <form onSubmit={(event) => handleRenameDocument(event)} className="w-full flex flex-col items-center justify-center">
                    <input 
                        type="text" 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-gray-300 " 
                        onChange={(e) => updateState({ id: document.id, document_name: e.target.value })}
                        value={document.document_name}
                    />

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className={classNames(
                           "w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded",
                            mutation.isPending ? 'bg-gray-300': ''
                        )}
                    >
                        { mutation.isPending ? 'Renaming....': 'Rename' }
                    </button>
                </form>

                
            </DialogContent>
        </Dialog>
    )
}


function DocumentDeleteDialog(){
    
    const documentDataState = useDocumentStore((state) => state.data);
    const DocumentDialogOpen = useDocumentStore((state) => state.DocumentDialogOpen);
    const setDocumentDialogOpenState = useDocumentStore((state) => state.setDocumentDialogOpenState);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            console.log("deleted successfully");
            setDocumentDialogOpenState("");
            queryClient.invalidateQueries({queryKey: ['documents']})
        }
    });


    return (
        <Dialog open={DocumentDialogOpen == "deleting" ? true : false} onOpenChange={() => setDocumentDialogOpenState("")}>
            <DialogContent className="bg-white font-semibold">

                <DialogHeader>
                    <DialogTitle className="text-2xl flex gap-2 items-center">
                        <FontAwesomeIcon icon={faWarning} className="text-red-800"/>
                        Delete your document
                    </DialogTitle>

                    <DialogDescription className="text-gray-500 text-sm">
                        Are you sure you want to delete your document? This action cannot be reverted
                    </DialogDescription>
                </DialogHeader>

                <button
                    className={classNames(
                        "w-full mt-4 px-4 py-2 text-white rounded",
                        mutation.isPending ? 'bg-gray-300': 'bg-red-800'
                    )}

                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(documentDataState)}
                >
                    { mutation.isPending ? 'Deleting....': 'Delete' }
                </button>
            </DialogContent>
        </Dialog>
    )

    
}