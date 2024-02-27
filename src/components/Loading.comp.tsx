import React, { useContext, useEffect, useState } from "react";
import { View, Text, ToastAndroid } from "react-native";
import { AuthContext } from "../context/UserContext.context";
import * as SecureStore from "expo-secure-store";
import UserService from "../../src/utils/user.service";
import { NavigationContainer } from "@react-navigation/native";
import LoginComponent from "../../Login.component";
import { createStackNavigator } from "@react-navigation/stack";
import { Toast } from "toastify-react-native";
import useLocation from "./Location.comp";
const Stack = createStackNavigator();

const Loading = ({ children }: { children: React.ReactNode }) => {

  // const { location, errorMsg } = useLocation();
  const { isLoggedIn, setIsLoggedIn, setProfile, setLoader, isLoading,Toast } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const value = JSON.parse(await SecureStore.getItemAsync("access_token"));
      // await SecureStore.deleteItemAsync("access_token")
      console.log("usLoadedData",value)
     
      if (value !== null) {
        const userDataResponse = await UserService.getProfile(value);
        setIsLoggedIn(true);
        setProfile(userDataResponse);
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
      // Toast.error(error)
      // Toast.error(error)
      setError(`${error}`); 
    }
    finally{
      setLoader(false)
    }
  };
  // console.log("checkLocation",location)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading krle Bhai thodi...</Text>
      </View>
    );
  } else if (error) {
    console.log("CheckCheck",error)
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginComponent}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } 
  else {
    return <>{children}</>;
  }
};

export default Loading;
