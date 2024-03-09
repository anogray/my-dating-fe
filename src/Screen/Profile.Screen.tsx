import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/UserContext.context';
import AuthService from '../utils/auth.service';
import { useNavigation } from '@react-navigation/native';
import useLocation, { useLocationContext } from '../components/Location.comp';
import UserService from '../utils/user.service';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:100
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemKey: {
    fontWeight: 'bold',
  },
  mandatoryItemKey: {
    fontWeight: 'bold',
    color:'red'
  },
  listItemValue: {
    // Add any styles for the value text here
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export interface UserDataInterface {
  bio: string;
  age: string;
  yob:string,
  dating_goal: string;
  education_level: string;
  email: string;
  gender: string;
  height: number;
  id: number;
  images: string[];
  interests: string[];
  languages: string[];
  latitude: number;
  location: string;
  longitude: number;
  password: string; // Consider removing for security reasons
  profilePicture: string;
  // username: string;
}

interface UserInformationItem {
  key: string;
  value: string;
}

interface UserScreenProps {
  userData: UserDataInterface;
}



const Profile= (props:any) => {
  const { location, errorMsg  } = useLocationContext()
  const navigation = useNavigation();
  const { isLoggedIn,profile,Toast, setIsLoggedIn,setProfile,token } = useContext(AuthContext);  
  const userData = profile
  const userInformation = userData && [
    // { key: 'Username', value: userData.username },
    { key: 'Bio', value: userData.bio },
    { key: 'Yob', value: userData.yob },
    { key: 'Dating Goal', value: userData.dating_goal },
    { key: 'Education Level', value: userData.education_level },
    { key: 'Email', value: userData.email },
    { key: 'Gender', value: userData.gender },
    { key: 'Height', value: userData.height },
    { key: 'Location', value: userData.location },
    { key: 'Interests', value: userData.interests.join(', ') }, // Join interests for a single string
    { key: 'Languages', value: userData.languages.join(', ') }, // Join languages for a single string
  ];

  const handleLogout = async()=>{
    await AuthService.logout();
    Toast.success('You have successfully logged out !')
    setIsLoggedIn(false)
    setProfile(null)
     //@ts-ignore
    navigation.navigate('Login');
  }

  const handleProfiles = ()=>{
      //@ts-ignore
      if(!profile.yob){
        Toast.warn('Please tell us your birth year');
      }else{
        navigation.navigate('Profiles');
      }
  }

  const handleEditProfile = () => {
    try {
      //@ts-ignore
      navigation.navigate("EditProfileDetails",{ userData: profile });
    } catch (err) {

    }
  };

  const handleChats= () => {
    try {
      //@ts-ignore
      navigation.navigate("ChatBox");
    } catch (err) {

    }
  };

  const renderItem = ({ item }: { item: UserInformationItem }) => {
    return (
      <View style={styles.listItem}>
        {item.key=='Yob' && !item.value ? <Text style={styles.mandatoryItemKey}>*{item.key}:</Text>:<Text style={styles.listItemKey}>{item.key}:</Text>}
        <Text style={styles.listItemValue}>{item.value}</Text>
      </View>
      
    );
  }

  const updateLocation = async()=>{
    try{
        const formData = new FormData();
        formData.append('longitude',location.coords.longitude)
        formData.append('latitude',location.coords.latitude);
        const response = await UserService.updateProfile(token, formData);
    }catch(err){
      console.log("updateLocation Err",err);
    }
  }
  useEffect(()=>{

   if(location){
    updateLocation();
   }
  },[location])

  return (
    <View style={styles.container}>
      <Button title='Find someone' onPress={handleProfiles}/>
      {userData && <FlatList
        data={userInformation}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />}
      <Button title='Chats' onPress={handleChats}></Button>
      <Button title='Logout' onPress={handleLogout}></Button>
      <Button
        title="Edit"
        onPress={handleEditProfile}
        // style={[styles.button, styles.buttonHover]} // Apply hover style
      />
    </View>
  );

};



export default Profile;
