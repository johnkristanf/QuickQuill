import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ParaphrasingHistory(){
    return(
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
    )
}