import { FastifyInstance, FastifyPluginOptions,  FastifyRequest, FastifyReply } from 'fastify'
import { CreateNutritionController } from './controllers/CreateNutritionController';
  
  export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions){
  
    fastify.get("/teste", (request: FastifyRequest, reply: FastifyReply) => {
      
      let responseText = "```json\n{\n" +
      "  \"nome\": \"Matheus\",\n" +
      "  \"sexo\": \"Masculino\",\n" +
      "  \"idade\": 28,\n" +
      "  \"altura\": 1.8,\n" +
      "  \"peso\": 74,\n" +
      "  \"objetivo\": \"Hipertrofia\",\n" +
      "  \"refeições\": [\n" +
      "    {\n" +
      "      \"horario\": \"08:00\",\n" +
      "      \"nome\": \"Café da manhã\",\n" +
      "      \"alimentos\": [\n" +
      "        \"2 fatias de pão integral\",\n" +
      "        \"2 ovos mexidos com espinafre\",\n" +
      "        \"1 banana\",\n" +
      "        \"200ml de leite desnatado\"\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"horario\": \"10:30\",\n" +
      "      \"nome\": \"Lanche da manhã\",\n" +
      "      \"alimentos\": [\n" +
      "        \"1 scoop de whey protein\",\n" +
      "        \"1 maçã\"\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"horario\": \"13:00\",\n" +
      "      \"nome\": \"Almoço\",\n" +
      "      \"alimentos\": [\n" +
      "        \"150g de frango grelhado\",\n" +
      "        \"1 xícara de arroz integral\",\n" +
      "        \"1 xícara de brócolis cozido\",\n" +
      "        \"Salada de folhas verdes com azeite de oliva e limão\"\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"horario\": \"15:30\",\n" +
      "      \"nome\": \"Lanche da tarde\",\n" +
      "      \"alimentos\": [\n" +
      "        \"1 iogurte grego com granola\",\n" +
      "        \"1 colher de sopa de pasta de amendoim\"\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"horario\": \"19:00\",\n" +
      "      \"nome\": \"Jantar\",\n" +
      "      \"alimentos\": [\n" +
      "        \"150g de carne vermelha magra\",\n" +
      "        \"1 batata doce assada\",\n" +
      "        \"1 xícara de couve refogada\"\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"horario\": \"21:00\",\n" +
      "      \"nome\": \"Lanche antes de dormir\",\n" +
      "      \"alimentos\": [\n" +
      "        \"2 colheres de sopa de cottage\",\n" +
      "        \"1 banana\"\n" +
      "      ]\n" +
      "    }\n" +
      "  ],\n" +
      "  \"suplementos\": [\n" +
      "    \"Whey protein\",\n" +
      "    \"Creatina\"\n" +
      "  ],\n" +
      "  \"agua_diaria\": 2.59,\n" +
      "  \"exercicios\": [\n" +
      "    {\n" +
      "      \"nome\": \"Treino A - Peito, Triceps e Ombros\",\n" +
      "      \"intensidade\": \"Alta\",\n" +
      "      \"duracao\": \"60 minutos\",\n" +
      "      \"frequencia\": \"2 vezes por semana\"\n" +
      "    },\n" +
      "    {\n" +
      "      \"nome\": \"Treino B - Costas, Biceps e Antebraços\",\n" +
      "      \"intensidade\": \"Alta\",\n" +
      "      \"duracao\": \"60 minutos\",\n" +
      "      \"frequencia\": \"2 vezes por semana\"\n" +
      "    },\n" +
      "    {\n" +
      "      \"nome\": \"Treino C - Perna e Panturrilha\",\n" +
      "      \"intensidade\": \"Alta\",\n" +
      "      \"duracao\": \"75 minutos\",\n" +
      "      \"frequencia\": \"1 vez por semana\"\n" +
      "    },\n" +
      "    {\n" +
      "      \"nome\": \"Cardio\",\n" +
      "      \"intensidade\": \"Moderada\",\n" +
      "      \"duracao\": \"30 minutos\",\n" +
      "      \"frequencia\": \"3 vezes por semana\"\n" +
      "    }\n" +
      "  ]\n" +
    "}\n```";
    
      try{
  
        //Extrair o JSON
        let jsonString = responseText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim();
  
        let jsonObject = JSON.parse(jsonString)
  
        return reply.send({ data: jsonObject });   
  
      }catch(err){
        console.log(err)
      }
  
  
  
      reply.send({ ok: true })
    })
  
    fastify.post("/create", async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateNutritionController().handle(request, reply)
    })
  
  
  }

