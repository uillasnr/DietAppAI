import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

import { Colors } from "@/constants/Colors";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useDataStore } from "@/store/data";

const schema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório",
    })
    .min(1, "O nome é obrigatório"),
  weight: z
    .string({
      required_error: "O peso é obrigatório",
    })
    .min(1, "O peso é obrigatório")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Peso deve ser um número válido",
    }),
  age: z
    .string({
      required_error: "A idade é obrigatória",
    })
    .min(1, "A idade é obrigatória")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Idade deve ser um número válido",
    }),
  height: z
    .string({
      required_error: "A altura é obrigatória",
    })
    .min(1, "A altura é obrigatória")
    .transform((val) => Number(val.replace(",", ".")))
    .refine((val) => !isNaN(val) && val > 0 && val <= 3, {
      message: "Altura deve ser um número válido (em metros)",
    }),
});

type FormData = z.infer<typeof schema>;

export default function Step() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const setPageOne = useDataStore((state) => state.setPageOne);

  function handleCreate(data: FormData) {
    console.log("PASSANDO DADOS DA PAGINA 1", data);

    setPageOne({
      name: data.name,
      weight: String(data.weight),
      age: String(data.age),
      height: String(data.height),
    });

    router.push("/create");
  }

  return (
    <View style={styles.container}>
      <Header step="Passo 1" title="Vamos começar" />

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Nome:</Text>
        <Input
          name="name"
          control={control}
          placeholder="Digite seu nome..."
          errors={errors.name?.message}
          keyboardType="default"
        />

        <Text style={styles.label}>Seu peso atual:</Text>
        <Input
          name="weight"
          control={control}
          placeholder="Ex: 75"
          errors={errors.weight?.message}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Sua altura atual:</Text>
        <Input
          name="height"
          control={control}
          placeholder="Ex: 1.90"
          errors={errors.height?.message}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Sua idade atual:</Text>
        <Input
          name="age"
          control={control}
          placeholder="Ex: 24"
          errors={errors.age?.message}
          keyboardType="numeric"
        />

        <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
          <Text style={styles.buttonText}>Avançar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 80,
  },
  label: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.blue,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 80,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
