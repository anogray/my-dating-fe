import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Light background
    // padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 3,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff', // Blue button
    color: '#fff',
    padding: 10,
    borderRadius: 3,
    fontSize: 16,
  },
  // Additional styles for focus and hover states:
  inputFocused: {
    borderColor: '#007bff',
  },
  buttonHover: {
    backgroundColor: '#0069d9', // Darker blue on hover
  },
});
