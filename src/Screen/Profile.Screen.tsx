import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../context/UserContext.context';
import AuthService from '../utils/auth.service';
import { useNavigation } from '@react-navigation/native';


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
  dateOfBirth: string;
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
  username: string;
}

interface UserInformationItem {
  key: string;
  value: string;
}

interface UserScreenProps {
  userData: UserDataInterface;
}



const Profile= (props:any) => {

  const navigation = useNavigation();
  const { isLoggedIn,profile,Toast, setIsLoggedIn } = useContext(AuthContext);
  console.log("UserScreenUs",props.route.params);
  
// Toast.success("YEs Profilw")
  const userData = profile?.id? profile : props.route.params.userData;
  const userInformation = [
    { key: 'Username', value: userData.username },
    { key: 'Bio', value: userData.bio },
    { key: 'Date of Birth', value: userData.dateOfBirth },
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
     //@ts-ignore
    navigation.navigate('Login');
  }

  const renderItem = ({ item }: { item: UserInformationItem }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemKey}>{item.key}:</Text>
      <Text style={styles.listItemValue}>{item.value}</Text>
    </View>
    
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userInformation}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      <Button title='Logout' onPress={handleLogout}></Button>
    </View>
  );

  return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Got into Profile screen</Text>
        <Button title='Logout' onPress={handleLogout}/>
      </View>)
};



export default Profile;
