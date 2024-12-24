import { notToggleableEditorMethods, toggleEditorMethods } from "@/lib/utils";
import { faBold, faItalic, faMinus,  faPlus, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import { Editor } from "slate";

function MiddleToolBars({ editor }: { editor: Editor }) {
  const colorRef = useRef<HTMLInputElement>(null);

  const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
  const fontSizes = [8, 9, 10, 11, 12, 13, 14, 18, 24, 30, 36, 48, 60, 72, 96];
  const [fontSize, setFontSize] = useState(13); 


    const handleColorPick = () => {
        if (colorRef.current) {
            colorRef.current.click();
        }
    };

    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedColor = event.target.value;
        notToggleableEditorMethods.setTextColorMark(editor, selectedColor)
    } 

    const handleFontChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectFont = event.target.value;
        notToggleableEditorMethods.setFontFamily(editor, selectFont);
    }

    const increaseFontSize = () => {
        const currentIndex = fontSizes.indexOf(fontSize);
        if (currentIndex < fontSizes.length - 1) {
          const newFontSize = fontSizes[currentIndex + 1];
          setFontSize(newFontSize);
          notToggleableEditorMethods.adjustFontSize(editor, newFontSize - fontSize); 
        }
    };
      const decreaseFontSize = () => {
        const currentIndex = fontSizes.indexOf(fontSize);
        if (currentIndex > 0) {
          const newFontSize = fontSizes[currentIndex - 1];
          setFontSize(newFontSize);
          notToggleableEditorMethods.adjustFontSize(editor, newFontSize - fontSize); // Pass negative adjustment
        }
      };
      
  return (
    <div className="flex items-center gap-8 font-semibold">

        <select
            className="px-2 bg-transparent focus:outline-none"
            onChange={handleFontChange}
            defaultValue={notToggleableEditorMethods.getFontFamily(editor) || "default"}
        >
            {
                fonts.map((font) => (
                    <option key={font} value={font}>
                        {font}
                    </option>
                ))
            }
        </select>

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
