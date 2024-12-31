import { getParaphrasingHistory } from "@/api/get/history";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { History } from "@/types/document";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";

import '../../assets/scroll_style.css';
import { formatDate } from "@/lib/utils";
import { useHistoryStore } from "../../store/historyStore";

export function ParaphrasingHistory(){

    const { data, isLoading } = useQuery({
        queryKey: ['paraphrase_history'], 
        queryFn: getParaphrasingHistory 
    })

    const updateHistoryState = useHistoryStore((state) => state.updateHistoryState);
    const history = data?.history || [];


    return(
        <Sheet>
            <SheetTrigger asChild>
                <h1 className="text-lg font-semibold hover:cursor-pointer hover:opacity-75 mr-3">
                    <FontAwesomeIcon icon={faClock}/> Paraphrase History
                </h1>
            </SheetTrigger>

            <SheetContent className="bg-white">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Paraphrase History</SheetTitle>
                    <SheetDescription>
                        List of your last paraphrased text.
                    </SheetDescription>
                </SheetHeader>


                {
                    isLoading 
                    ? (<div className="mt-5 text-xl">Loading History......</div>)

                    : (
                        <div className="flex flex-col justify-center overflow-auto scroll-container mt-5 hover:cursor-pointer ">
                            {
                                history.map((item: History, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-center gap-2 font-semibold border-b border-gray-200 py-3 hover:bg-gray-200"
                                        onClick={() => updateHistoryState(item.original_text, item.transformed_text)}
                                    >
                                        <h1 className="text-lg">
                                            {formatDate(item.created_at)}
                                        </h1>

                                        <h2 className="text-gray-500 font-semibold truncate">{item.original_text}</h2>
                                    </div>
                                ))
                            }

                        </div>


                    )
                               
                }
                                
            </SheetContent>
        </Sheet>
    )
}