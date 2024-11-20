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
