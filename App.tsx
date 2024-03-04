import React, { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext, AuthProvider } from "./src/context/UserContext.context";
import { ToastProvider } from "./src/components/Toaster.comp";
import Loading from "./src/components/Loading.comp";
import Routes from "./src/components/Routes.comp";
import {LocationProvider} from "./src/components/Location.comp";
import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default function App() {

  // const { location, errorMsg } = useLocation();

  // useEffect(()=>{
  //   resp();
  // },[])

  // const resp = async()=>{
  //   try{
  //     let status  = await Location.requestForegroundPermissionsAsync();
  //     console.log("checkLocationStatus",status)
  //     if (status !== 'granted') {
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //   }catch(err){

  //   }
  // }

  // console.log("checkLocationApp",location)

  // if (errorMsg) {
  //   // Handle the error, e.g., show an error message
  //   return (
  //     <View style={styles.container}>
  //       <Text>Error: {errorMsg}</Text>
  //     </View>
  //   );
  // }

  // if (!location) {
  //   // Location is still loading, show a loading indicator
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <>
     <LocationProvider>
      <AuthProvider>
        <View style={styles.container}>
          <Loading>
            <Routes />
          </Loading>
        </View>
      </AuthProvider>
      </LocationProvider>
    </>
  );
}
