import { View, Text, TouchableOpacity } from "react-native";

const datingGoals = [
  { label: 'Long Term Partner', value: 'Long Term Partner' },
  { label: 'Short Term Relationship', value: 'Short Term Relationship' },
  { label: 'New Friends', value: 'New Friends' },
  { label: 'Still Figuring Out', value: 'Still Figuring Out' },
];

const DatingGoalPicker = ({ value, onChange }) => {

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {datingGoals.map((goal) => (
        <TouchableOpacity
          key={goal.value}
          style={{
            borderWidth: value === goal.value ? 2 : 0,
            borderRadius: 5,
            padding: 10,
            margin: 5,
            borderColor: value === goal.value ? "blue" : "transparent",
          }}
          onPress={() => onChange(goal.value)}
        >
          <Text>{goal.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DatingGoalPicker;
