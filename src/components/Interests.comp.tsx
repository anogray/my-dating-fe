// InterestsPicker.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const interests = [
  'Sports', 'Music', 'Travel', 'Food', 'Movies', 'Gaming', 'Reading', 'Fitness', 'Arts', 'Other'
];
const InterestsPicker = ({ selectedInterests, onChange }) => {

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {interests.map((interest) => (
        <TouchableOpacity
          key={interest}
          style={{
            borderWidth: selectedInterests.includes(interest) ? 2 : 0,
            borderRadius: 5,
            padding: 10,
            margin: 5,
            borderColor: selectedInterests.includes(interest) ? "blue" : "transparent",
          }}
          onPress={() => {
            if (selectedInterests.includes(interest)) {
              onChange(selectedInterests.filter((i) => i !== interest));
            } else {
              onChange([...selectedInterests, interest]);
            }
          }}
        >
          <Text>{interest}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default InterestsPicker;
