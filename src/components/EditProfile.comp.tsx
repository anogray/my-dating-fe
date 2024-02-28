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
  //   profilePicture: null,
  //   bio: "",
  //   educationLevel: "",
  //   datingGoal: "",
  //   interests: [],
  //   languages: [],
  //   height: "",
  //   age: null,
  // });

  const [formData, setFormData] = useState({ ...userData });
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

  console.log("EditProfile formData", formData);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData({
        ...formData,
        profilePicture: result.uri,
      });
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

      if (Object.keys(filteredFormData).length>0) {
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

        {/* <TouchableOpacity onPress={pickImage}>
          <Text>Choose Profile Picture</Text>
        </TouchableOpacity>
        {formData.profilePicture && (
          <Image
            source={{ uri: formData.profilePicture }}
            style={{ width: 200, height: 200 }}
          />
        )} */}

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
            value={formData.educationLevel}
            onChange={(value) => handleInputChange("educationLevel", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dating Goal</Text>
          <DatingGoalPicker
            value={formData.datingGoal}
            onChange={(value) => handleInputChange("datingGoal", value)}
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
