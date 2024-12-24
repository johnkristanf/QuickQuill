/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor } from "slate";
import { BulletElement, Leaf, NumberedElement, ParagraphElement } from "@/components/texteditor/CustomElements";
import { toggleEditorMethods } from "@/lib/utils";
import { NavBar } from "@/components/Navbar";
import LeftToolBars from "@/components/texteditor/LeftToolBars";
import MiddleToolBars from "@/components/texteditor/MiddleToolBars";
import RightToolBars from "@/components/texteditor/RightToolBars";

import '../assets/print.css';
import ChatBot from "@/components/ChatBot";

function TextEditorPage(){

    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const initialValue = [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
    ];

    const renderElement = useCallback((props: any) => {

        switch (props.element.list_type) {
            case "bullet-list":
              return <BulletElement {...props} />;
            case "numbered-list":
              return <NumberedElement {...props} />;

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
                <RightToolBars editor={editor}/>
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
                        spellCheck
                        autoFocus
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        onKeyDown={event => {
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




export default TextEditorPage;