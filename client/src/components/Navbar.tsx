import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import quickquillLogo from "../assets/img/quickquill_logo.png";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export function NavBar() {
    return (
        <div className="w-full h-[6rem] flex items-center bg-white font-semibold px-6">
            
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

            <div className="flex items-center justify-end flex-1">
                <div className="bg-gray-100 p-2 rounded-full hover:cursor-pointer">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        </div>
    );
}
