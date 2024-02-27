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
    setToken
  } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const value = JSON.parse(await SecureStore.getItemAsync("access_token"));
      // await SecureStore.deleteItemAsync("access_token")
      console.log("usLoadedData", value);

      if (value !== null) {
        const userDataResponse = await UserService.getProfile(value);
        setIsLoggedIn(true);
        setProfile(userDataResponse);
        setToken(value);
      }
    } catch (error) {
      console.log("Error retrieving Routes data:", error);
      // Toast.error(error)
      // Toast.error(error)
      setError(`${error}`);
    } finally {
      setLoader(false);
    }
  };


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading krle Bhai thodi...</Text>
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn && (
            <Stack.Screen
              name="Login"
              component={LoginComponent}
              options={{ headerShown: false }}
            />
          )}
          {isLoggedIn && profile && (
            <>
              <Stack.Screen
                name="Profile"
                component={Profile}
                initialParams={{ userData: profile }}
              />

              <Stack.Screen name="Profiles" component={Profiles}
              
              />
            </>
          )}

          <Stack.Screen
            name="Screenone"
            component={ScreenOneCmp}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Screentwo"
            component={ScreenTwoCmp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default Routes;
