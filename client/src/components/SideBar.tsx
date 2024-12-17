import { faFile } from "@fortawesome/free-regular-svg-icons"
import { faBars, faLanguage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SideBar(){

    const links = [
        {icon: faFile, bg_color: "bg-blue-800", name: "Paraphraser"},
        {icon: faBars, bg_color: "bg-violet-700", name: "Summarizer"},
        {icon: faLanguage, bg_color: "bg-black", name: "Translator"},
    ];

    return(
        <div className="fixed top-[6rem] left-0 bg-white w-[15%] h-screen pt-5">
            <div className="flex flex-col gap-5">
                {links.map((item) => (
                    <div
                        key={item.name}
                        className={`flex items-center gap-4 hover:bg-gray-200 hover:cursor-pointer pl-3 p-3`}
                    >
                        <FontAwesomeIcon 
                            icon={item.icon} 
                            className={`text-md p-3 rounded-full text-white ${item.bg_color} hover:opacity-90 cursor-pointer`} 
                        />

                        <span className="text-md font-semibold">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}