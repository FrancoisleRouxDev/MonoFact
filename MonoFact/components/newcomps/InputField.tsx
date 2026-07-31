import { ReactNode } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type InputFieldProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },

  leftIcon: {
    marginRight: Spacing.sm,
  },

  rightIcon: {
    marginLeft: Spacing.sm,
  },

  input: {
    flex: 1,
    minHeight: 56,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 0,
  },
});