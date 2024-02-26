import axios from 'axios';
const API_URL = 'https://8f17-2401-4900-1c89-60f9-9cb5-53cc-3481-37df.ngrok-free.app'; 
// const API_URL = 'http://127.0.0.1:3000'; 

const UserService = {
  getProfile: async (access_token:string) => {
    try {
      // console.log("getProfile",{access_token})
      const response = await axios.get(`${API_URL}/users/`, {
        headers: {
          Authorization:`Bearer ${access_token}`,
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
      });
    //   const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
      // await SecureStore.setItemAsync('access_token', JSON.stringify(response.data.result.access_token));

      return response.data.result;
    } catch (error) {
      // Handle login errors
      console.error('Error logging in:', error);
      throw error; // Re-throw for further error handling
    }
  },
  
};

export default UserService;