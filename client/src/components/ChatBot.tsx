import { useState } from 'react';
import ChatBotIcon from '../assets/img/chatbot_icon.png';
import { ChatBox } from './chat/ChatBox';

function ChatBot(): JSX.Element {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const showChatRemoveToolTip = () => {
    setShowChatBox(true);
    setShowTooltip(false);
  };

  return (
    <div className='fixed bottom-0 right-0' style={{ zIndex: 100 }}>
      {
        !showChatBox && (
          <div 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)}
          >
            <img 
              src={ChatBotIcon} 
              onClick={showChatRemoveToolTip}
              width={70}
              height={70}
              className='hover:cursor-pointer mb-3 mr-5'
            />
            
            {showTooltip && (
              <div className='absolute bottom-16 right-16 bg-white text-black p-4 rounded shadow w-[28rem] font-semibold'>
                Greetings! Let's chat! Click me to get assistance from Jake, your AI buddy. I can answer questions, paraphrase text, or summarize information—let's get started!
              </div>
            
            
            )}
          </div>
        )
      }
      
      {showChatBox && <ChatBox setShowChatBox={setShowChatBox} />}
    </div>
  );
}


export default ChatBot;
