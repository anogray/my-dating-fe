import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import EditProfile from "../components/EditProfile.comp";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext.context";


const EditProfileDetails = ({route})=>{

  const navigation = useNavigation(); 
  const { profile } = useContext(AuthContext);

  const handleLogin = ()=>{navigation.goBack()}

    return (<View style={{ flex: 1, marginLeft:10, marginRight:10  }}>
        {/* <Button title='Login' onPress={handleLogin}></Button> */}
        <EditProfile userData={profile}/>
      </View>)
}

export default EditProfileDetails;