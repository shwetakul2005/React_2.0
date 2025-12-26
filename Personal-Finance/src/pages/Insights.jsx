// // Products.js
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { url } from '../constants/constants';

 
// const Insights = () => {
//    const navigate = useNavigate();
//    const [question, setQuestion] = useState('');
//    const [answer, setAnswer] = useState('');
//    const [loading, setLoading] = useState(false); // 1. Added loading state

   

//    // const askQuestion = async() =>{
      
//    //       let response = await fetch(url, {
//    //          method:"POST",
//    //          body:JSON.stringify(payload)
//    //       })
//    //       response = await response.json();
//    //       console.log(response)      
//    // }
//    const askQuestion = async (retries = 3, delay = 2000) => {
//       if (loading && retries === 3) return;
//       try {
//          let response = await fetch(url, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" }, // Added header for safety
//             body: JSON.stringify(payload)
//          });

//          // Check if we hit the 429 Speed Limit
//          if (response.status === 429) {
//             if (retries > 0) {
//             console.warn(`Rate limit hit. Retrying in ${delay/1000}s...`);
            
//             // Wait for the specified delay
//             await new Promise(resolve => setTimeout(resolve, delay));
            
//             // Try again, but double the wait time for next time (Exponential Backoff)
//             return askQuestion(retries - 1, delay * 2);
//             } else {
//             throw new Error("Max retries reached. Please wait a minute before trying again.");
//             }
//          }

//          const data = await response.json();
//          console.log("Success:", data);
//          return data;

//       } catch (error) {
//          console.error("API Error:", error);
//       }finally {
//          setLoading(false); // 3. Re-enable button
//       }
//    };
//    return (
//       <div>
//         <h1>Insights here</h1>  
//         <div>
//          <input 
//          type='text'
//          value={question} 
//          onChange={(e)=>setQuestion(e.target.value)} />
//          <button onClick={askQuestion} disabled={loading}>
//             {loading ? 'Thinking...' : 'Ask'}
//          </button>
//         </div>
//       </div>
//    );
// };
 
// export default Insights;

import { useState } from 'react';
import { url } from '../constants/constants';

const Insights = () => {
   const [question, setQuestion] = useState('');
   const [answer, setAnswer] = useState('');
   const [loading, setLoading] = useState(false);

   const askQuestion = async (e) => {
      // 1. Prevent page refresh if this is inside a form
      if (e && e.preventDefault) e.preventDefault();
      
      // 2. Strict guard to prevent loops
      if (loading) return; 
      
      setLoading(true);
      
      // We define this inside to ensure it uses the LATEST 'question' state
      const payload = {
         contents: [{
            parts: [{ text: question }]
         }]
      };

      // Internal retry logic to keep it clean
      const makeRequest = async (retries = 3, backoff = 3000) => {
         try {
            const response = await fetch(url, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(payload)
            });

            if (response.status === 429) {
               if (retries > 0) {
                  console.warn(`Rate limit hit. Waiting ${backoff}ms...`);
                  await new Promise(res => setTimeout(res, backoff));
                  return makeRequest(retries - 1, backoff * 2);
               }
               throw new Error("Google is too busy. Try again in 1 minute.");
            }

            const data = await response.json();
            return data;
         } catch (err) {
            throw err;
         }
      };

      try {
         const result = await makeRequest();
         // Extracting the text from Gemini's specific JSON structure
         const aiText = result.candidates[0].content.parts[0].text;
         setAnswer(aiText);
      } catch (error) {
         console.error("API Error:", error);
         setAnswer(`Error: ${error.message}`);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div style={{ padding: '20px' }}>
         <h1>AI Insights</h1>  
         <div style={{ display: 'flex', gap: '10px' }}>
            <input 
               type='text'
               value={question} 
               placeholder="Ask me anything..."
               onChange={(e) => setQuestion(e.target.value)} 
               disabled={loading}
            />
            {/* 3. Using an anonymous function to ensure it only runs on click */}
            <button onClick={(e) => askQuestion(e)} disabled={loading || !question}>
               {loading ? 'Thinking...' : 'Ask'}
            </button>
         </div>

         {answer && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
               <strong>Answer:</strong>
               <p>{answer}</p>
            </div>
         )}
      </div>
   );
};

export default Insights;