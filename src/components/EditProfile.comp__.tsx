import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "toastify-react-native";
import EducationLevelPicker from "./EducationLevel.comp";
import DatingGoalPicker from "./DatingGoalPicker.comp";
import InterestsPicker from "./Interests.comp";
import LanguagesPicker from "./Languages.comp";
import GenderPicker from "./GenderPicker.comp";
import UserService from "../utils/user.service";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext.context";
import LoaderAnimation from "./Loader.comp";
import { useNavigation } from "@react-navigation/native";
// import { launchImageLibrary } from "react-native-image-picker";
// import FileSystem from "expo-file-system";
// import RNFS from "react-native-fs";


const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 5,
  },
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  option: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    borderColor: "transparent",
  },
  bioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
    padding: 5,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
});

const EditProfile = ({ userData }) => {
  const { token, setProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const [formData, setFormData] = useState( {
  //   yearOfBirth: null,
  //   gender: null,
  //   location: "",
  //   images: null,
  //   bio: "",
  //   educationLevel: "",
  //   datingGoal: "",
  //   interests: [],
  //   languages: [],
  //   height: "",
  //   age: null,
  // });

  const [formData, setFormData] = useState({ ...userData });
  const [image, setImage] = useState(null);

  const handleInputChange = (field, value) => {
    if (field === "yearOfBirth") {
      const today = new Date();
      const birthYear = parseInt(value, 10);
      let age = today.getFullYear() - birthYear;
      if (age < 18) {
        Toast.warn("Only 18+ users are allowed");
        setFormData({
          ...formData,
          age: null,
        });
        return;
      }
      setFormData({
        ...formData,
        age: age,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  console.log("EditProfile formData", formData.images);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("pickImage", result);
    if (!result.cancelled) {
      // setImage( {name: `${userData.id}_image`,
      // type: result.assets[0].type,
      // mimeType:result.assets[0].mimeType,
      // uri: Platform.OS === 'ios' ? result.assets[0].uri.replace('file://', '') : result.assets[0].uri})
      const imageUri =
        Platform.OS === "ios"
          ? result.assets[0].uri.replace("file://", "")
          : result.assets[0].uri;
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          const fileUri = fileInfo.uri;
          const fileBuffer = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImage({
        name: `${userData.id}_image`,
        type: result.assets[0].type,
        uri: imageUri,
        buffer: fileBuffer,
      });
    }
  };

  // const pickImage = async () => {

  //   launchImageLibrary({ noData: true }, (response) => {
  //     console.log("launchImageLibrary",response);
  //     if (response) {
  //       setImage(response);
  //     }
  //   });

  //   const data = new FormData();

  //   // data.append("photo", {
  //   //   name: photo.fileName,
  //   //   type: photo.type,
  //   //   uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  //   // });
  //   // console.log("pickImage", result);
  //   // if (!result.cancelled) {
  //   //   setImage(result.assets[0].uri);
  //   // }
  // };

  const handleImageSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("images", image.buffer);
      console.log("handleImageSubmit", image.type);
      // sendFormData.append(`${key}[${index}]`, item);
      const response = await UserService.updateProfile(
        token,
        userData.id,
        formData
      );
      console.log("Image Uploaded", response);
      setProfile(response);
      setImage(null); // Reset image state after upload
    } catch (err) {
      console.log("handleImageSubmit Error", err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = async () => {
    try {
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) => userData[key] !== value && value !== ""
        )
      );

      // Handle interests and languages arrays
      if (
        formData.interests &&
        JSON.stringify(formData.interests.sort()) !==
          JSON.stringify(userData.interests.sort())
      ) {
        filteredFormData.interests = formData.interests;
      }

      if (
        formData.languages &&
        JSON.stringify(formData.languages.sort()) !==
          JSON.stringify(userData.languages.sort())
      ) {
        filteredFormData.languages = formData.languages;
      }

      // Send filteredFormData to server if age is 18 or older
      if (formData.age >= 18) {
        console.log(filteredFormData);
        // Send filteredFormData to the server
      }

      console.log("handlingSubmit", filteredFormData);

      if (Object.keys(filteredFormData).length > 0) {
        const sendFormData = new FormData();

        // Append filtered fields to formData
        Object.keys(filteredFormData).forEach((key) => {
          const value = filteredFormData[key];
          if (value !== null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                sendFormData.append(`${key}[${index}]`, item);
              });
            } else {
              sendFormData.append(key, value);
            }
          }
        });

        setLoading(true);
        const response = await UserService.updateProfile(
          token,
          userData.id,
          sendFormData
        );
        console.log("Responded", response);
        setProfile(response);
      }
      //@ts-ignore
      navigation.navigate("Profile");
    } catch (err) {
      console.log("handleSubmit Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderAnimation />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {formData.age ? "Age" : "Year of Birth"}
          </Text>
          <TextInput
            placeholder="YYYY"
            keyboardType="numeric"
            value={formData.age ? formData.age.toString() : null}
            onChangeText={(value) => handleInputChange("yearOfBirth", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <GenderPicker
            value={formData.gender}
            onChange={(value) => handleInputChange("gender", value)}
          />
        </View>

        <TouchableOpacity onPress={pickImage}>
          <Text>Choose Profile Picture</Text>
        </TouchableOpacity>
        <Button title="Upload Image" onPress={handleImageSubmit} />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {formData.images.map((image, index) => (
            <View key={index}>
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, margin: 5 }}
              />
              <TouchableOpacity onPress={() => removeImage(index)}>
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              value={formData.bio}
              textAlignVertical="top"
              onChangeText={(value) => handleInputChange("bio", value)}
              style={styles.bioInput}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education Level</Text>
          <EducationLevelPicker
            value={formData.education_level}
            onChange={(value) => handleInputChange("education_level", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dating Goal</Text>
          <DatingGoalPicker
            value={formData.dating_goal}
            onChange={(value) => handleInputChange("dating_goal", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <InterestsPicker
            selectedInterests={formData.interests}
            onChange={(value) => handleInputChange("interests", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <LanguagesPicker
            selectedLanguages={formData.languages}
            onChange={(value) => handleInputChange("languages", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Height (in cm)</Text>
          <TextInput
            keyboardType="numeric"
            value={formData.height.toString()}
            onChangeText={(value) => handleInputChange("height", value)}
          />
        </View>

        <Button
          title="Save"
          onPress={handleSubmit}
          disabled={!formData.age || !formData.gender}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
