import { DOCUMENT_FONT_SIZES, DOCUMENT_FONTS, notToggleableEditorMethods, toggleEditorMethods } from "@/lib/utils";
import { faBold, faChevronDown, faItalic, faMinus,  faPlus, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import { Editor } from "slate";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import '../../assets/scroll_style.css';

function MiddleToolBars({ editor }: { editor: Editor }) {

  const colorRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState(13);
  const [selectedFontSize, setSelectedFontSize] = useState<string>("Arial")


    const handleColorPick = () => {
        if (colorRef.current) {
            colorRef.current.click();
        }
    };

    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedColor = event.target.value;
        notToggleableEditorMethods.setTextColorMark(editor, selectedColor)
    } 

    const handleFontChange = (selectedFont: string) => {
        setSelectedFontSize(selectedFont)
        notToggleableEditorMethods.setFontFamily(editor, selectedFont);
    }

    const increaseFontSize = () => {
        const currentIndex = DOCUMENT_FONT_SIZES.indexOf(fontSize);
        if (currentIndex < DOCUMENT_FONT_SIZES.length - 1) {
          const newFontSize = DOCUMENT_FONT_SIZES[currentIndex + 1];
          setFontSize(newFontSize);
          notToggleableEditorMethods.adjustFontSize(editor, newFontSize - fontSize); 
        }
    };
      const decreaseFontSize = () => {
        const currentIndex = DOCUMENT_FONT_SIZES.indexOf(fontSize);
        if (currentIndex > 0) {
          const newFontSize = DOCUMENT_FONT_SIZES[currentIndex - 1];
          setFontSize(newFontSize);
          notToggleableEditorMethods.adjustFontSize(editor, newFontSize - fontSize); // Pass negative adjustment
        }
      };
      
  return (
    <div className="flex items-center gap-8 font-semibold">

        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-4 p-2 focus:outline-none hover:cursor-pointer hover:bg-gray-300 ">
                <h1>{ selectedFontSize }</h1>
                <FontAwesomeIcon icon={faChevronDown}/>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white max-h-56 flex flex-col gap-2 scroll-container overflow-auto">
                {
                    DOCUMENT_FONTS.map((font: string) => (
                        <DropdownMenuItem 
                            key={font} 
                            onClick={() => handleFontChange(font)}
                            className="hover:cursor-pointer "
                        >
                            {font}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
            
        </DropdownMenu>


        <div className="flex items-center gap-2">
            <button
                onClick={decreaseFontSize}
                className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-200"
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>

            <input
                type="text"
                value={fontSize}
                readOnly
                className="w-16 text-center bg-transparent border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                min={8}
                max={96}
            />

            <button
                onClick={increaseFontSize}
                className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-200"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>


        <div className="flex items-center gap-4 p-3">
            <button 
                className="w-8 h-8 text-lg font-bold rounded-md flex items-center justify-center hover:bg-gray-200"
                onClick={() => toggleEditorMethods.toggleBoldMark(editor)}
            >
                <FontAwesomeIcon icon={faBold}/>
            </button>

            <button 
                className="w-8 h-8 text-lg italic rounded-md flex items-center justify-center hover:bg-gray-200"
                onClick={() => toggleEditorMethods.toggleItalicMark(editor)}

            >
                <FontAwesomeIcon icon={faItalic}/>
            </button>

            <button 
                className="w-8 h-8 text-lg underline rounded-md flex items-center justify-center hover:bg-gray-200"
                onClick={() => toggleEditorMethods.toggleUnderlineMark(editor)}
            >
                <FontAwesomeIcon icon={faUnderline}/>
            </button>

            <div
                className="flex flex-col items-center font-semibold hover:cursor-pointer"
                onClick={handleColorPick}
                onChange={handleColorChange}
            >
                <h1>A</h1>
                <input
                    type="color"
                    ref={colorRef}
                    className="w-8 h-3 hover:cursor-pointer"
                    readOnly
                />
            </div>
            
        </div>
    </div>
  );
}

export default MiddleToolBars;
