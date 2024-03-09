import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UserService from "../utils/user.service";
import { AuthContext } from "../context/UserContext.context";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    userListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
    },
    userImageContainer: {
      marginRight: 10,
      borderRadius: 50,
      overflow: 'hidden',
    },
    userImage: {
      width: 60,
      height: 60,
    },
    defaultImageText: {
      fontSize: 16,
      color: '#ccc',
      textAlign: 'center',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
const UserChats = ()=>{

    const { token, setProfile } = useContext(AuthContext);
    const [pageConfig,setPageConfig] = useState({page:1,limit:20});
    const [usersProfiles, setUsersProfiles] = useState([]);

    useEffect(()=>{
        getUserProfiles();
    },[])

    console.log({usersProfiles})
    
    const getUserProfiles = async()=>{
        try{

        const response = await UserService.userChats(token, pageConfig.page, pageConfig.limit);
        console.log("getUserProfiles",response)
        setPageConfig((prev)=>{return {...prev,page:response.page}})
        setUsersProfiles(response.users)
        }catch(err){
            console.log("getUserProfiles Error")
        }
    }

    const handleUserClick = (user) => {
        // Handle navigation or other actions on user click
        console.log('User clicked:', user);
        // You can navigate to another screen using a navigation library (e.g., react-navigation)
        // or pass user data as props to another component
      };
    
    const renderItem = ({ item: user }) => {
    // Extract image URL from the images array (assuming the first image is the profile picture)
    const profileImage = user.images?.[0];

    return (
        <TouchableOpacity style={styles.userListItem} onPress={() => handleUserClick(user)}>
        <View style={styles.userImageContainer}>
            {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.userImage} />
            ) : (
            <Text style={styles.defaultImageText}>No Image</Text>
            )}
        </View>
        <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            {/* Add other user details as needed */}
        </View>
        </TouchableOpacity>
    );
    };
    
    if(!usersProfiles.length){
        return(
            <View>
                <Text>
                UserChats Screen
                </Text>
            </View>
        )
    }


    
      return (
        <View style={styles.container}>
          {/* <Text style={styles.title}>UserChats Screen</Text> */}
          <FlatList
            data={usersProfiles}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()} // Ensure unique key for each item
            horizontal={false} // Display items vertically (optional)
          />
        </View>
      );
    
    
}

export default UserChats;