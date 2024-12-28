/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor, Editor, Element } from "slate";
import { BulletElement, Leaf, NumberedElement, ParagraphElement } from "@/components/texteditor/CustomElements";
import { toggleEditorMethods, unwrappingNodeMethods } from "@/lib/utils";
import { NavBar } from "@/components/Navbar";
import LeftToolBars from "@/components/texteditor/LeftToolBars";
import MiddleToolBars from "@/components/texteditor/MiddleToolBars";
import RightToolBars from "@/components/texteditor/RightToolBars";

import "../assets/print.css";
import "../assets/pages.css";
import ChatBot from "@/components/ChatBot";

function TextEditorPage() {
    // Function to create a new page
    const createNewPage = () => ({
        id: Date.now(),
        editor: withReact(withHistory(createEditor())),
        content: [
            {
                type: "paragraph",
                children: [{ text: "" }],
            },
        ],
    });

    const [pages, setPages] = useState([createNewPage()]);
    const [activePageIndex, setActivePageIndex] = useState<number>(0);

    const handleContentChange = (pageIndex: number, value: any) => {
        const updatedPages = [...pages];
        updatedPages[pageIndex].content = value;
        setPages(updatedPages);

        setTimeout(() => {
            const pageElement = document.getElementById(`page-${pageIndex}`);
    
            if (pageElement && pageElement.scrollHeight > pageElement.clientHeight) {
                if (pageIndex === pages.length - 1) {
                    const newPage = createNewPage();
                    setPages([...updatedPages, newPage]);
                }
            }
        }, 0); 
    };

    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [isBulletListActive, setIsBulletListActive] = useState<boolean>(false);
    const [isNumberedListActive, setIsNumberedListActive] = useState<boolean>(false);

    const renderElement = useCallback((props: any) => {
        console.log("Type: ", props.element.type);

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
    }, []);

    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />;
    }, []);

    console.log("activePageIndex: ", activePageIndex);
    

    return (
        <div className="w-full flex flex-col items-center gap-3 h-[120vh] pb-5">
            <NavBar />

            <div className="fixed top-0 w-full h-[13%] flex justify-between items-center rounded-xl bg-slate-100 mt-[6rem] p-5 z-[5]">
                <LeftToolBars editor={pages[activePageIndex].editor}  setZoomLevel={setZoomLevel} />
                <MiddleToolBars editor={pages[activePageIndex].editor}  />
                <RightToolBars
                    editor={pages[activePageIndex].editor} 
                    isBulletListActive={isBulletListActive}
                    isNumberedListActive={isNumberedListActive}
                    setIsBulletListActive={setIsBulletListActive}
                    setIsNumberedListActive={setIsNumberedListActive}
                />
            </div>

            <div className="editor-container">
                {pages.map((page, pageIndex) => (
                    <div
                        key={page.id}
                        id={`page-${pageIndex}`}

                        className="page"
                        data-slate-content={JSON.stringify(page.content)}

                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: "top left",
                            transition: "transform 0.2s",
                        }}
                    >
                        <Slate
                            editor={page.editor} 
                            initialValue={page.content}
                            onChange={(value) => handleContentChange(pageIndex, value)}
                        >
                            <Editable
                                className="w-full bg-white p-8 rounded-xl focus:outline-none"
                                spellCheck={true}
                                autoFocus
                                autoCorrect="on"
                                autoComplete="on"
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}

                                onFocus={() => setActivePageIndex(pageIndex)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        const [match] = Editor.nodes(page.editor, {
                                            // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
                                            match: (n) => Element.isElement(n) && n.type === "list-item",
                                        });

                                        if (match) {
                                            const [, path] = match;
                                            const isEmpty = Editor.string(page.editor, path) === "";

                                            if (isEmpty) {
                                                event.preventDefault();

                                                const parent = unwrappingNodeMethods.listTypeParentNodeCheck(
                                                    page.editor,
                                                    "numbered-list",
                                                    "bullet-list"
                                                );

                                                if (parent) {
                                                    const [parentNode] = parent;

                                                    // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
                                                    const parentType = parentNode.type;

                                                    if (parentType === "bullet-list") {
                                                        unwrappingNodeMethods.unwrapSelectedListType(
                                                            page.editor,
                                                            parentNode,
                                                            setIsBulletListActive
                                                        );
                                                    } else if (parentType === "numbered-list") {
                                                        unwrappingNodeMethods.unwrapSelectedListType(
                                                            page.editor,
                                                            parentNode,
                                                            setIsNumberedListActive
                                                        );
                                                    }
                                                }
                                                return;
                                            }

                                            event.preventDefault();

                                            const parent = unwrappingNodeMethods.listTypeParentNodeCheck(
                                                page.editor,
                                                "numbered-list",
                                                "bullet-list"
                                            );

                                            if (parent) {
                                                const [parentNode] = parent;

                                                // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
                                                const parentType = parentNode.type;

                                                if (parentType === "bullet-list") {
                                                    toggleEditorMethods.insertNewBulletListItem(page.editor);
                                                } else if (parentType === "numbered-list") {
                                                    toggleEditorMethods.insertNewListItem(page.editor);
                                                }
                                            }
                                        }
                                    }

                                    if (!event.ctrlKey) {
                                        return;
                                    }

                                    switch (event.key) {
                                        case "b": {
                                            event.preventDefault();
                                            toggleEditorMethods.toggleBoldMark(page.editor);
                                            break;
                                        }

                                        case "i": {
                                            event.preventDefault();
                                            toggleEditorMethods.toggleItalicMark(page.editor);
                                            break;
                                        }

                                        case "u": {
                                            event.preventDefault();
                                            toggleEditorMethods.toggleUnderlineMark(page.editor);
                                            break;
                                        }

                                        default:
                                            break;
                                    }
                                }}
                            />
                        </Slate>
                    </div>
                ))}
            </div>

            <ChatBot />
        </div>
    );
}

export default TextEditorPage;
