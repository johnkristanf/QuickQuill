import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PulseLoader } from "react-spinners";

export function FloatingParaphraseHelperButton(){
    return(
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


export function SubmitParaphraseButton({
    isPending
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isPending: boolean
}){
    return(
        <div className="absolute bottom-8 right-4 w-[20%]">
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-800 p-2 rounded-full text-white font-bold hover:opacity-75"
                                >
                                    {isPending ? (
                                        <PulseLoader size={10} color={"#fff"} /> 
                                    ) : (
                                        "Paraphrase"
                                    )}

                                </button>
                            </div>
    )
}