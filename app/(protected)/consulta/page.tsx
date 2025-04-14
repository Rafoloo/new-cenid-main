"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputMask from "react-input-mask";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Stethoscope, Brain, Dumbbell, Apple, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CaptionProps, useNavigation } from "react-day-picker";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Specialty = 'Medicina' | 'Psicologia' | 'Educação Física' | 'Nutrição';

interface Patient {
  id: number;
  nome: string;
  cpf: string;
  email: string;
}

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CustomHeader = (props: { displayMonth: any }) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const { displayMonth } = props;

  return (
    <div className="flex justify-between items-center px-2 py-1">
      <button
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className="text-gray-600 hover:text-gray-800"
        disabled={!previousMonth}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-sm font-medium text-gray-800">
        {format(displayMonth, "MMMM yyyy", { locale: ptBR })}
      </span>
      <button
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className="text-gray-600 hover:text-gray-800"
        disabled={!nextMonth}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};


const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;


  if (/^(\d)\1+$/.test(cpf)) return false;


  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const ConsultaSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  dataConsulta: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      return selectedDate >= today;
    },
    "Data deve ser igual ou posterior a hoje"
  ),
  horaConsulta: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido")
    .refine(
      (time) => {
        const [hours] = time.split(":").map(Number);
        return hours >= 8 && hours <= 18;
      },
      "Horário deve estar entre 8:00 e 18:00"
    ),
  duracaoConsulta: z
    .number()
    .min(15, "A duração mínima é de 15 minutos")
    .max(240, "A duração máxima é de 240 minutos"),
  tipoConsulta: z.enum([
    "PrimeiraConsulta",
    "RetornoRegular",
    "Emergencia",
    "Nutricional",
    "Psicologica",
    "ControleGlicemico",
  ]),
  especialidade: z.string().min(1, "A especialidade é obrigatória"),
  profissional: z.string().min(1, "O nome do profissional é obrigatório"),
  motivoConsulta: z.string().min(1, "O motivo da consulta é obrigatório"),
  sintomasRelatados: z.string().optional(),
  statusConsulta: z.enum([
    "Agendada",
    "Confirmada",
    "EmAndamento",
    "Concluida",
    "Cancelada",
    "Remarcada",
  ]),
  prioridade: z.enum(["Baixa", "Media", "Alta", "Urgente"]),
  ultimaGlicemia: z.string().optional(),
  ultimaHemoglobina: z.string().optional(),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  precisaAcompanhante: z.boolean(),
  nomeAcompanhante: z.string().optional(),
  telefoneAcompanhante: z.string().optional(),
  salaAtendimento: z.string().optional(),
  consultaRemota: z.boolean(),
  linkConsultaRemota: z.string().optional(),
  enviarLembreteEmail: z.boolean(),
  enviarLembreteSMS: z.boolean(),
  observacoes: z.string().optional(),
}).refine(
  (data) => !data.precisaAcompanhante || (data.nomeAcompanhante && data.nomeAcompanhante.length > 0),
  { message: "O nome do acompanhante é obrigatório quando precisa de acompanhante", path: ["nomeAcompanhante"] }
).refine(
  (data) => !data.consultaRemota || (data.linkConsultaRemota && data.linkConsultaRemota.length > 0),
  { message: "O link é obrigatório para consultas remotas", path: ["linkConsultaRemota"] }
);

const PatientSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14)
    .transform((val) => val.replace(/\D/g, ""))
    .refine((cpf) => validateCPF(cpf), "CPF inválido"),
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Nome deve conter apenas letras"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

type ConsultaFormValues = z.infer<typeof ConsultaSchema>;
type PatientFormValues = z.infer<typeof PatientSchema>;

