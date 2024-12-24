

export function SampleBotQuestions({setMessage}: {
    setMessage: React.Dispatch<React.SetStateAction<string>>
}){
  
    const sampleQuestions = [
      {question: "Can you summarize this paragraph: <Your paragraph>"},
      {question: "Can you rephrase this sentence: <Your sentence>"},
    ]
  
    return(
      <div className='w-[90%] flex justify-evenly gap-3 mt-5 font-semibold'>
         {
            sampleQuestions.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-gray-500 rounded p-2 hover:bg-gray-200 hover:cursor-pointer"
                  onClick={() => setMessage(item.question)}
                >
                  <h1> {item.question} </h1>
                </div>
            ))
          }
      </div>
    )
}


  