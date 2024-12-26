import { faCaretDown, faPrint, faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HistoryEditor } from "slate-history";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { exportToWord } from "@/helpers/export_word";

function LeftToolBars({ editor, setZoomLevel }: { 
    editor: HistoryEditor,
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>
}){

    const values = Array.from({ length: (200 - 50) / 25 + 1 }, (_, index) => 50 + index * 25);

    const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const zoom = parseInt(e.target.value, 10) / 100; 
        
        setZoomLevel(zoom);
    };

    const handlePrint = () => {
        const printableContent = document.getElementById('print-editor');
        if (printableContent) {
            const printWindow = window.open('', '_blank', 'width=1200,height=1000');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>QuickQuill Print Document</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 20px;
                                }
                                #print-editor {
                                    width: 100%;
                                    height: 200vh;
                                    transform: scale(1.5); 
                                    transform-origin: top left;
                                    border: none;
                                }
                            </style>
                        </head>
                        <body>
                            ${printableContent.innerHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
    
                // Close the print window after printing
                printWindow.onafterprint = () => printWindow.close();
            }
        }
    };
    
    
      


    return (
        <div className="flex items-center gap-4 font-semibold">

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 focus:outline-none hover:cursor-pointer hover:bg-gray-300 ">
                    <h1>Export</h1>
                    <FontAwesomeIcon icon={faCaretDown} />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem onClick={exportToWord} className="flex items-center hover:cursor-pointer">
                        Microsoft Word (.docx)
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                        className="flex items-center hover:cursor-pointer "
                    >
                        PDF Document (.pdf)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            
            </DropdownMenu>

            <FontAwesomeIcon 
                icon={faRotateLeft}
                className="hover:bg-gray-300 p-2"
                onClick={() => HistoryEditor.undo(editor)}
            />
            <FontAwesomeIcon 
                icon={faRotateRight}
                className="hover:bg-gray-300 p-2"
                onClick={() => HistoryEditor.redo(editor)}

            />

            <FontAwesomeIcon 
                icon={faPrint}
                className="hover:bg-gray-300 p-2"
                onClick={handlePrint}
            />

            <select
                id="dropdown"
                className="bg-transparent rounded-md w-full focus:outline-none"
                onChange={handleZoomChange}
                defaultValue={100}
            >
                {values.map((value) => (
                <option key={value} value={value}>
                    {value} %
                </option>
                ))}
            </select>

        </div>
    )
}

export default LeftToolBars;