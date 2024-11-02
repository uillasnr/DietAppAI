import {
  View,
  StyleSheet,
  Pressable,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface HeaderProps {
  step: string;
  title: string;
}

export function Header({ step, title }: HeaderProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={Colors.black} />
          </Pressable>

          <Text style={styles.text}>
            {step} <Feather name="loader" size={16} color={Colors.black} />
          </Text>
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    marginBottom: 14,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 25 : 25,

    // Sombras
    shadowColor: "#000000", // cor da sombra
    shadowOffset: { width: 0, height: 10 }, // deslocamento da sombra
    shadowOpacity: 0.3, // opacidade da sombra
    shadowRadius: 50, // raio de desfoque
    elevation: 30, // usado no Android para sombra
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 25,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingBottom: 10,
  },
  text: {
    fontSize: 18,
    color: Colors.black,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.black,
  },
});
