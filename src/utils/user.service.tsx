import axios from "axios";
// const API_URL = 'https://6bf6-2401-4900-1c75-a279-9c7c-77d5-b7bf-dd4d.ngrok-free.app';

import * as FileSystem from "expo-file-system";

const API_URL = process.env.EXPO_PUBLIC_BACKEND;
const UserService = {
  getProfile: async (access_token: string) => {
    try {
      // console.log("getProfile",{access_token})
      const response = await axios.get(`${API_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data.result;
    } catch (err) {
      // Handle login errors
      console.error("Error getProfile in:", err, err?.response?.data);
      throw err?.response?.data?.message; // Re-throw for further error handling
    }
  },

  getProfiles: async (access_token: string) => {
    try {
      console.log("getProfiles", { access_token });
      const response = await axios.get(`${API_URL}/users/filter`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("getProfilesResp",response.data.result)
      return response.data.result;
    } catch (err) {
      console.error("Error getProfiles in:", err?.response);
      throw err?.response?.data?.message;
    }
  },

  actionProfile: async (access_token: string, userId: string, actionType:string) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/action`,
        { userId, status: actionType },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data.result;
    } catch (err) {
      console.error("Error actionProfile in:", err);
      throw err?.response?.data?.message;
    }
  },

  updateProfile: async (access_token: string, formData: string) => {
    try {
      const response = await axios.patch(`${API_URL}/users`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.result;
    } catch (err) {
      // console.error('Error updateProfile in:', err?.response?.data?.response?.message);
      console.error("Error updateProfile in:", err?.response);
      throw err?.response?.data?.message;
    }
  },

  addImage: async (access_token: string, fileUri: string) => {
    try {
      console.log("addImage Start")
      const response = await FileSystem.uploadAsync(
        `${API_URL}/users`,
        fileUri,
        {
          fieldName: "images",
          httpMethod: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }
      );
      const result = JSON.parse(response.body);
      console.log("checkResults", result.result);
      return result.result;
    } catch (error) {
      console.log("addImage error", error);
    }
  },

  removeImage: async (access_token: string, image_url: string) => {
    try {
      const response = await axios.patch(`${API_URL}/users/delete-image`, {image:image_url}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      return true
    } catch (error) {
      console.log("removeImage error", error);
    }
  },

  registerUser:async (userDetails:any) => {
    try{
      console.log("registerUser Service",userDetails)
      const response = await axios.post(`${API_URL}/users/register`, userDetails, {
        headers: {
          // Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data
    }catch(err){
      throw err;
    }
    
  },

  userChats: async(access_token: string, page:number=1, limit:number=1)=>{
    try{

      const response = await axios.get(`${API_URL}/users/chats`, {
        params: {
          page,
          limit
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("userChats response");
      return response.data.result;
    }catch(err){
      
      console.log("userChats err",err)
    }
  },

  userChatBox: async(access_token: string, id:string, page:number=1, limit:number=1)=>{
    try{

      const response = await axios.get(`${API_URL}/users/chat/${id}`, {
        params: {
          page,
          limit
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("userChatBox response");
      return response.data.result;
    }catch(err){
      
      console.log("userChatBox err",err)
    }
  },

  postMessage: async(access_token: string, id:string, message:string)=>{
    try{

      const response = await axios.post(`${API_URL}/users/chat/send`, {recipientId:id, content:message}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("postMessage response");
      return response.data.result;
    }catch(err){
      
      console.log("postMessage err",err)
    }
  }
};

export default UserService;
