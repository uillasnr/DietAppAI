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
import { NotificationButton } from "../NotificationButton";

interface HeaderProps {
  step: string;
  title: string;
 // mealDetails: { nome: string; horario: string }[];  // Adicionando a propriedade mealDetails
}

export function Header({ step, title }: HeaderProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          {/* Área da seta e texto do passo */}
          <View style={styles.leftContainer}>
            <Pressable onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.black} />
            </Pressable>
            <Text style={styles.text}>
              {step} <Feather name="loader" size={16} color={Colors.black} />
            </Text>
          </View>

          {/* Ícone de sino para notificações no canto direito */}
          <NotificationButton />
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 30,
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
    justifyContent: "space-between", 
    alignItems: "center",
    paddingBottom: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
