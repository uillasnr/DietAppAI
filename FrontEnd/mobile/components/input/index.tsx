import { Colors } from "@/constants/Colors";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, Control } from "react-hook-form";

interface InputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  rules?: object;
  errors?: string;
  keyboardType: KeyboardTypeOptions;
}

export function Input({
  name,
  control,
  placeholder,
  rules,
  errors,
  keyboardType,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors ? styles.inputError : null
            ]}
            placeholder={placeholder}
            placeholderTextColor="#7e7e80"
            onBlur={onBlur}
            value={value}
            onChangeText={(text) => {
              // Adiciona um ponto após o primeiro dígito para o campo "height"
              if (name === "height") {
                if (text.length === 1) {
                  text += ".";
                }
              }
              onChange(text);
            }}
            keyboardType={keyboardType}
          />
        )}
      />
      {errors && <Text style={styles.errorText}>{errors}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 44,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: "#7e7e80",
    borderWidth: 1,
    color: Colors.black
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});