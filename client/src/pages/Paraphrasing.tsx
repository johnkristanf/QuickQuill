import { NavBar } from "@/components/Navbar";
import { classNames } from "@/lib/utils";
import { faClipboard, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SideBar } from "@/components/SideBar";
import { Paraphrase } from "@/types/paraphrase";
import { useMutation } from "@tanstack/react-query";
import { paraphraseText } from "@/api/post/paraphrase";
  

function ParaphrasingPage(){

    const [activeMode, setActiveMode] = useState<string>("Standard");
    const [paraphrasedText, setParaphrasedText] = useState<string>("");
    
    const { register, handleSubmit } = useForm<Paraphrase>();

    const handleModeChange = (mode: string) => setActiveMode(mode);

    const mutation = useMutation({
        mutationFn: paraphraseText,
        onSuccess: (data) => {
            console.log("reponse from paraphrase: ", data);
            if(data)setParaphrasedText(data.paraphrased_text)

            //   queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })

    const onSubmit: SubmitHandler<Paraphrase> = (data) => {
        data.paraphrase_mode = activeMode; 
        mutation.mutate(data)
        console.log(data);
    }


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

                                        onClick={() => handleModeChange(mode)}
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

                        <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 relative">

                            <div className="w-full h-full relative">

                                {/* PARAPHRASE TEXT AREA TYPING */}
                                
                                <textarea
                                    rows={10}
                                    cols={65}
                                    placeholder='To get started, enter or paste text and press "Paraphrase" '
                                    className="w-full h-full focus:outline-none resize-none p-4 text-lg rounded-md placeholder:text-lg"
                                    {...register("original_text", { required: true })}
                                />

                                {
                                    !paraphrasedText && (
                                        <div className="w-full flex gap-4 justify-center absolute bottom-[17rem] left-1/2 transform -translate-x-1/2 ">
                                            <button
                                                type="button"
                                                className="w-[40%] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                                            >
                                                <span role="img" aria-label="wave">👋</span>
                                                <span>Try Sample Text</span>
                                            </button>

                                            <button
                                                type="button"
                                                className="w-[40%] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                                            >
                                                <FontAwesomeIcon icon={faClipboard} className="text-blue-800" /> 
                                                <span>Paste Text</span>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="absolute bottom-8 right-4 w-[20%]">
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-800 p-2 rounded-full text-white font-bold hover:opacity-75"
                                >
                                    {mutation.isPending ? (
                                        <PulseLoader size={10} color={"#fff"} /> 
                                    ) : (
                                        "Paraphrase"
                                    )}

                                </button>
                            </div>

                        </form>
                            
                        
                        {/* TEXT AREA FOR PARAPHRASE RESULT */}
                        <textarea 
                            value={paraphrasedText && paraphrasedText}
                            rows={5} 
                            cols={40} 
                            className="w-1/2 p-4 text-lg border-l-2 focus:outline-none resize-none"
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