import React, { useEffect, useState } from "react";
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
import * as ImagePickerFile from "react-native-image-picker";
import ReactNativeBlobUtil from "react-native-blob-util";

import * as FileSystem from "expo-file-system";
// import RNFetchBlob from "rn-fetch-blob";
// import RNFS from 'react-native-fs';
// import RNFS from "react-native-fs";
// import {fs} from 'react-native-fetch-blob'
import RNFetchBlob from "react-native-fetch-blob";
import { useLocationContext } from "./Location.comp";
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

  console.log("EditProfile",!userData.yob,userData.yob)
  const { token, setProfile } = useContext(AuthContext);
  const { location, errorMsg  } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ ...userData });
  const [fileUri, setfileUri] = useState("");

  const handleInputChange = (field, value) => {
    if (field === "yearOfBirth") {

      if (value.length < 4) {
        setFormData({
          ...formData,
          yob: value,
        });
        return;
      }
      const today = new Date();
      const birthYear = parseInt(value, 10);
      let age = today.getFullYear() - birthYear;
      console.log("yearOfBirthChange",age)
      if (age < 18) {
        Toast.warn("Only 18+ users are allowed");
        setFormData({
          ...formData,
          yob: null,
        });
        return;
      }
      setFormData({
        ...formData,
        yob: birthYear,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  useEffect(() => {
    if (fileUri) {
      handleImagePost();
    }
  }, [fileUri]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
      });

      if (result) {
        const fileUri =
          Platform.OS === "ios"
            ? result.assets[0].uri.replace("file://", "")
            : result.assets[0].uri;

        setfileUri(fileUri);
      }
    } catch (err) {
      console.log("pickImageErr", err);
      setfileUri(fileUri);
    }
  };

  const handleImagePost = async () => {
    try {
      setLoading(true);
      const result = await UserService.addImage(token, fileUri);
      setProfile({ ...result });
      setFormData({ ...result });
    } catch (err) {
      console.log("handleImagePost Err", err);
    } finally {
      setLoading(false);
      setfileUri("");
    }
  };

  const removeImage = async (index: number) => {
    try {
      const newImages = [...formData.images];
      setLoading(true);
      const result = await UserService.removeImage(token, newImages[index]);
      console.log("removeImage result", result);
      newImages.splice(index, 1);
      setFormData({
        ...formData,
        images: newImages,
      });
      setProfile({
        ...formData,
        images: newImages,
      });
    } catch (err) {
      console.log("removeImage Err : ", err);
    } finally {
      setLoading(false);
    }
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
        const response = await UserService.updateProfile(token, sendFormData);
        console.log("Responded", response);
        setProfile({...response});
        setFormData({ ...response });
      }
      //@ts-ignore
      // navigation.navigate("Profile");
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
        {!userData.yob &&
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            *Year of Birth
          </Text>
          <TextInput
            placeholder="YYYY"
            keyboardType="numeric"
            value={formData.yob ? formData.yob.toString() : null}
            onChangeText={(value) => handleInputChange("yearOfBirth", value)}
          />
        </View>
        }

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <GenderPicker
            value={formData.gender}
            onChange={(value) => handleInputChange("gender", value)}
          />
        </View>

        <View style={styles.section}>
          <Button title="Upload Image" onPress={pickImage} />
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
            value={formData.height ? formData.height.toString() : null}
            onChangeText={(value) => handleInputChange("height", value)}
          />
        </View>

        <Button
          title="Save"
          onPress={handleSubmit}
          disabled={!formData.yob || !formData.gender}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
