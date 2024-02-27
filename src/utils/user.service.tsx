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

      return response.data.result;
    } catch (err) {
      // Handle login errors
      console.error('Error logging in:', err);
      throw err; // Re-throw for further error handling
    }
  },

  getProfiles: async(access_token:string)=>{
    try{
      const response = await axios.get(`${API_URL}/users/filter`, {
        headers: {
          Authorization:`Bearer ${access_token}`,
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
      });
      return response.data.result;
    }catch(err){
      console.error('Error logging in:', err);
      throw err;
    }
  },
  
  actionProfile : async(access_token:string, seen_user_id:string)=>{
    try{
      const response = await axios.post(`${API_URL}/users/action`,{seen_user_id, status:'REQUESTED'}, {
        headers: {
          Authorization:`Bearer ${access_token}`,
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
      });
      return response.data.result;
    }catch(err){
      console.error('Error logging in:', err);
      throw err;
    }
  }
  
};

export default UserService;