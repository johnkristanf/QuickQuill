import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faX } from '@fortawesome/free-solid-svg-icons';

import ChatBotIcon from '../../assets/img/chatbot_icon.png';
import { SampleBotQuestions } from './SampleQuestions';
import { handleChatbotMessage } from '@/api/post/chatbot';
import { useChatbotStore } from '@/store/chatbotState';

import { Message } from '@/types/chatbot';

import { v4 as uuidv4 } from 'uuid';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"



export function ChatBox({ setShowChatBox }: { setShowChatBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [message, setMessage] = useState<string>('');
    const conversation = useChatbotStore((state) => state.conversation);

    const [recording, setRecording] = useState<boolean>(false);

    const socketRef = useRef<WebSocket | null>();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const updateConversationState = useChatbotStore.getState().updateConversationState;


    useEffect(() => {
      const connectWebSocket = () => {
        socketRef.current = new WebSocket("ws://127.0.0.1:5000/audio/ws");
    
        const audioChunks: BlobPart[] = [];
    
        socketRef.current.onopen = () => {
          console.log("WebSocket connection opened.");
        };
    
        socketRef.current.onclose = (event) => {
          console.log("WebSocket connection closed.", event.reason);
    
          setTimeout(() => {
            console.log("Reconnecting WebSocket...");
            connectWebSocket();
          }, 5000); 
        };
    
        socketRef.current.onerror = (error) => {
          console.error("WebSocket error: ", error);
        };
    
        socketRef.current.onmessage = (event) => {

          if (typeof event.data === "string") {

            const WSResponse = JSON.parse(event.data);
       
            if(WSResponse.END_OF_AUDIO){
              console.log("Audio transmission complete.");
    
              const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
              const audioURL = URL.createObjectURL(audioBlob);
      
              console.log("Final Blob: ", audioBlob);
              console.log("Final AudioURL: ", audioURL);
      
              if (audioRef && audioRef.current) {
                audioRef.current.src = audioURL;
                audioRef.current.oncanplay = () => {

                  audioRef.current
                    ?.play()
                    .catch((error) => {
                      console.error("Error playing audio:", error);
                    });

                    updateConversationState(prevConversation =>
                      prevConversation.map(msg =>
                          msg.isLoading && !msg.text
                          ? { ...msg, text: WSResponse.content, isLoading: false }
                          : msg
                      )
                      );
                };
              }
      
              audioChunks.length = 0; // Clear local chunks for the next session
              return;

            } 
            
          }
    
          console.log("Received chunk size:", event.data.size);
          audioChunks.push(event.data);
        };
      };
    
      connectWebSocket();
    
      return () => socketRef.current?.close();
    }, [updateConversationState]);
    


    const startRecording = async () => {
      console.log("Record starting....");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });


      mediaRecorder.start();
      setRecording(true);
      mediaRecorderRef.current = mediaRecorder;

      const localChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Chunk size:", event.data.size);
          localChunks.push(event.data)
        }
      }



      mediaRecorder.onstop = () => {
        console.log('Recording stopped');

        const loaderMessage: Message = { id: uuidv4(), sender: 'bot', text: '', isLoading: true }
        updateConversationState(prevConversation => [...prevConversation, loaderMessage]);

        const audioBlob = new Blob(localChunks, { type: "audio/webm" });

        console.log(`WebSocket readyState: ${socketRef.current?.readyState}`);

        
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          console.log("localChunks before sending to ws: ", localChunks);
          socketRef.current?.send(audioBlob);
          console.log("Audio chunk sent to WebSocket.");

        } else {
          console.error("WebSocket is not open. Cannot send audio data.");
        }

        localChunks.length = 0; 
        console.log("localChunks after sending to ws: ", localChunks);
        
      };

    }

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      setRecording(false);
    };


    const handleRecord = async () => {
      if (recording) {
        stopRecording();
      } else {
        await startRecording();
      }
    };


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
                {conversation.slice(0).reverse().map((chat) => (
                  <div key={chat.id} className={`flex mb-2 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`rounded-lg p-2 max-w-2/3 ${
                        chat.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-600 mr-auto'
                      }`}
                    >
                      {chat.isLoading ? (
                        <span className="text-gray-400 italic">Loading...</span>
                      ) : (
                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                          {chat.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          )
        }
  
        <div className="p-4">

  
          <div className="flex items-center gap-3">
         
            <div>
              <button onClick={handleRecord} className='text-xl font-semibold'>
                  {
                    recording 
                      ? ( <FontAwesomeIcon icon={faStop} className='text-red-800'/> )
                      : (
                        <HoverCard>
                          <HoverCardTrigger>
                            <FontAwesomeIcon icon={faMicrophone}/>
                          </HoverCardTrigger>

                          <HoverCardContent className='text-sm text-justify bg-gray-200'>
                            Click the microphone icon to speak your request, and jake will 
                            generate responses like essays, paragraphs, or answer your question.
                          </HoverCardContent>

                        </HoverCard>

                      ) 
                  }
              </button>
              <audio ref={audioRef} controls className='hidden'/>
            </div>

  
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUpCapture={(e) => e.key === 'Enter' && handleChatbotMessage(message, setMessage)}
              placeholder="Type your message..."
              className="border border-gray-300 rounded-lg px-4 py-2 mr-2 w-full focus:outline-none resize-none overflow-auto font-semibold"
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