import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import styles from "./login.stylesheet";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./src/context/UserContext.context"; // Import the context

import * as SecureStore from "expo-secure-store";
import AuthService from "./src/utils/auth.service";
import UserService from "./src/utils/user.service";
import LoaderAnimation from "./src/components/Loader.comp";

interface LoginProps {
  onSubmit: (email: string, password: string) => void; // Function to handle login submission
}

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const {
    isLoggedIn,
    setIsLoggedIn,
    setProfile,
    profile,
    setLoader,
    isLoading,
    Toast,
    setToken,
  } = useContext(AuthContext);
  const navigation = useNavigation(); // Get navigation object

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailEndEditing = () => {
    if (!validateEmail(email)) {
      Toast.error("Invalid email address");
    }
  };


  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);

      if (!validateEmail(email)) {
        Toast.error("Invalid email address");
        return;
      }
      if (password.length < 6) {
        Toast.error("Password must be at least 6 characters");
        return;
      }
      setLoading(true);
      const token = await AuthService.login(email, password);
      const userDataResponse = await UserService.getProfile(token.access_token);
      setIsLoggedIn(true);
      setProfile(userDataResponse);
      setToken(token.access_token);
      // @ts-ignore
      navigation.navigate("Profile", { userData: userDataResponse });
    } catch (err) {
      console.log("handleLogin error", err);
      Toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    try {
      //@ts-ignore
      navigation.navigate("Register");
    } catch (err) {}
  };

  if(loading){
    return(<LoaderAnimation/>)
  }
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
      <Button
        title="Register"
        onPress={handleRegister}
        // style={[styles.button, styles.buttonHover]} // Apply hover style
      />
    </View>
  );
};

export default LoginComponent;
