import { View, Text, TouchableOpacity } from "react-native";

const datingGoals = [
  { label: 'Long Term Partner', value: 'LONG_TERM_PARTNER' },
  { label: 'Short Term Relationship', value: 'SHORT_TERM_RELATIONSHIP' },
  { label: 'New Friends', value: 'NEW_FRIENDS' },
  { label: 'Still Figuring Out', value: 'STILL_FIGURING_OUT' },
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
