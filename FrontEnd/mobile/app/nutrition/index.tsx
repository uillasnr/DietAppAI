import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Share,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { useDataStore } from "../../store/data";
import { api } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { Colors } from "../../constants/Colors";
import { Data } from "../../types/data";
import { Link, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface ResponseData {
  data: Data;
}

export default function Nutrition() {
  const user = useDataStore((state) => state.user);
  const { setMealDetails } = useDataStore();
  const [showExercises, setShowExercises] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isFetching, error } = useQuery({
    queryKey: ["nutrition"],
    queryFn: async () => {
      try {
        if (!user) {
          throw new Error("Filed load nutrition");
        }

        // Função para adicionar o delay de 5 segundos
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
         await delay(5000);

        const response = await api.post<ResponseData>("/create" , {
              name: user.name,
              age: user.age,
              gender: user.gender,
              height: user.height,
              weight: user.weight,
              objective: user.objective,
              level: user.level,
        } );
        // Atualizar o estado com os dados de refeição
        setMealDetails(response.data.data);

     //   console.log("API Response:", response.data);
        return response.data.data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState); 
  };

  async function handleShare() {
    if (!data) return;

    const supplements = data.suplementos.join(", "); 
    const meals = data["refeições"]
      .map(
        (meal) =>
          `Nome: ${meal.nome}, Horário: ${
            meal.horario
          }, Alimentos: ${meal.alimentos.join(", ")}`
      )
      .join("\n");

    const message = `Dieta: ${data.nome}\nObjetivo: ${data.objetivo}\nRefeições:\n${meals}\nDica Suplemento: ${supplements}`;

    await Share.share({ message });
  }

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={48} color={Colors.white} />
        <Text style={styles.loadingText}>Estamos gerando sua dieta!</Text>
        <Text style={styles.loadingSubText}>Consultando IA...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={Colors.white} />
        <Text style={styles.loadingText}>Falha ao gerar dieta!</Text>
        <Link href="/">
          <Text style={styles.loadingText}>Tente novamente</Text>
        </Link>
      </View>
    );
  }

  const getMealIcon = (mealName: string) => {
    switch (mealName.toLowerCase()) {
      case "café da manhã":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/cafe-da-manha.png")}
          />
        );
      case "lanche da manhã":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/maçã.png")}
          />
        );
      case "almoço":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/comida.png")}
          />
        );
      case "lanche da tarde":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/torrada.png")}
          />
        );
      case "jantar":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/jantar.png")}
          />
        );
      case "lanche noturno (opcional)":
        return (
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../../app/../assets/images/lanche-noite.png")}
          />
        );
        case "ceia":
          return (
            <Image
              style={{ width: 30, height: 30 }}
              source={require("../../app/../assets/images/lanche-noite.png")}
            />
          );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Minha dieta</Text>

          <Pressable style={styles.buttonShare} onPress={handleShare}>
            <Text style={styles.buttonShareText}>Compartilhar</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingLeft: 16, paddingRight: 16, flex: 1 }}>
        {data && Object.keys(data).length > 0 && (
          <>
            <Text style={styles.name}>Nome: {data.nome}</Text>
            <Text style={styles.objective}>Foco: {data.objetivo}</Text>

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Refeições:</Text>
              {/* Botão que aciona o Modal */}
              <Pressable
                style={styles.buttonExercícios}
                onPress={() => {
                  setShowExercises((prev) => !prev);
                  toggleModal(); 
                }}
              >
                <Text style={styles.buttonTextExercises}>
                  Ver Dicas de Exercícios
                </Text>
              </Pressable>
            </View>

            <ScrollView>
              <View style={styles.foods}>
                {data &&
                Array.isArray(data["refeições"]) &&
                data["refeições"].length > 0 ? (
                  data["refeições"].map((refeicao, index) => (
                    <View key={index} style={styles.food}>
                      <View style={styles.foodHeader}>
                        <Text style={styles.foodName}>{refeicao.nome}</Text>
                        {getMealIcon(refeicao.nome)}
                      </View>

                      <View style={styles.foodContent}>
                        <Feather name="clock" size={14} color="#000" />
                        <Text>Horário: {refeicao.horario}</Text>
                      </View>

                      <Text style={styles.foodText}>Alimentos:</Text>
                      {Array.isArray(refeicao.alimentos) &&
                        refeicao.alimentos.map((alimento, idx) => (
                          <Text key={idx}>{alimento}</Text>
                        ))}
                    </View>
                  ))
                ) : (
                  <Text>Nenhuma refeição encontrada</Text>
                )}
              </View>

              <View style={styles.supplements}>
                <Text style={styles.foodName}>Água:</Text>
                {data.agua_diaria ? (
                  <View style={styles.iconAgua}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../../app/../assets/images/garrafa-de-água.png")}
                    />
                    <Text>{data.agua_diaria} L</Text>
                  </View>
                ) : (
                  <Text>Nenhuma informação de água encontrada</Text>
                )}
              </View>

              <View style={styles.supplements}>
                <Text style={styles.foodName}>Dica suplementos:</Text>
                <View style={styles.conteinerSupplements}>
                  <Image
                    style={{ width: 30, height: 30, marginRight: 10 }}
                    source={require("../../app/../assets/images/supplements.png")}
                  />

                  {Array.isArray(data.suplementos) &&
                  data.suplementos.length > 0 ? (
                    <View style={{ flexDirection: "column" }}>
                      {data.suplementos.map((item, index) => (
                        <Text key={index}>{item}</Text>
                      ))}
                    </View>
                  ) : (
                    <Text>Nenhuma dica de suplemento encontrada</Text>
                  )}
                </View>
              </View>

              {/* Exibe o modal com as dicas de exercícios */}
              <Modal
                visible={isModalVisible} 
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal} 
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Dicas de Exercícios</Text>
                    {/* Adicione suas dicas de exercícios aqui */}
                    {data?.exercicios?.map((exercicio, index) => (
                      <View key={index} style={styles.exercise}>
                        <Text style={styles.exerciseName}>
                          {exercicio.nome}
                        </Text>
                        <Text>Intensidade: {exercicio.intensidade}</Text>
                        <Text>Duração: {exercicio.duracao}</Text>
                        <Text>Frequência: {exercicio.frequencia}</Text>
                      </View>
                    ))}
                    <Pressable
                      style={styles.buttonClose}
                      onPress={toggleModal} 
                    >
                      <Text style={styles.buttonCloseText}>Fechar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <Pressable
                style={styles.button}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.buttonText}>Gerar nova dieta</Text>
              </Pressable>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: Colors.white,
  },
  loadingSubText: {
    fontSize: 16,
    marginTop: 8,
    color: Colors.white,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  containerHeader: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 60,
    paddingBottom: 20,
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 28,
    color: Colors.background,
    fontWeight: "bold",
  },
  buttonShare: {
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 4,
  },
  buttonShareText: {
    color: Colors.white,
    fontWeight: "500",
  },
  name: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "bold",
  },
  objective: {
    color: Colors.white,
    fontSize: 16,
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  foods: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  food: {
    backgroundColor: "rgba(208, 208, 208, 0.40)",
    padding: 8,
    borderRadius: 4,
  },
  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodText: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 14,
  },
  iconAgua: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  supplements: {
    backgroundColor: Colors.white,
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
  },
  conteinerSupplements: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.blue,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 30,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonExercícios: {
    width: 175,
    backgroundColor: Colors.blue,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 5,
  },
  buttonTextExercises: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  exercise: {
    backgroundColor: "rgba(208, 208, 208, 0.40)",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonClose: {
    backgroundColor: Colors.blue,
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonCloseText: {
    color: Colors.white,
    fontWeight: "500",
  },
  rowContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
  },
});
