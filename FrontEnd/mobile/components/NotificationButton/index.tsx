import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import {
  clearMealDetails,
  getMealDetails,
  MealDetail,
} from "@/store/time-data";
import moment from "moment";
import { useDataStore } from "@/store/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Set notification handler once at the top level
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationButton() {
  const [mealDetails, setMealDetails] = useState<MealDetail[]>([]);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const storeMealDetails = useDataStore((state) => state.mealDetails);

  useEffect(() => {
    checkNotificationsStatus();
    loadMealDetails();
  }, []);

  useEffect(() => {
    if (storeMealDetails.length > 0) {
      setMealDetails(storeMealDetails);
    }
  }, [storeMealDetails]);

  useEffect(() => {
    if (mealDetails.length > 0 && isNotificationsEnabled) {
      scheduleMealNotifications();
    }
  }, [mealDetails, isNotificationsEnabled]);

  const loadMealDetails = async () => {
    const storedMealDetails = await getMealDetails();
    if (storedMealDetails) {
      setMealDetails(storedMealDetails);
    }
  };

  const checkNotificationsStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    const savedNotificationStatus = await AsyncStorage.getItem("notificationsEnabled");
    setIsNotificationsEnabled(savedNotificationStatus === "true" && status === "granted");
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permissão Necessária",
          "Para receber lembretes das refeições, precisamos da sua permissão.",
          [{ text: "Entendi" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao registrar notificações:", error);
      return false;
    }
  };

  const getNotificationIdentifier = (mealName: string, time: string) => {
    return `Notification: ${mealName} ⏱ ${time}`;
  };

  const scheduleMealNotifications = async () => {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return;

    try {
      // Cancel all existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (mealDetails && mealDetails.length > 0) {
        for (const meal of mealDetails) {
          const [hours, minutes] = meal.horario.split(":").map(Number);
          const identifier = getNotificationIdentifier(meal.nome, meal.horario);

          // Schedule a single notification per meal
          await Notifications.scheduleNotificationAsync({
            identifier, // Use a unique identifier for each notification
            content: {
              title: `⏰ Hora do ${meal.nome}!`,
              body: `Não se esqueça de fazer uma refeição saudável às ${meal.horario}.`,
              sound: "default",
              priority: Notifications.AndroidNotificationPriority.HIGH,
              color: "#4CAF50",
              vibrate: [0, 250, 250, 250],
            },
            trigger: {
              hour: hours,
              minute: minutes,
              repeats: true,
            },
          });

          console.log(
            `🔔 Notificação agendada para ${meal.nome} às ${meal.horario} (ID: ${identifier})`
          );
        }
      }

      if (!isNotificationsEnabled) {
        Alert.alert(
          "✅ Lembretes Ativados",
          "Você receberá notificações diárias para todas as suas refeições!",
          [{ text: "Ótimo!" }]
        );
      }

      await AsyncStorage.setItem("notificationsEnabled", "true");
      setIsNotificationsEnabled(true);
    } catch (error) {
      console.error("Erro ao agendar notificações:", error);
      Alert.alert(
        "Erro",
        "Não foi possível agendar as notificações. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const cancelMealNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setIsNotificationsEnabled(false);
      await clearMealDetails();
      setMealDetails([]);
      await AsyncStorage.setItem("notificationsEnabled", "false");

      Alert.alert(
        "❌ Notificações Desativadas",
        "Você não receberá mais lembretes das refeições."
      );
    } catch (error) {
      console.error("Erro ao cancelar notificações:", error);
    }
  };

  const toggleNotifications = () => {
    if (isNotificationsEnabled) {
      cancelMealNotifications();
    } else {
      scheduleMealNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleNotifications} activeOpacity={0.7}>
        <Ionicons
          name={
            isNotificationsEnabled
              ? "notifications-outline"
              : "notifications-off-outline"
          }
          size={30}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});