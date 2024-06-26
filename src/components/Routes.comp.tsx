import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/UserContext.context";
import LoginComponent from "../../Login.component";
import Profile from "../Screen/Profile.Screen";
import Profiles from "../Screen/Profiles.Screen";
import { View, Text } from "react-native";
import UserService from "../utils/user.service";
import * as SecureStore from "expo-secure-store";
import { ScreenOneCmp, ScreenTwoCmp } from "./Compos.comp";
import EditProfileDetails from "../Screen/EditProfileDetails.Screen";
import RegisterComp from "./Register.comp";
import ChatBox from "../Screen/Chats.Screen";
import UserChat from "../Screen/UserChat.Screen";
import UserChatHeader from "./UserChatHeader.comp";
import { SocketContext } from "../context/Socket.context";

const Stack = createStackNavigator();

const Routes = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setProfile,
    setLoader,
    isLoading,
    Toast,
    profile,
    setToken,
    token
  } = useContext(AuthContext);
  const [errorMsg, setError] = useState<string | null>(null);

  const  {globalSocket} = useContext(SocketContext);
  useEffect(() => {
    retrieveData();
  }, []);
console.log("checkSocket",globalSocket)
  const retrieveData = async () => {
    try {
      //@ts-ignore
      const value = JSON.parse(await SecureStore.getItemAsync("access_token"));
      // await SecureStore.deleteItemAsync("access_token")
      // console.log("usLoadedData retrieveData", value);

      if (value !== null) {
        const userDataResponse = await UserService.getProfile(value);
        setIsLoggedIn(true);
        setProfile(userDataResponse);
        setToken(value);
      }
    } catch (error) {
      console.log("Error retrieving Routes data:", error);
      // Toast.error(error)
      setError(`${error}`);
    } finally {
      setLoader(false);
    }
  };
  
  useEffect(() => {
    if (globalSocket && isLoggedIn && profile) {
      // Emit a custom "user" event with user information
      globalSocket.emit("user", { userId: String(profile.id) });
      globalSocket.on("receive-msg", async(data:any) => {
        // const socketData =JSON.parse(data);
        // console.log("receive-msg Socket",data,data['message']['senderId'],data.message.senderId)
        // await passUserNavigate(data.message.senderId)
      })
    }
  }, [globalSocket]);


const passUserNavigate=async(id:any)=>{
  try{
    console.log("passing",id)
    const response = await getSocketUserDetails(id);
    console.log("passUserNavigate",id);
    
  }catch(err){

  }
}

const getSocketUserDetails=async(recipentId:string)=>{
      const userProfile = await UserService.getUserProfile(token,recipentId)
      return userProfile;
}

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading krle Bhai thodi Routes...</Text>
      </View>
    );
  } else if (isLoggedIn && !profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading krle Bhai thodi Routes Profiles...</Text>
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn && (
            <>
              <Stack.Screen
                name="Login"
                component={LoginComponent}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterComp}
                options={{ headerShown: false }}
              />
            </>
          )}
          {isLoggedIn && profile && (
            <>
              <Stack.Screen
                name="Profile"
                component={Profile}
                // initialParams={{ userData: profile }}j
              />

              <Stack.Screen
                name="EditProfileDetails"
                component={EditProfileDetails}
                options={{ headerTitle: "Update your profile" }}
                // initialParams={{ userData: profile }}
              />

             { profile.yob && <Stack.Screen name="Profiles" component={Profiles} />}

             <Stack.Screen
                name="ChatBox"
                component={ChatBox}
                options={{ headerTitle: "Chats" }}
                // initialParams={{ userData: profile }}
              />

              <Stack.Screen
                name="UserChat"
                component={UserChat}
                options={({ route }) => ({
                  headerTitle: props => <UserChatHeader {...props} route={route} />,
                })}
                // options={{ headerTitle: "Chats" }}
                // initialParams={{ userData: profile }}
              />

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default Routes;
