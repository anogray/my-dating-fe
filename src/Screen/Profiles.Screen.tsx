import { Button, Text, View } from "react-native";
import UserService from "../utils/user.service";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext.context";
import LoaderAnimation from "../components/Loader.comp";

const ProfileCardDetails = ({item}) => {
  return (
        <View key={item.id}>
          <Text>Id: {item.id}</Text>
          <Text>Username: {item.username }</Text>
          <Text>Email: {item.email}</Text>
          <Text>
            Date of Birth: {item.dateOfBirth}
          </Text>
          <Text>Gender: {item.gender}</Text>
          <Text>Location: {item.location}</Text>
          <Text>
            Profile Picture:{" "}
            {item.profilePicture}
          </Text>
          <Text>
            Images: {item.images?.join(", ")}
          </Text>
          <Text>Bio: {item.bio}</Text>
          <Text>
            Education Level:{" "}
            {item.education_level}
          </Text>
          <Text>
            Dating Goal: {item.dating_goal}
          </Text>
          <Text>
            Interests:{" "}
            {item.interests?.join(", ")}
          </Text>
          <Text>
            Languages:{" "}
            {item.languages?.join(", ")}
          </Text>
          <Text>Height: {item.height}</Text>
          <Text>Latitude: {item.latitude}</Text>
          <Text>Longitude: {item.longitude}</Text>
          <Text>Distance: {item.distance}</Text>
        </View>
  );
}


const Profiles = () => {
  const { token } = useContext(AuthContext);
  const [profileCards, setProfileCards] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getProfiles();
    }
  }, [token]);

  const getProfiles = async () => {
    try {
      const usersCards = await UserService.getProfiles(token);
      setProfileCards(usersCards);
    } catch (err) {
      console.log("getProfiles Err", err);
    }finally{
      setLoading(false);
    }
  };

  const handleReject = () => {
    // Implement reject logic here
    // For example, you can simply remove the current profile
    setProfileCards(profileCards.slice(1));
  };

  const handleLike = () => {
    setProfileCards(profileCards.slice(1));
    if(profileCards.length==1){
      setLoading(true);
      getProfiles();
    }
  };

  const currentProfile = profileCards[0];

  if(loading){
    return(<LoaderAnimation/>)
  }

  if (!currentProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No more profiles to show</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ScreenOneCmp</Text>
      <View>
        <ProfileCardDetails item={currentProfile} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <Button title="Reject" onPress={handleReject} />
          <Button title="Like" onPress={handleLike} />
        </View>
      </View>
    </View>
  );
};

export default Profiles;
