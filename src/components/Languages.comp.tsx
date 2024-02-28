import { View, Text, TouchableOpacity } from "react-native";

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese',
  'Korean', 'Arabic', 'Russian', 'Hindi', 'Bengali', 'Punjabi', 'Urdu', 'Tamil', 'Telugu',
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam'
];

const LanguagesPicker = ({ selectedLanguages, onChange }) => {

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={{
            borderWidth: selectedLanguages.includes(language) ? 2 : 0,
            borderRadius: 5,
            padding: 10,
            margin: 5,
            borderColor: selectedLanguages.includes(language) ? "blue" : "transparent",
          }}
          onPress={() => {
            if (selectedLanguages.includes(language)) {
              onChange(selectedLanguages.filter((l) => l !== language));
            } else {
              onChange([...selectedLanguages, language]);
            }
          }}
        >
          <Text>{language}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguagesPicker;
