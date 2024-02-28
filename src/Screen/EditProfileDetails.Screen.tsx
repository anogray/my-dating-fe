import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";
import EditProfile from "../components/EditProfile.comp";


const EditProfileDetails = ({route})=>{

  const navigation = useNavigation(); 

  const handleLogin = ()=>{navigation.goBack()}

    return (<View style={{ flex: 1, marginLeft:10, marginRight:10  }}>
        {/* <Button title='Login' onPress={handleLogin}></Button> */}
        <EditProfile userData={route.params.userData}/>
      </View>)
}

export default EditProfileDetails;