import { classNames } from "@/lib/utils";
import { ParaphrasingHistory } from "./History";

export function ModeSelection({ activeMode, setActiveMode}: {
    activeMode: string,
    setActiveMode: React.Dispatch<React.SetStateAction<string>>
}){


    const languages = [
        "English",
        "Tagalog",
    ]
    
    const modes = [
        "Standard",
        "Creative",
        "Academic",
    ]

    const handleModeChange = (mode: string) => setActiveMode(mode);

    
    return(
        <>
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
           
                                                   onClick={() => handleModeChange(mode)}
                                               >
                                                   { mode } 
                                               </h1>
                                           ))
                                       }
                                   </div>
           
           
                                   <ParaphrasingHistory />
           
                               </div>
        </>
    )
}