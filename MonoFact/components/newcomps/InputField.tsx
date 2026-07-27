import { TextInput, StyleSheet } from "react-native";

type InputFieldProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputFieldProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#A0A0A0"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,

    backgroundColor: "#F2F2F2",

    borderRadius: 12,

    paddingHorizontal: 15,

    marginBottom: 15,

    fontSize: 16,

    color: "#000",
  },
});