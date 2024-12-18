import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import quickquillLogo from "../assets/img/quickquill_logo.png";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

import { 
    ContextMenu, 
    ContextMenuContent, 
    ContextMenuItem 
} from '@/components/ui/context-menu';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

import QuickQuillLogo from '../assets/img/quickquill_logo.png';
import GoogleLogo from '../assets/img/google.webp';
import FacebookLogo from '../assets/img/facebook.png';

import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/api/get/user";
import { UserData } from "@/types/user";


export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const { data, error, isLoading } = useQuery({ queryKey: ['todos'], queryFn: getUserData });

    if(error) console.error('Error in getting user data: ', error.message)
    if (isLoading) return <div>Loading...</div>;

    const user: UserData = data && data.user;

    return (
        <div className="fixed top-0 border-b-2 w-full h-[6rem] flex items-center bg-white font-semibold px-6">
            
            <div className="flex items-center flex-1">
                <img 
                    src={quickquillLogo}
                    width={70} 
                    height={70} 
                    alt="QuickQuill Logo"
                />
                <h1 className="text-blue-800 text-xl ml-2">QuickQuill</h1>
            </div>

            <h1 className="text-blue-800 text-xl flex-1 text-center">
                Paraphrasing Tool
            </h1>

            <div className="flex items-center justify-end flex-1 font-semibold">
                { !user ? ( <LoginDialog />): ( <AuthenticatedUser user={user}/> ) }
            </div>
            
            {
                isMenuOpen && (
                    <ContextMenu modal={true}>
                        <ContextMenuContent onClick={() => setIsMenuOpen(false)}>
                            <ContextMenuItem onClick={() => console.log('Item 1 clicked')}>Item 1</ContextMenuItem>
                            <ContextMenuItem onClick={() => console.log('Item 2 clicked')}>Item 2</ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>)
            }

        </div>
    );
}


function LoginDialog(){

    const handleGoogleLogin = async () => {
        window.location.href = 'http://localhost:8000/auth/google';  
    };

    return(
        <Dialog>
            <DialogTrigger asChild>
                <h1 className="text-lg text-slate-800 hover:cursor-pointer hover:opacity-75">
                    Login/Signup
                </h1>
            </DialogTrigger>
            
            <DialogContent className="w-full p-16 bg-white ">
                <DialogHeader>

                    <DialogTitle className="flex items-center justify-center mb-5">
                        <img src={QuickQuillLogo} alt="QuickQuill Logo" width={70} height={70} />
                        <h1 className="text-3xl text-blue-800">QuickQuill</h1>
                    </DialogTitle>

                    <DialogDescription className="text-center text-slate-800 text-3xl ">
                        Write Without Limits
                    </DialogDescription>

                </DialogHeader>

                <div className="w-full flex flex-col justify-center items-center gap-5 mt-8">
                    <Button 
                        onClick={handleGoogleLogin}
                        className="w-full rounded-full p-5 border-2 border-gray-400"
                    >
                        <img src={GoogleLogo} alt="Google Logo" width={30}/>
                        <h1>Continue with Google</h1>
                    </Button>

                    <Button 
                        className="w-full rounded-full p-5 border-2 border-gray-400"
                    >
                        <img src={FacebookLogo} alt="Google Logo" width={30}/>
                        <h1>Continue with Facebook</h1>

                    </Button>
                </div>

                <DialogFooter className="font-semibold mt-8 text-sm ">
                    <h1>
                        By continuing, you agree to  
                        <span className="mx-1 text-blue-800 hover:cursor-pointer hover:opacity-75 ">Terms of Service</span> 
                        and have read our 
                        <span className="mx-1 text-blue-800 hover:cursor-pointer hover:opacity-75">Privacy Policy.</span>
                    </h1>
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    );
}

// PUT THE USER ON A PROPER STATE MANAGEMENT
function AuthenticatedUser({ user }: {
    user: UserData
}){

    console.log("pic: ", user.avatar);
    
    return (
        <div className="flex items-center">

            <h1>{ user.name }</h1>

            <div className="bg-gray-100 p-2 rounded-full hover:cursor-pointer">
                {
                    user && user.avatar 
                    ? ( 
                        <img 
                            src={user.avatar} 
                            alt="User Avatar"
                            className="w-10 rounded-full"
                        /> 
                    ) 

                    : (
                        <FontAwesomeIcon icon={faUser} />
                    )
                }
            </div>
        </div>
        
    )
}