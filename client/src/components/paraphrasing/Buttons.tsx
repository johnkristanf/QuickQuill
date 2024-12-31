import { Paraphrase } from "@/types/document";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseFormSetValue } from "react-hook-form";
import { PulseLoader } from "react-spinners";


export function FloatingParaphraseHelperButton({ setInputText }: { setInputText: UseFormSetValue<Paraphrase> }) {

    const handleSampleText = () => {
        const sentences = [
            "This is a sample text for testing the paraphrase functionality, which helps rephrase the text to improve clarity and avoid repetition while keeping the original meaning intact.",
            "The quick brown fox jumps over the lazy dog, showcasing agility and playfulness in a classic sentence often used to test fonts and typing skills.",
            "React makes it painless to create interactive UIs by allowing developers to design reusable components, manage state efficiently, and build scalable applications with ease.",
            "JavaScript is a versatile programming language used for web development, enabling dynamic and interactive content on websites, ranging from simple scripts to complex applications.",
            "Artificial Intelligence is shaping the future of technology by automating processes, enhancing decision-making, and enabling groundbreaking advancements in healthcare, transportation, and many other industries.",
            "The weather today is sunny with a chance of rain in the afternoon, providing an opportunity for outdoor activities in the morning while reminding us to keep an umbrella handy just in case.",
            "Zustand is a small, fast, and scalable state management library for React, offering a simple yet powerful API to manage global state without the complexity of larger libraries.",
            "Consistency is key to mastering any new skill, as practicing regularly and staying committed to your goals can significantly improve your ability to achieve long-term success.",
            "Reading books is a great way to expand your knowledge and imagination, as it allows you to explore different perspectives, learn new ideas, and dive into fascinating stories from various genres."
        ];

        const index = Math.floor(Math.random() * sentences.length);

        setInputText('original_text', sentences[index]);

    };

    const handlePasteText = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputText('original_text', text);
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
        }
    };

    return (
        <div className="w-full flex gap-4 justify-center absolute bottom-[17rem] left-1/2 transform -translate-x-1/2">
            <button
                type="button"
                className="w-[40%] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                onClick={handleSampleText}
            >
                <span role="img" aria-label="wave">👋</span>
                <span>Try Sample Text</span>
            </button>

            <button
                type="button"
                className="w-[40%] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-full hover:bg-gray-200"
                onClick={handlePasteText}
            >
                <FontAwesomeIcon icon={faClipboard} className="text-blue-800" />
                <span>Paste Text</span>
            </button>
        </div>
    );
}


export function SubmitParaphraseButton({
    isPending
}: {
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