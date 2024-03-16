import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import UserService from "../utils/user.service";
import { AuthContext } from "../context/UserContext.context";
import { useNavigation } from "@react-navigation/native";
import LoaderAnimation from "./Loader.comp";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  otpView:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", 
    marginBottom: 20,
  },
  otpInput: {
    height: 40,
    width: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: "center",
  },
});

const RegisterComp = () => {

  const navigation = useNavigation();
  const {Toast} = useContext(AuthContext);  

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    success:false
  });
  const [loading,setLoading] = useState(false);

  const [otp, setOtp] = useState({value:'',isEntered:false});

  const handleChange = (name: string, value: string | string[]) => {
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleOtpChange = (value: string) => {
    // setOtp((prev)=>({...prev,value:value}));
    if (value.length === 4) {
      setOtp((prev)=>({...prev,value:value,isEntered:true}));
    } else {
      setOtp((prev)=>({...prev,value:value,isEntered:false}));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await UserService.registerUser(userDetails);
      Toast.success(response.result)
      setUserDetails({...userDetails,success:true})
      // Handle successful registration
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle registration error
      Toast.error('handleSubmit Error')
    }
    finally{
      setLoading(false);
    }
  };

  const handleSubmitOtp = async()=>{
    try {

      if(otp.isEntered){
        setLoading(true);
        const response = await UserService.registerUser({otp:+(otp.value)});
        Toast.success('Please login!')
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle registration error
      Toast.error('handleSubmitOtp Error')
    }finally{
      setLoading(false);
    }
  }

  if(loading){
    return(<LoaderAnimation/>)
  }
  else if(!userDetails.success){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
         style={styles.input}
          placeholder="Email"
          value={userDetails.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        <TextInput
         style={styles.input}
          placeholder="Password"
          value={userDetails.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
        />
        {/* Add more input fields for other registration fields */}
        <Button title="Register" onPress={handleSubmit} />
      </View>
    );
  }
  return(
    <View style={styles.otpView}>

    <View style={styles.otpContainer}>
    {/* <Text>Enter your otp</Text> */}
    {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                placeholder="0"
                value={otp.value.length > index ? otp.value[index] : ""}
                onChangeText={(text) => handleOtpChange(otp.value.slice(0, index) + text + otp.value.slice(index + 1))}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
    {/* Add more input fields for other registration fields */}
  </View>
    <Button title="Send Otp" onPress={handleSubmitOtp} />
  </View>
  )
};

export default RegisterComp;
