import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "others" },
];

const GenderPicker = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {genderOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.button,
            value === option.value && styles.selectedButton,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.buttonText, value === option.value && styles.selectedText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    //   justifyContent: 'center',
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      margin: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'blue',
    },
    selectedButton: {
      backgroundColor: 'yellow',
      borderColor: '#888',
    },
    buttonText: {
      fontSize: 16,
    },
    selectedText: {
      color: 'black',
    },
});

export default GenderPicker;
