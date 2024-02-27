import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
// const API_URL = 'https://127.0.0.1:3000'; 
const API_URL = 'https://8f17-2401-4900-1c89-60f9-9cb5-53cc-3481-37df.ngrok-free.app'; 
// const API_URL = 'localhost:3000'; 

const AuthService = {
  login: async (email:string, password:string) => {
    try {
        console.log({ email, password },`${API_URL}/auth/login`)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
      });
      await SecureStore.setItemAsync('access_token', JSON.stringify(response.data.result.access_token));

      return {access_token:response.data.result.access_token};
    } catch (error) {
      // Handle login errors
      // console.error(error?.response?.data?.message);
      throw error?.response?.data?.message; // Re-throw for further error handling
    }
  },
  logout:async()=>{
    try{
      await SecureStore.deleteItemAsync('access_token')
    }catch(err){

    }
  }
  
};

export default AuthService;