import { Colors } from "@/constants/Colors";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller } from "react-hook-form";

interface InputProps {
  name: string;
  control: any;
  placeholder?: string;
  rules?: object;
  error?: string;
  keyboardType: KeyboardTypeOptions;
}

export function Input({
  name,
  control,
  placeholder,
  rules,
  error,
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
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#7e7e80" // cor do placeholder
            onBlur={onBlur}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
          />
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 44,
    backgroundColor: Colors.input,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor:"#7e7e80",
    borderWidth: 1,
    color:"#D4D4D8"
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
