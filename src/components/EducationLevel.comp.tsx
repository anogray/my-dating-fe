import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const educationLevels = [
  { label: 'None', value: 'None' },
  { label: 'High School', value: 'High School' },
  { label: 'Some College', value: 'Some College' },
  { label: 'Associate Degree', value: 'Associate Degree' },
  { label: "Bachelor's Degree", value: "Bachelor's Degree" },
  { label: "Master's Degree", value: "Master's Degree" },
  { label: 'Doctorate Degree', value: 'Doctorate Degree' },
  { label: 'Other', value: 'Other' },
];

const EducationLevelPicker = ({ value, onChange }) => {

  return (
    <View style={styles.container}>
      {educationLevels.map((level) => (
        <TouchableOpacity
          key={level.value}
          style={[
            styles.button,
            value === level.value && styles.selectedButton,
          ]}
          onPress={() => onChange(level.value)}
        >
          <Text style={[styles.buttonText, value === level.value && styles.selectedText]}>
            {level.label}
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
    justifyContent: 'center',
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

export default EducationLevelPicker;
