import axios from 'axios';
const API_URL = ' https://b2b0-2401-4900-1c89-60f9-c90c-16d9-4eb1-4b62.ngrok-free.app'; 
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
      console.error('Error getProfile in:', err,err?.response?.data);
      throw err?.response?.data?.message; // Re-throw for further error handling
    }
  },

  getProfiles: async(access_token:string)=>{
    try{
      console.log("getProfiles",{access_token})
      const response = await axios.get(`${API_URL}/users/filter`, {
        headers: {
          Authorization:`Bearer ${access_token}`,
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
      });
      return response.data.result;
    }catch(err){
      console.error('Error getProfiles in:',  err?.response);
      throw err?.response?.data?.message;
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
      console.error('Error actionProfile in:', err);
      throw err?.response?.data?.message;
    }
  },
  
  updateProfile: async (access_token, userId, formData) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      console.log("seeeeeee",response.data)
      return response.data.result;
    } catch (err) {
      // console.error('Error updateProfile in:', err?.response?.data?.response?.message);
      console.error('Error updateProfile in:', err?.response?.data);
      throw err?.response?.data?.message;
    }
  },
};

export default UserService;