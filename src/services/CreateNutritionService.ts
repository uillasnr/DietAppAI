
import { DataProps } from '../controllers/CreateNutritionController'
import { GoogleGenerativeAI } from '@google/generative-ai'

class CreateNutritionService {
  async execute({ name, age, gender, height, level, objective, weight }: DataProps){
    
    try{
      const genAI = new GoogleGenerativeAI(process.env.API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"})

      const response = await model.generateContent(
        `Crie uma dieta completa para uma pessoa com nome: ${name} do sexo ${gender} 
        com peso atual: ${weight}kg, altura: ${height}, idade: ${age} anos e com foco e objetivo em 
        ${objective}, atualmente nível de atividade: ${level}. Calcule também quanto de água essa pessoa 
        deve beber diariamente com base na fórmula de 35ml de água por kg de peso corporal, e adicione uma 
        propriedade 'agua_diaria' no retorno com o valor calculado em litros.
      
        Além disso, inclua uma seção 'exercicios' com recomendações de exercícios personalizados que complementem o plano alimentar. 
        Baseie os exercícios no nível de atividade e no objetivo da pessoa, fornecendo detalhes como nome do exercício, duração, intensidade, e frequência recomendada. 
        Retorne tudo em json com as seguintes propriedades: nome, sexo, idade, altura, peso, objetivo, refeições (com horário, nome, alimentos), suplementos (opcional), água diária (agua_diaria), e exercícios (exercicios).
        
        Não retorne observações além das passadas no prompt.`
      );
      
    
      console.log(JSON.stringify(response, null, 2));

      if(response.response && response.response.candidates){
        const jsonText = response.response.candidates[0]?.content.parts[0].text as string;

        //Extrair o JSON
        let jsonString = jsonText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim();

        let jsonObject = JSON.parse(jsonString)

        return { data: jsonObject }
      }


    }catch(err){
      console.error("Erro JSON: ", err)
      throw new Error("Failed create.")
    }
    
    
  }
}

export { CreateNutritionService }