interface InputMaskProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConsultaForm = () => {
  const form = useForm<ConsultaFormValues>({
    resolver: zodResolver(ConsultaSchema),
    defaultValues: {
      patientId: "",
      dataConsulta: "",
      horaConsulta: "",
      duracaoConsulta: 60,
      tipoConsulta: undefined,
      especialidade: "",
      profissional: "",
      motivoConsulta: "",
      sintomasRelatados: "",
      statusConsulta: "Agendada",
      prioridade: "Media",
      ultimaGlicemia: "",
      ultimaHemoglobina: "",
      medicamentos: "",
      alergias: "",
      precisaAcompanhante: false,
      nomeAcompanhante: "",
      telefoneAcompanhante: "",
      salaAtendimento: "",
      consultaRemota: false,
      linkConsultaRemota: "",
      enviarLembreteEmail: true,
      enviarLembreteSMS: true,
      observacoes: "",
    },
  });

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      cpf: "",
      nome: "",
      email: "",
    },
  });

  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar pacientes ao carregar o componente
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const response = await fetch('/api/patients');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patients');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error("Erro ao carregar pacientes. Por favor, recarregue a página.");
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSpecialtyClick = (specialty: Specialty) => {
    if (selectedSpecialty === specialty) {
      setSelectedSpecialty(null);
      form.setValue('especialidade', '');
    } else {
      setSelectedSpecialty(specialty);
      form.setValue('especialidade', specialty);
    }
  };

  // No arquivo ConsultaForm.jsx ou ConsultaForm.tsx
// Substitua a função onSubmit por esta versão corrigida:

const onSubmit = async (data: ConsultaFormValues) => {
  try {
    setIsSubmitting(true);

    if (!selectedSpecialty) {
      toast.error("Selecione uma especialidade");
      return;
    }

    // Validação adicional para garantir que o ID do paciente existe
    if (!patients.some(p => p.id === parseInt(data.patientId))) {
      toast.error("Paciente selecionado não é válido");
      return;
    }

    // Verificar se a data e hora estão preenchidas
    if (!data.dataConsulta || !data.horaConsulta) {
      toast.error("Data e hora da consulta são obrigatórias");
      return;
    }

    // Preparar dados para envio
    const consultaData = {
      ...data,
      patientId: parseInt(data.patientId),
      especialidade: selectedSpecialty,
    };

    console.log("Enviando dados:", consultaData);

    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultaData),
    });

    // Lidar com a resposta diretamente como JSON
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Falha ao criar consulta');
    }

    console.log("Resposta da API:", responseData);

    // Sucesso no agendamento
    toast.success("Consulta agendada com sucesso!");
    
    // Limpar formulário
    form.reset();
    setSelectedSpecialty(null);
    
    // Redirecionar após sucesso
    router.push('/');
    
  } catch (error) {
    console.error('Error creating consultation:', error);
    toast.error(`Erro ao agendar consulta: ${error instanceof Error ? error.message : 'Tente novamente'}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const onPatientSubmit = async (data: PatientFormValues) => {
    try {
      const existingPatient = patients.find(p => p.cpf === data.cpf);
      if (existingPatient) {
        toast.error("CPF já cadastrado no sistema");
        return;
      }

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: data.nome,
          cpf: data.cpf,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar paciente');
      }

      const newPatient = await response.json();
      setPatients([...patients, newPatient]);
      form.setValue('patientId', String(newPatient.id));
      setIsNewPatient(false);
      patientForm.reset();
      toast.success("Paciente criado com sucesso!");
    } catch (error: any) {
      console.error('Error creating patient:', error);
      toast.error(`Erro ao criar paciente: ${error?.message || 'Tente novamente'}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Card className="max-w-5xl mx-auto my-8 shadow-md rounded-lg border border-gray-100">
        <CardHeader className="bg-teal-100 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-teal-200"
            >
              <ArrowLeft className="h-5 w-5 text-teal-800" />
            </Button>
            <CardTitle className="text-xl font-semibold text-teal-800">Cadastro de Consulta</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Seção de Especialidade - Estilo do primeiro arquivo */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Selecione a Especialidade*</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleSpecialtyClick('Medicina')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Medicina'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Stethoscope className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Medicina</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Psicologia')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Psicologia'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Brain className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Psicologia</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Educação Física')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Educação Física'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Dumbbell className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Educação Física</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Nutrição')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Nutrição'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Apple className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Nutrição</span>
              </button>
            </div>
          </div>

          {/* Restante do formulário (manter toda a implementação existente) */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ... (manter todas as seções do formulário existente) */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaForm;