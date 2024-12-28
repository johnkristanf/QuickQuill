import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

import ChatBotIcon from '../../assets/img/chatbot_icon.png';
import { SampleBotQuestions } from './SampleQuestions';
import { handleChatbotMessage } from '@/api/post/chatbot';
import { useChatbotStore } from '@/store/chatbotState';



export function ChatBox({ setShowChatBox }: { setShowChatBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [message, setMessage] = useState<string>('');
    const conversation = useChatbotStore((state) => state.conversation)
   
    return (
      <div className="h-screen bg-gray-100 flex flex-col justify-between w-[35rem]">
        
        <FontAwesomeIcon 
          icon={faX} 
          className='absolute top-2 left-3 text-3xl hover:cursor-pointer hover:opacity-75 '
          onClick={() => setShowChatBox(false)}
        />
  
        { 
          conversation.length == 0 && 
            (
              <div className="w-full h-96 flex flex-col items-center justify-center">
                <img src={ChatBotIcon} width={70} height={70} />
                <SampleBotQuestions setMessage={setMessage} />
              </div>
           
            ) 
        }
  
        {
          conversation.length > 0 && (
              <div className="h-full flex flex-col-reverse overflow-y-auto p-4 mt-14 font-semibold text-white gap-2">
                {conversation.slice(0).reverse().map((chat, index) => (
                  <div key={index} className={`flex mb-2 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-2 max-w-2/3 ${chat.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-600 mr-auto'}`}>
                      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</p>
                    </div>
                  </div>
                ))}
              </div>
          )
        }
  
        <div className="p-4">
  
          <div className="flex items-center">
  
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUpCapture={(e) => e.key === 'Enter' && handleChatbotMessage(message, setMessage)}
              placeholder="Type your message..."
              className="border border-gray-300 rounded-lg px-4 py-2 mr-2 w-full focus:outline-none resize-none overflow-auto"
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', height: 120 }}
            />
  
            <button onClick={() => handleChatbotMessage(message, setMessage)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 focus:outline-none">
              Send
            </button>
  
          </div>
        </div>
  
      </div>
    );
  }