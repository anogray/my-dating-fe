import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
// const API_URL = 'https://127.0.0.1:3000'; 
// const API_URL = 'https://6bf6-2401-4900-1c75-a279-9c7c-77d5-b7bf-dd4d.ngrok-free.app'; 
const API_URL = process.env.EXPO_PUBLIC_BACKEND; 

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
      console.error(error);
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