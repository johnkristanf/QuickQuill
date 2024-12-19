import { NavBar } from "@/components/Navbar";
import { useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";


import { SideBar } from "@/components/SideBar";
import { Paraphrase } from "@/types/paraphrase";
import { useMutation } from "@tanstack/react-query";
import { paraphraseText } from "@/api/post/paraphrase";
import { FloatingParaphraseHelperButton, SubmitParaphraseButton } from "@/components/paraphrasing/Buttons";
import { ModeSelection } from "@/components/paraphrasing/ModeSelection";
  

function ParaphrasingPage(){

    // CHANGE THIS STATE activeMode and setActiveMode PASSING TO ZUSTAND SOON 
    // ALSO ARRANGE THE DIFFERENT COMPONENTS FORMAT CAUSE IT'S WRECKED
    
    const [activeMode, setActiveMode] = useState<string>("Standard");

    const [paraphrasedText, setParaphrasedText] = useState<string>("");
    
    const { register, handleSubmit } = useForm<Paraphrase>();


    const mutation = useMutation({
        mutationFn: paraphraseText,
        onSuccess: (data) => {
            console.log("reponse from paraphrase: ", data);
            if(data) setParaphrasedText(data.paraphrased_text)

            //   queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })

    const onSubmit: SubmitHandler<Paraphrase> = (data) => {
        data.paraphrase_mode = activeMode; 
        mutation.mutate(data)
        console.log(data);
    }


    
    return(
        <div className="h-screen w-full bg-gray-100 ">
            <NavBar />
            <SideBar />

            <div className="w-full h-full flex justify-end p-8 mt-24">

                <div className="w-[85%] bg-white flex flex-col rounded-xl ">

                    {/* CHANGE THIS STATE PASSING TO ZUSTAND SOON */}
                    <ModeSelection activeMode={activeMode} setActiveMode={setActiveMode}/>                    


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

                                { !paraphrasedText && ( <FloatingParaphraseHelperButton /> ) }

                            </div>

                            <SubmitParaphraseButton isPending={mutation.isPending}/>                            

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