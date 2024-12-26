/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor, Editor, Element, Transforms } from "slate";
import { BulletElement, Leaf, NumberedElement, ParagraphElement } from "@/components/texteditor/CustomElements";
import { isActiveCheckerMethods, toggleEditorMethods } from "@/lib/utils";
import { NavBar } from "@/components/Navbar";
import LeftToolBars from "@/components/texteditor/LeftToolBars";
import MiddleToolBars from "@/components/texteditor/MiddleToolBars";
import RightToolBars from "@/components/texteditor/RightToolBars";

import '../assets/print.css';
import ChatBot from "@/components/ChatBot";

function TextEditorPage(){

    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const [isBulletListActive, setIsBulletListActive] = useState<boolean>(false);
    const [isNumberedListActive, setIsNumberedListActive] = useState<boolean>(false);


    const initialValue = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];
    


    const renderElement = useCallback((props: any) => {

        console.log("Type: ", props.element.type)

        switch (props.element.type) {
            case "bullet-list":
              return <BulletElement {...props} />;
            case "numbered-list":
              return <NumberedElement {...props} />;
            case "list-item":
              return <li {...props.attributes}>{props.children}</li>;

        default:
            return <ParagraphElement {...props} />;

        }
               
    }, [])


    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />
    }, [])


    return (

        <div className="w-full flex flex-col items-center gap-3 h-[120vh] pb-5">
            <NavBar />

            <div className="w-[90%] h-[10%] flex justify-between items-center rounded-xl bg-slate-100 mt-[7rem] p-5 z-[5]">
                <LeftToolBars editor={editor} setZoomLevel={setZoomLevel}/>
                <MiddleToolBars editor={editor}/>
                <RightToolBars 
                    editor={editor} 
                    isBulletListActive={isBulletListActive} 
                    isNumberedListActive={isNumberedListActive}
                    setIsBulletListActive={setIsBulletListActive}
                    setIsNumberedListActive={setIsNumberedListActive}
                />
            </div>


            <div  
                id="print-editor"
                className="w-[80%] h-full border-2 border-gray-200"
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "top left",
                    transition: "transform 0.2s", 
                }}
            >
            
                <Slate editor={editor} initialValue={initialValue}>

                    <Editable 
                        className="w-full bg-white p-8 rounded-xl focus:outline-none"
                        spellCheck={true}
                        autoFocus
                        autoCorrect="on"
                        autoComplete="on"
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        onKeyDown={event => {

                            if (event.key === 'Enter') {
                                const [match] = Editor.nodes(editor, {
                                    match: n => Element.isElement(n) && n.type === 'list-item',
                                });
                        
                                if (match) {
                                    const [, path] = match; // Extract node and path
                        
                                    const isEmpty = Editor.string(editor, path) === '';
                        
                                    if (isEmpty) {
                                        event.preventDefault();

                                        const [parent] = Editor.nodes(editor, {
                                            match: n => Element.isElement(n) && (n.type === 'bullet-list' || n.type === 'numbered-list'),
                                        })

                                        if(parent){
                                            const [parentNode] = parent;

                                            Transforms.setNodes(editor, {
                                                type: 'paragraph',
                                            });

                                            if(parentNode.type === 'bullet-list'){
                                                Transforms.unwrapNodes(editor, {
                                                    match: n =>
                                                        Element.isElement(n) &&
                                                        n.type === 'bullet-list',
                                                    split: true,
                                                });

                                                setIsBulletListActive(isActiveCheckerMethods.isBulletBlockActive(editor))

                                            } else if(parentNode.type === 'numbered-list'){
                                                Transforms.unwrapNodes(editor, {
                                                    match: n =>
                                                        Element.isElement(n) &&
                                                        n.type === 'numbered-list',
                                                    split: true,
                                                });

                                                setIsNumberedListActive(isActiveCheckerMethods.isNumberedBlockActive(editor))
                                            } 

                                           
                                        }
                        
                                        
                        
                                        return;
                                    }
                        
                                    event.preventDefault();
                        
                                    const [parent] = Editor.nodes(editor, {
                                        match: n =>
                                            Element.isElement(n) &&
                                            (n.type === 'bullet-list' || n.type === 'numbered-list'),
                                    });
                        
                                    if (parent) {
                                        const [parentNode] = parent;
                                        if (parentNode.type === 'bullet-list') {
                                            toggleEditorMethods.insertNewBulletListItem(editor);

                                        } else if (parentNode.type === 'numbered-list') {
                                            toggleEditorMethods.insertNewListItem(editor);
                                        }
                                    }
                                }
                            }


                            if (!event.ctrlKey) {
                                return;
                            }

                            switch (event.key) {
                                
                                case 'b': {
                                    event.preventDefault();
                                    toggleEditorMethods.toggleBoldMark(editor)
                                    break;
                                }

                                case 'i': {
                                    event.preventDefault();
                                    toggleEditorMethods.toggleItalicMark(editor)
                                    break;
                                }

                                case 'u': {
                                    event.preventDefault();
                                    toggleEditorMethods.toggleUnderlineMark(editor)
                                    break;
                                }
                                
                                default:
                                    break;
                            }

                        }}
                    />
                </Slate>

            </div>
            
            <ChatBot />

        </div>
    )
}


// const handleAddingNewNumberedList = (event: React.KeyboardEvent<HTMLDivElement>, editor: any) => {
//     if (event.key === 'Enter') {
//         // Check if the current block is a list-item
//         const [match] = Editor.nodes(editor, {
//             match: n => n.type === 'list-item',
//         });

//         if (match) {
//             const [node] = match;

//             // Check if the current list-item is empty
//             if (Node.string(node).length === 0) {
//                 event.preventDefault();

//                 // Transform the current empty list-item into a paragraph
//                 Transforms.setNodes(editor, { type: 'paragraph' });

//                 return;
//             }

//             event.preventDefault();

//             // Insert a new list-item inside the numbered-list
//             Transforms.insertNodes(editor, {
//                 type: 'list-item',
//                 children: [{ text: '' }],
//             });

//             return;
//         }
//     }
// };



export default TextEditorPage;