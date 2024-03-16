import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext.context";
import UserChats from "../components/UserChats.comp";


const ChatBox = ()=>{

  const navigation = useNavigation(); 
  const { profile } = useContext(AuthContext);


    return (<View style={{ flex: 1 }}>
        <UserChats/>
      </View>)
}

export default ChatBox;