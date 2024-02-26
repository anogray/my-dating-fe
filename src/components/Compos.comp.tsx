import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native"

const ScreenOneCmp = ()=>{

    const navigation = useNavigation(); 

    const handleScreen = ()=>{
        //@ts-ignore
        navigation.navigate("Screentwo", { dataScreen: {id:1, bio:"data bio"} });
    }

    return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>ScreenOneCmp</Text>
        <Button title="Press Btn" onPress={handleScreen}/>
      </View>)
  }

  const ScreenTwoCmp = (props)=>{
    console.log("checkUsProps",props)
    return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>ScreenTwoCmp</Text>
      </View>
    )
  }

  export {ScreenOneCmp, ScreenTwoCmp}