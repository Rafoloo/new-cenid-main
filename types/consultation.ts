
export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  email: string;
}

export interface Consultation {
  id: string;
  patientId: number;
  dataConsulta: string;
  horaConsulta: string;
  duracaoConsulta: number;
  tipoConsulta: string;
  especialidade: string;
  profissional: string;
  motivoConsulta: string;
  sintomasRelatados?: string;
  statusConsulta: string;
  prioridade: string;
  ultimaGlicemia?: string;
  ultimaHemoglobina?: string;
  medicamentos?: string;
  alergias?: string;
  precisaAcompanhante: boolean;
  nomeAcompanhante?: string;
  telefoneAcompanhante?: string;
  salaAtendimento?: string;
  consultaRemota: boolean;
  linkConsultaRemota?: string;
  enviarLembreteEmail: boolean;
  enviarLembreteSMS: boolean;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  
  nomePaciente?: string;
  cpf?: string;
  email?: string;
  patient?: Patient;
}

export type ConsultationStatus = 
  'Agendada' | 'Confirmada' | 'EmAndamento' | 'Concluida' | 'Cancelada' | 'Remarcada';

export type ConsultationType = 
  'PrimeiraConsulta' | 'RetornoRegular' | 'Emergencia' | 'Nutricional' | 'Psicologica' | 'ControleGlicemico';

export type ConsultationPriority = 
  'Baixa' | 'Media' | 'Alta' | 'Urgente';

export type Specialty = 'Medicina' | 'Psicologia' | 'Educação Física' | 'Nutrição';