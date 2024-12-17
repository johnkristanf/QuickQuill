import { NavBar } from "@/components/Navbar";
import { classNames } from "@/lib/utils";
import { faClipboard, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SideBar } from "@/components/SideBar";
  

function ParaphrasingPage(){

    const [activeMode, setActiveMode] = useState<string>("Standard");

    const languages = [
        "English",
        "Tagalog",
    ]

    const modes = [
        "Standard",
        "Fluency",
        "Academic",
    ]

    return(
        <div className="h-screen w-full bg-gray-100 ">
            <NavBar />
            <SideBar />

            <div className="w-full h-full flex justify-end p-8 mt-24">

                <div className="w-[85%] bg-white flex flex-col rounded-xl ">
                    <div className="flex gap-3 p-3 font-semibold text-lg">
                        {
                            languages.map((language) => (
                                <h1 
                                    key={language}
                                    className="hover:cursor-pointer"
                                >
                                    { language }
                                </h1>
                            ))
                        }
                    </div>

                    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 p-4 ">

                        <div className="flex gap-3 bg-white text-xl text-slate-700 font-semibold">
                            Modes: {
                                modes.map((mode) => (
                                    <h1 
                                        key={mode}
                                        className={classNames(
                                            "hover:cursor-pointer mb-[-18px]",
                                            activeMode == mode ? "text-blue-800 border-b-2 border-blue-800" : "text-slate-700"
                                        )}

                                        onClick={() => setActiveMode(mode)}
                                    >
                                        { mode } 
                                    </h1>
                                ))
                            }
                        </div>


                        <Sheet>
                            <SheetTrigger asChild>
                                <h1 className="text-lg font-semibold hover:cursor-pointer hover:opacity-75 mr-3">
                                    <FontAwesomeIcon icon={faClock}/> Paraphrase History
                                </h1>
                            </SheetTrigger>

                            <SheetContent>
                                <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    Name
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    Username
                                </div>
                                </div>
                                
                            </SheetContent>
                        </Sheet>

                    </div>


                    

                    <div className="w-full h-full flex ">

                        <form className="relative flex flex-col gap-4 w-1/2 h-full p-5">
                            <div className="h-full relative">

                                {/* PARAPHRASE TEXT AREA TYPING */}

                                <textarea
                                    rows={5}
                                    cols={40}
                                    placeholder='To get started, enter or paste text and press "Paraphrase" '
                                    className="w-full h-full focus:outline-none resize-none p-4 rounded-md placeholder:text-lg"
                                />

                                {/* FLOATING BUTTONS */}

                                <div className="w-full flex gap-4 justify-center absolute bottom-[13rem] left-1/2 transform -translate-x-1/2 ">
                                    <button
                                        type="button"
                                        className="w-[40%] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                                    >
                                        <span role="img" aria-label="wave">👋</span>
                                        <span>Try Sample Text</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="w-[40%] flex items-center justify-center  gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                                    >
                                        <FontAwesomeIcon icon={faClipboard} className="text-blue-800" /> 
                                        <span>Paste Text</span>
                                    </button>
                                </div>

                            </div>

                            <div className="sticky bottom-0 w-[30%] p-3 self-end">
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-800 p-2 rounded-full text-white font-bold hover:opacity-75 self-end"
                                >
                                    Paraphrase
                                </button>
                            </div>

                        </form>
                            
                        
                        {/* TEXT AREA FOR PARAPHRASE RESULT */}
                        <textarea 
                            rows={5} 
                            cols={40} 
                            className="w-1/2 border-l-2 focus:outline-none resize-none"
                            readOnly
                        >
                        </textarea>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default ParaphrasingPage;