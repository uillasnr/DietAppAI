interface RefeicoesProps{
  horario: string;
  nome: string;
  alimentos: string[];
}

interface ExerciciosProps {
  nome: string;
  intensidade: string;
  duracao: string;
  frequencia: string;
}

export interface Data {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  peso: number;
  objetivo: string; 
  agua_diaria: string;
  "refeições": RefeicoesProps[];
  suplementos: string[];
  exercicios: ExerciciosProps[];
}

  