import React, { createContext, useState, Dispatch,SetStateAction  } from 'react';
import { UserDataInterface } from '../Screen/Profile.Screen';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import ToastManager, { Toast } from 'toastify-react-native'

interface AuthContextType {
  isLoggedIn: boolean;
  profile: UserDataInterface; // Assuming profile has type 'any' for simplicity
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setProfile: Dispatch<SetStateAction<any>>;
  isLoading:boolean;
  setLoader:Dispatch<SetStateAction<boolean>>;
  Toast:ToastManager
}


const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  profile:{},
  setIsLoggedIn: ()=>{},
  setProfile:()=>{},
  isLoading:true,
  setLoader:()=>{},
  Toast:()=>{}

});

const AuthProvider = ({ children }:any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [isLoading, setLoader] = useState(true);
    
  const showToasts = () => {
    Toast.success('Promised is resolved')
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, profile, setIsLoggedIn, setProfile,isLoading, setLoader,Toast }}>
      {children}
      <ToastManager />
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };