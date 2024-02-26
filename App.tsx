import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext, AuthProvider } from "./src/context/UserContext.context";
import { ToastProvider } from "./src/components/Toaster.comp";
import Loading from "./src/components/Loading.comp";
import Routes from "./src/components/Routes.comp";


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


  return (
    <>
     
      <AuthProvider>
        {/* <Loading> */}
          <View style={styles.container}>
            <Routes />
          </View>
        {/* </Loading> */}
      </AuthProvider>
    </>
  );
}
