import { Image, StyleSheet, Text, View } from "react-native";


const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 1,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: -25,
      marginRight: 10,
    },
    usernameText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

const UserChatHeader = ({ route }) => {
    const { images, name } = route.params;

    return (
        <View style={styles.headerContainer}>
            {images?.length > 0 && (
            <Image
            source={{ uri: images[0] }}
            style={styles.profileImage}
            />
      )}
      <Text style={styles.usernameText}>{name}</Text>

        </View>
    )
  };


  export default UserChatHeader;