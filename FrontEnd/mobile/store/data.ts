import { create } from 'zustand'
import { saveMealDetails } from './time-data';

export type User = {
  name: string;
  weight: string;
  age: string;
  height: string;
  level: string;
  objective: string;
  gender: string;
}

type Refeicao = {
  nome: string;
  horario: string;
}

type DataState = {
  user: User;
  mealDetails: Refeicao[];  // Adicionando o estado para armazenar os detalhes das refeições
  setPageOne: (data: Omit<User, "gender" | "objective" | "level">) => void;
  setPageTwo: (data: Pick<User, "gender" | "objective" | "level">) => void;
  setMealDetails: (data: any) => void;  // Função para atualizar os detalhes das refeições
}

export const useDataStore = create<DataState>((set) => ({
  user: {
    name: "",
    age: "",
    level: "",
    objective: "",
    gender: "",
    height: "",
    weight: ""
  },

  // Estado para armazenar os detalhes das refeições
  mealDetails: [],
  
  setPageOne: (data) => set((state) => ({ user: {...state.user, ...data} }) ),
  setPageTwo: (data) => set((state) => ({ user: {...state.user, ...data} }) ),

  setMealDetails: (data) => {
    // Garantindo que o tipo de 'refeicao' seja corretamente inferido
    const mealDetails = data?.refeições?.map((refeicao: { nome: string, horario: string }) => ({
      nome: refeicao.nome,
      horario: refeicao.horario,
    })) || [];

    // Salva os detalhes das refeições no AsyncStorage
    saveMealDetails(mealDetails);
    
    set({ mealDetails });  // Armazenando os dados no estado
  }
}))