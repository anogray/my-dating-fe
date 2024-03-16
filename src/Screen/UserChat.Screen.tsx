import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext.context";
import UserChatBox from "../components/UserChatBox.comp";


const UserChat = (params:any)=>{

    return (<View style={{ flex: 1, marginLeft:10, marginRight:10  }}>
        {/* <Button title='Login' onPress={handleLogin}></Button> */}
        <UserChatBox props={params}/>
      </View>)
}

export default UserChat;