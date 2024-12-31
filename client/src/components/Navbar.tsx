import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import quickquillLogo from "../assets/img/quickquill_logo.png";
import { faMoon, faUser } from "@fortawesome/free-regular-svg-icons";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
  

import QuickQuillLogo from '../assets/img/quickquill_logo.png';
import GoogleLogo from '../assets/img/google.webp';
import FacebookLogo from '../assets/img/facebook.png';

import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { signOutUser } from "@/api/post/user";
import { useNavigate } from 'react-router';
import { useUpdateUserState } from "@/hooks/useUpdateUserState";
import { useUserStore } from "@/store/userStore";
import { useDarkModeStore } from "@/store/darkModeState";

export function NavBar() {

    const { isLoading, error } = useUpdateUserState() 
    const user = useUserStore((state) => state.user);
    
    if(error) console.error('Error in getting user data: ', error.message)


    return (
        <div className="fixed top-0 border-b-2 w-full h-[6rem] flex items-center bg-white font-semibold px-6 z-[10] dark:bg-black">
            
            <div className="flex items-center flex-1">
                <img 
                    src={quickquillLogo}
                    width={70} 
                    height={70} 
                    alt="QuickQuill Logo"
                />
                <h1 className="text-blue-800 text-xl ml-2 dark:text-white">QuickQuill</h1>
            </div>

            <h1 className="text-blue-800 text-xl flex-1 text-center dark:text-white">
                Document Editor
            </h1>

            <div className="flex items-center justify-end flex-1 font-semibold dark:text-white">
                {
                    !user 
                        ? isLoading 
                            ? <div>Loading...</div> 
                            : <LoginDialog />
                        : <AuthenticatedUser />
                }
            </div>
            
            

                    

        </div>
    );
}


function LoginDialog(){

    const handleGoogleLogin = async () => {
        window.location.href = 'http://localhost:8000/auth/google';  
    };

    const handleFacebookLogin = async () => {
        window.location.href = 'http://localhost:8000/auth/facebook';  
    };

    return(
        <Dialog>
            <DialogTrigger>
                <h3 className="text-lg text-slate-800 hover:cursor-pointer hover:opacity-75">
                    Login/Signup
                </h3>
            </DialogTrigger>
            
            <DialogContent className="w-full p-16 bg-white">
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
                        onClick={handleFacebookLogin}
                        className="w-full rounded-full p-5 border-2 border-gray-400"
                    >
                        <img src={FacebookLogo} alt="Google Logo" width={30}/>
                        <h1>Continue with Facebook</h1>

                    </Button>
                </div>

                <DialogFooter className="font-semibold mt-8 text-sm">
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

function AuthenticatedUser(){
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const htmlElement = document.documentElement;
    const darkModeState = useDarkModeStore();


    const user = useUserStore((state) => state.user);


    const mutation = useMutation({
        mutationFn: signOutUser,
        onSuccess: (data) => {
            if (data === "logout_success"){
                navigate('/');
                queryClient.clear();
            } 
        },
    })


    const ToggleDarkMode = () => {

        if(darkModeState.isDarkMode){
            htmlElement.classList.remove('dark')
            localStorage.setItem("theme", "light");
        } else {
            htmlElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        }
    
        darkModeState.setIsDarkModeState(!darkModeState.isDarkMode);
    }

    console.log("dark: ", darkModeState.isDarkMode);
    

    const handleSignOut = () => mutation.mutate();

    return (

        <DropdownMenu>
            <DropdownMenuTrigger className="hover:cursor-pointer" asChild>
                <div className="flex items-center ">

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
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white">
                <DropdownMenuItem onClick={() => ToggleDarkMode()} className="flex items-center hover:cursor-pointer">
                    <FontAwesomeIcon icon={faMoon}/>
                    Dark Mode
                </DropdownMenuItem>

                <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center hover:cursor-pointer "
                >
                    <FontAwesomeIcon icon={faRightToBracket}/>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
            
        </DropdownMenu>

        
        
    )
}