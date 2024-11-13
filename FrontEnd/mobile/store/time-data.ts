import AsyncStorage from '@react-native-async-storage/async-storage';


export interface MealDetail {
  nome: string;
  horario: string;
}

// Função para salvar os horários das refeições no AsyncStorage
const saveMealDetails = async (mealDetails: MealDetail[]) => {
  try {
   
    const jsonValue = JSON.stringify(mealDetails);
    await AsyncStorage.setItem('@meal_details', jsonValue);
   // console.log('Dados salvos com sucesso!🚀',jsonValue ,'🚀');
    
  } catch (e) {
    console.error('Erro ao salvar os dados:', e);
  }
};

// Função para recuperar os detalhes das refeições armazenados
const getMealDetails = async (): Promise<MealDetail[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@meal_details');
    return jsonValue != null ? JSON.parse(jsonValue) : null; 
  } catch (e) {
    console.error('Erro ao recuperar os dados:', e);
    return null;
  }
};

// Função para limpar os dados de refeições armazenados
const clearMealDetails = async () => {
  try {
    await AsyncStorage.removeItem('@meal_details');
    console.log('Dados apagados com sucesso!');
  } catch (e) {
    console.error('Erro ao limpar os dados:', e);
  }
};

export { saveMealDetails, getMealDetails, clearMealDetails };


/* const horarioAtual = new Date().toLocaleTimeString();
console.log(`🎉Horário atual formatado:🎉 ${horarioAtual}`); */