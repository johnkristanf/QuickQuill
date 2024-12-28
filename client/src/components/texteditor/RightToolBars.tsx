import { isActiveCheckerMethods, notToggleableEditorMethods, toggleEditorMethods } from "@/lib/utils";
import { faIndent, faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "slate";

import BarLeft from '../../assets/img/bar_left.png';
import BarCenter from '../../assets/img/bar_center.png';
import BarRight from '../../assets/img/bar_right.png';
import BarJustify from '../../assets/img/bar_justify.png';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function RightToolBars({ editor, isBulletListActive, isNumberedListActive, setIsBulletListActive, setIsNumberedListActive }: { 
    editor: Editor,
    isBulletListActive: boolean, 
    isNumberedListActive: boolean, 
    setIsBulletListActive: React.Dispatch<React.SetStateAction<boolean>>, 
    setIsNumberedListActive: React.Dispatch<React.SetStateAction<boolean>>
}){

    

    const handleBulletActive = () => {
        toggleEditorMethods.toggleBulletBlock(editor)
        setIsBulletListActive(isActiveCheckerMethods.isBulletBlockActive(editor))

    }
    
    
    const handleNumberedActive = () => {
        toggleEditorMethods.toggleNumberedBlock(editor)
        setIsNumberedListActive(isActiveCheckerMethods.isNumberedBlockActive(editor))
    }

    
    const alignmentIcons = [
        { name: 'left', src: BarLeft, width: 20, },
        { name: 'center', src: BarCenter, width: 17 },
        { name: 'right', src: BarRight, width: 20 },
        { name: 'justify', src: BarJustify, width: 17 },
    ]


    return (
        <div className="flex items-center gap-5 font-semibold">

            <DropdownMenu>
                <DropdownMenuTrigger className="hover:cursor-pointer " asChild>
                    <FontAwesomeIcon 
                        icon={faIndent}
                        className="hover:bg-gray-300 p-2"
                    />
                </DropdownMenuTrigger>
            
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem className="flex items-center justify-around gap-4 hover:cursor-pointer">
                        {
                            alignmentIcons.map((item, index) => (
                                <img 
                                    key={index}
                                    src={item.src} 
                                    width={17} 
                                    className="hover:bg-gray-200"
                                    onClick={() => notToggleableEditorMethods.setTextAlignment(editor, item.name)}
                                />
                            ))
                        }
                    </DropdownMenuItem>
                    
                </DropdownMenuContent>
                        
            </DropdownMenu>
            
            
            <FontAwesomeIcon 
                icon={faListUl}
                className={`hover:bg-gray-200 p-2 ${isBulletListActive ? "bg-gray-300" : ""}`}
                onClick={handleBulletActive}

            />

            <FontAwesomeIcon 
                icon={faListOl}
                className={`hover:bg-gray-200 p-2 ${isNumberedListActive ? "bg-gray-300" : ""}`}
                onClick={handleNumberedActive}

            />

        </div>
    )
}

export default RightToolBars;