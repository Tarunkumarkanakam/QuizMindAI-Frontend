import axios from 'axios';

// const API_BASE_URL = 'http://172.18.61.111:8088/quizapp/api/v1';
const API_BASE_URL = 'http://localhost:8088/quizapp/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Admin Side
export const createExam = async (token, examId, examName, examDescription) => {
    const response = await apiClient.post(`/exam/createExam`, {
        examId,
        examName,
        examDescription
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createSession = async (token, sessionId, examStart, examEnd, examId, emails, adminEmail) => {
    // getUserFromLocalStorage()
    const response = await apiClient.post('/session/createSession', {
        sessionId,
        examStart,
        examEnd,
        examId,
        emails,
        adminEmail
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Create User
export const  registerUsers = async (token, emails, adminEmail) => {
    console.log(token);
    // Split comma-separated emails and trim whitespace
    const emailArray = emails.map(email => ({ email: email.trim() }));

    const response = await apiClient.post('/admin/registerUsers',
        emailArray,  {
        headers: { Authorization: `Bearer ${token}` },
        params: {adminEmail: adminEmail }

    });

    return response.data; // Modify this to return the response data including passwords
};

export const getAllUsers = async (token, adminEmail) => {
  try {
      const response = await apiClient.get('/user/getAllUsers', {
          headers: { Authorization: `Bearer ${token}` },
          params: { role: 'USER', adminEmail: adminEmail }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
  }
};

export const getAllSessionsOnAdmin = async (token, email) => {
    try {
        const response = await apiClient.get('/session/getAllSessionsOnAdmin', {
            headers: { Authorization: `Bearer ${token}` },
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};




export const getExams = async (token, adminToken = null) => {
    const authToken = adminToken || token;  // Use admin token if provided, otherwise use user token
    const response = await apiClient.get(`/exam/getAllExams`, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await apiClient.post(`/auth/login`, { email, password });
    return response.data;
};

export const getTestInformation = async (token, email) => {
    const response = await apiClient.get(`/session/test`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email }
    });
    return response.data;
};

export const saveUserAnswer = async (token, email, examId, questionId, optionId) => {
    try {     
        const response = await apiClient.put(`/answers/saveUserAnswer?email=${email}&examId=${examId}&questionId=${questionId}&optionId=${optionId}`,
        {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('User answer saved successfully');
        console.log(response.data); // If you expect a response, you can log it
    } catch (error) {
        console.error('Error saving user answer:', error);
    }
};

export const getExamData = async (examId, token, email) => {
    try {
        console.log('Fetching exam data with:', { examId, token, email });
        const response = await apiClient.get(`/exam/getExamData`, {
            params: { email, examId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam data:', error);
        throw error;
    }
};

export const getAllUserAnswers = async (examId, token, email) => {
    try {
        const response = await apiClient.post(
            '/answers/getAllUserAnswers',
            { examId, email },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Assume the API returns an object with answers property
    } catch (error) {
        throw new Error('Failed to fetch user answers');
    }
};

export const getAllSessions = async (email, sessionId, token) => {
    try {
        const response = await apiClient.get('/session/getAllSessions', {
            headers: { Authorization: `Bearer ${token}` },
            params: { email, sessionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
    }
};


// api.js

// Function to update session data

export const updateSession = async (email, sessionId, token, updatedSessionData) => {
    try {
        const response = await apiClient.put(
            `/session/updateSession`,
            updatedSessionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                params: { email, sessionId } // Include email and sessionId as query parameters
            }
        );

        return response.data; // Assuming the API returns updated session data or a success message
    } catch (error) {
        console.error('Error updating session:', error);
        throw error;
    }
};

// Function to generate questions using your AI API
export const generateQuestions = async (prompt, topic, numQuestions, complexity, onNewQuestion) => {
    const OPENAI_API_KEY = 'KEY'; // Replace with your actual API key
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    };
  
    const actualTopic = topic || prompt;
  
    // Generate one question at a time to simulate streaming
    for (let i = 0; i < numQuestions; i++) {
      const adjustedPrompt = `
  Generate one ${complexity} multiple-choice question on the topic "${actualTopic}". Provide the question with 4 options, indicate the correct answer, and include a brief explanation. Please output strictly in JSON format without any additional text, so the response is JSON parseable.
  
  Format the response as a JSON object with the following structure:
  {
    "questionText": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 0, // Index of the correct option (0-based)
    "explanation": "Explanation of the correct answer",
    "topic": "${actualTopic}"
  }
  `;
  
      const data = {
        model: 'claude-v1', // Your specified model
        messages: [
          {
            role: 'user',
            content: adjustedPrompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      };
  
      try {
        const response = await axios.post(
          'URL', // Your API endpoint
          data,
          { headers }
        );
        const messageContent = response.data.choices[0].message.content;
  
        // Parse the assistant's reply
        const question = JSON.parse(messageContent);
  
        // Pass the new question to the callback
        onNewQuestion(question);
      } catch (error) {
        console.error('Error generating question:', error);
        throw error;
      }
    }
  };

// // Function to generate questions using OpenAI API
// export const generateQuestions = async (prompt, onNewQuestion) => {
//   const OPENAI_API_KEY = 'sk-navigatelabsadmin'; // Replace with your OpenAI API key

//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${OPENAI_API_KEY}`,
//   };

  
// // We'll generate one question at a time to simulate streaming
// for (let i = 0; i < 15; i++) {
//     const data = {
//       model: 'claude-v1',
//       messages: [
//         {
//           role: 'user',
//           content: `Generate one multiple-choice question based on the following prompt. Provide the question with 4 options, indicate the correct answer, and include a brief explanation. Your are supposed to give strictly json only without any starting and ending text, The whole response should be json parse able.

// Prompt: ${prompt}

// Format the response as a JSON object with the following structure:
// {
//   "questionText": "Question text",
//   "options": ["Option A", "Option B", "Option C", "Option D"],
//   "correctOptionIndex": 0, // Index of the correct option (0-based)
//   "explanation": "Explanation of the correct answer",
//   "topic": "On what subject the user asked the question"
// }`,
//         },
//       ],
//       max_tokens: 300,
//       temperature: 0.7,
//     };

//   try {
//     const response = await axios.post(
//       'https://api.nexus.navigatelabsai.com/v1/chat/completions',
//       data,
//       { headers }
//     );
//     const messageContent = response.data.choices[0].message.content;

//       // Parse the assistant's reply
//       const question = JSON.parse(messageContent);

//       // Pass the new question to the callback
//       onNewQuestion(question);
//     } catch (error) {
//       console.error('Error generating question:', error);
//       throw error;
//     }
//   }
// };

export const saveQuestions = async (token, questions, examId) => {
    try {
      const response = await apiClient.post(
        '/questions/save-questions', // Replace with your backend endpoint
        { questions, examId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if required
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving questions:', error);
      throw error;
    }
  };