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
    if (storeMealDetails.length > 0) {setMealDetails(storeMealDetails); }
  }, [storeMealDetails]);

  useEffect(() => {
    if (mealDetails.length > 0) {
      scheduleMealNotifications();
    }
  }, [mealDetails]);

  const loadMealDetails = async () => {
    const storedMealDetails = await getMealDetails();
    if (storedMealDetails) {
      setMealDetails(storedMealDetails);
    }
  };

  const checkNotificationsStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setIsNotificationsEnabled(status === "granted");

    // Carregar estado de notificações salvo no AsyncStorage
    const savedNotificationStatus = await AsyncStorage.getItem("notificationsEnabled");

    if (savedNotificationStatus === "true") {
      setIsNotificationsEnabled(true);
    } else {
      setIsNotificationsEnabled(false);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
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

  const getNextOccurrence = (mealTime: string, currentTime: moment.Moment) => {
    const [hours, minutes] = mealTime.split(":").map(Number);
    const mealMoment = moment(currentTime).set({
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    if (mealMoment.isBefore(currentTime)) {
      mealMoment.add(1, "day");
    }

    return mealMoment;
  };

  const scheduleMealNotifications = async () => {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (mealDetails && mealDetails.length > 0) {
        const currentTime = moment().local();

        for (const meal of mealDetails) {
          const nextMealTime = getNextOccurrence(meal.horario, currentTime);
          const [hours, minutes] = meal.horario.split(":").map(Number);

          console.log(`🔔 Agendando notificação: ${meal.nome} às ${meal.horario} ${nextMealTime.isSame(currentTime, "day") ? "(hoje)" : "(amanhã)"}`
          );

          await Notifications.scheduleNotificationAsync({
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

          console.log("⏱ Notificação agendada para todos os dias no horário:",`${meal.horario}`, "⏱");
        }
      } else {
        console.log("⚠️ Nenhum detalhe de refeição disponível para agendamento.");
      }

      if (!isNotificationsEnabled) {
        Alert.alert(
          "✅ Lembretes Ativados",
          "Você receberá notificações diárias para todas as suas refeições!",
          [{ text: "Ótimo!" }]
        );
      }
      // Salvar estado de notificações no AsyncStorage
      await AsyncStorage.setItem("notificationsEnabled", "true");

      setIsNotificationsEnabled(true);
      await AsyncStorage.setItem("notificationsEnabled", "true");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível agendar as notificações. Tente novamente.",
        [{ text: "OK" }]
      );
      console.error("Erro ao agendar notificações:", error);
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
