import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} />

      <Text style={styles.title}>
        Dieta<Text style={{ color: Colors.white }}>.AI</Text>
      </Text>

      <Text style={styles.text}>
        Sua dieta personalizada com inteligência artificial
      </Text>

      <Link href="/step" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Gerar dieta</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.green,
  },
  text: {
    fontSize: 16,
    color: Colors.white,
    width: 240,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.blue,
    width: "100%",
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 34,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
