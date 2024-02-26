import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import styles from "./login.stylesheet";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from './src/context/UserContext.context'; // Import the context

import * as SecureStore from "expo-secure-store";
import AuthService from "./src/utils/auth.service";
import UserService from "./src/utils/user.service";

interface LoginProps {
  onSubmit: (email: string, password: string) => void; // Function to handle login submission
}

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn, setProfile,profile,setLoader, isLoading, Toast } = useContext(AuthContext);
  const navigation = useNavigation(); // Get navigation object

  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);

      const token = await AuthService.login(email, password);
      console.log("Login data saved securely!");
      const userDataResponse = await UserService.getProfile(token.access_token);
      console.log("gotUserResponse",userDataResponse)
      setIsLoggedIn(true);

      setProfile(userDataResponse)
      // @ts-ignore
      navigation.navigate("Profile", { userData: userDataResponse });
    } catch (err) {
      console.log("handleLogin error", err);
      Toast.error(err);
    }
    finally{
      setLoader(false)
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={[styles.input, email ? styles.inputFocused : {}]} // Conditionally apply focus style
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        // style={[styles.button, styles.buttonHover]} // Apply hover style
      />
    </View>
  );
};

export default LoginComponent;
