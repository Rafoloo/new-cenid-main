
"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Brain,
  Dumbbell,
  Apple,
  ArrowLeft,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ActivitySquare,
  Check,
  Search,
  User,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CaptionProps, useNavigation } from "react-day-picker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import InputMask from "react-input-mask";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import FormularioMedicina from "@/components/auth/medicina-form";
import FormularioPsicologia from "@/components/auth/psicologia-form";
import FormularioEducacaoFisica from "@/components/auth/fisica-form";
import FormularioNutricao from "@/components/auth/nutricao-form";
import FormularioEnfermagem from "@/components/auth/enfermagem-form";

// Tipos exportados para uso nos formulários de especialidade
export type Specialty = "Medicina" | "Psicologia" | "Educação Física" | "Nutrição" | "Enfermagem";

export interface ConsultaFormValues {
  patientId: string;
  dataConsulta: string;
  horaConsulta: string;
  duracaoConsulta: number;
  tipoConsulta: "PrimeiraConsulta" | "RetornoRegular" | "Emergencia" | "Nutricional" | "Psicologica" | "ControleGlicemico";
  especialidade: string;
  profissional: string;
  motivoConsulta: string;
  sintomasRelatados?: string;
  statusConsulta: "Agendada" | "Confirmada" | "EmAndamento" | "Concluida" | "Cancelada" | "Remarcada";
  prioridade: "Baixa" | "Media" | "Alta" | "Urgente";
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
}

interface Patient {
  id: number;
  nome: string;
  cpf: string;
  email: string;
}

interface PatientFormValues {
  cpf: string;
  nome: string;
  email: string;
}

interface InputMaskProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Função para formatar data no formato YYYY-MM-DD
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Função para validar CPF
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
};

// Esquema Zod para validar o formulário de consulta
const ConsultaSchema = z
  .object({
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
  })
  .refine(
    (data) =>
      !data.precisaAcompanhante ||
      (data.nomeAcompanhante && data.nomeAcompanhante.length > 0),
    {
      message: "O nome do acompanhante é obrigatório quando precisa de acompanhante",
      path: ["nomeAcompanhante"],
    }
  )
  .refine(
    (data) =>
      !data.consultaRemota ||
      (data.linkConsultaRemota && data.linkConsultaRemota.length > 0),
    {
      message: "O link é obrigatório para consultas remotas",
      path: ["linkConsultaRemota"],
    }
  );

// Esquema Zod para o formulário de novo paciente
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

// Horários e durações predefinidos
const predefinedTimes = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const predefinedDurations = [15, 30, 45, 60, 90, 120];

// Profissionais por especialidade
const predefinedProfessionals = {
  Medicina: ["Dr. Carlos Silva", "Dra. Ana Souza", "Dr. Ricardo Freitas"],
  Psicologia: ["Psi. Márcia Oliveira", "Psi. Thiago Mendes", "Psi. Júlia Costa"],
  "Educação Física": ["Prof. Paulo Martins", "Profa. Camila Santos", "Prof. Gustavo Lima"],
  Nutrição: ["Nut. Fernanda Pereira", "Nut. Daniel Almeida", "Nut. Roberta Dias"],
  Enfermagem: ["Enf. Maria Oliveira", "Enf. João Santos", "Enf. Clara Mendes"],
};

// Tipos de consulta por especialidade
const consultTypesBySpecialty = {
  Medicina: ["PrimeiraConsulta", "RetornoRegular", "Emergencia", "ControleGlicemico"],
  Psicologia: ["PrimeiraConsulta", "RetornoRegular", "Psicologica"],
  "Educação Física": ["PrimeiraConsulta", "RetornoRegular"],
  Nutrição: ["PrimeiraConsulta", "RetornoRegular", "Nutricional"],
  Enfermagem: ["PrimeiraConsulta", "RetornoRegular"],
};

// Componente de cabeçalho personalizado para o calendário
const CustomHeader = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
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

// Componente para seleção de paciente
const PatientSelector = ({ form }: { form: UseFormReturn<ConsultaFormValues> }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  // Busca pacientes da API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/patients");
        if (!response.ok) throw new Error("Falha ao buscar pacientes");
        const data = await response.json();
        setPatients(data);
        setFilteredPatients([]);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filtra pacientes com base no termo de busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients([]);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.cpf.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Seleciona um paciente
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id.toString());
    setIsOpen(false);
    setSearchTerm("");
  };

  // Limpa a seleção de paciente
  const clearSelection = () => {
    setSelectedPatient(null);
    form.setValue("patientId", "");
  };

  return (
    <FormField
      control={form.control}
      name="patientId"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel className="text-base font-medium text-gray-700">Paciente</FormLabel>
          <div className="relative w-full">
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-teal-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{selectedPatient.nome}</span>
                    <span className="text-sm text-gray-500">CPF: {selectedPatient.cpf}</span>
                  </div>
                </div>
                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="text-teal-600 hover:text-teal-800 mr-1"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-between items-center text-left p-3 h-auto border-gray-300 hover:border-teal-500 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <span className="text-gray-500">Selecionar paciente</span>
                <Search className="h-4 w-4 text-gray-500" />
              </Button>
            )}

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 flex flex-col">
                <div className="sticky top-0 z-10 p-3 border-b bg-white rounded-t-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Digite nome ou CPF para buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-y-auto flex-grow">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-6">
                      <div className="text-gray-500">Carregando pacientes...</div>
                    </div>
                  ) : searchTerm.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="text-gray-500 mb-2">Digite para buscar pacientes</div>
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="text-gray-500 mb-2">Nenhum paciente encontrado</div>
                    </div>
                  ) : (
                    <ul className="py-1">
                      {filteredPatients.map((patient) => (
                        <li key={patient.id}>
                          <button
                            type="button"
                            className={cn(
                              "w-full text-left px-4 py-3 hover:bg-teal-50 flex items-center justify-between",
                              field.value === patient.id.toString() && "bg-teal-50"
                            )}
                            onClick={() => handleSelectPatient(patient)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{patient.nome}</span>
                                <span className="text-xs text-gray-500">CPF: {patient.cpf}</span>
                              </div>
                            </div>
                            {field.value === patient.id.toString() && (
                              <Check className="h-4 w-4 text-teal-600" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="sticky bottom-0 p-3 border-t bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-600"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false);
                        setShowNewPatientForm(true);
                      }}
                      className="text-teal-600 border-teal-600 hover:bg-teal-50"
                    >
                      Cadastrar novo paciente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Componente para cadastro de novo paciente
const NewPatientForm = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: (patient: Patient) => void;
  onCancel: () => void;
}) => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      cpf: "",
      nome: "",
      email: "",
    },
  });

  // Função para enviar dados do novo paciente
  const onSubmit = async (data: PatientFormValues) => {
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.nome,
          cpf: data.cpf.replace(/\D/g, ""),
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar paciente");
      }

      const newPatient = await response.json();
      form.reset();
      onSuccess(newPatient);
      toast.success("Paciente criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar paciente:", error);
      toast.error(`Erro ao criar paciente: ${error?.message || "Tente novamente"}`);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50 mt-4">
      <h3 className="text-md font-medium text-teal-700">Cadastrar Novo Paciente</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Paciente</FormLabel>
                  <FormControl>
                    <InputMask
                      mask="999.999.999-99"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {(inputProps: InputMaskProps) => (
                        <Input
                          placeholder="000.000.000-00"
                          className="border-gray-300"
                          {...inputProps}
                        />
                      )}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Paciente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome completo"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Paciente</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemplo@email.com"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Salvar Paciente
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Componente principal do formulário de consulta
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

  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para enviar o formulário
  const onSubmit = async (data: ConsultaFormValues) => {
    try {
      setIsSubmitting(true);

      if (!selectedSpecialty) {
        toast.error("Selecione uma especialidade");
        return;
      }

      if (!data.dataConsulta || !data.horaConsulta) {
        toast.error("Data e hora da consulta são obrigatórias");
        return;
      }

      const consultaData = {
        ...data,
        especialidade: selectedSpecialty,
      };

      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultaData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Falha ao criar consulta");
      }

      setShowSuccessDialog(true);
      setShowSpecialtyForm(true);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      toast.error(
        `Erro ao agendar consulta: ${
          error instanceof Error ? error.message : "Tente novamente"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSpecialtyForm = () => {
    switch (selectedSpecialty) {
      case "Medicina":
        return <FormularioMedicina />;
      case "Psicologia":
        return <FormularioPsicologia />;
      case "Educação Física":
        return <FormularioEducacaoFisica  />;
      case "Nutrição":
        return <FormularioNutricao />;
      case "Enfermagem":
        return <FormularioEnfermagem  />;
      default:
        return null;
    }
  };

  // Redireciona após sucesso
  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        router.push("/agendamentos");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog, router]);

  // Callback para sucesso no cadastro de paciente
  const handleNewPatientSuccess = (patient: Patient) => {
    form.setValue("patientId", patient.id.toString());
    setShowNewPatientForm(false);
  };

  return (
    <>
      <Card className="max-w-5xl mx-auto my-8 shadow-md rounded-lg border border-gray-100">
        <CardHeader className="bg-teal-50 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-teal-100"
            >
              <ArrowLeft className="h-5 w-5 text-teal-800" />
            </Button>
            <CardTitle className="text-xl font-semibold text-teal-800">
              Cadastro de Consulta
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!showSpecialtyForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Dados do Paciente</h2>
                  <Separator className="bg-teal-200" />
                  <PatientSelector form={form} />

                  {showNewPatientForm && (
                    <NewPatientForm
                      onSuccess={handleNewPatientSuccess}
                      onCancel={() => setShowNewPatientForm(false)}
                    />
                  )}
                </section>

                <div className="mb-6">
                  <h2 className="text-lg font-medium text-teal-700 mb-4">
                    Selecione a Especialidade*
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { id: "Medicina", label: "Medicina", icon: Stethoscope },
                      { id: "Psicologia", label: "Psicologia", icon: Brain },
                      { id: "Educação Física", label: "Educação Física", icon: Dumbbell },
                      { id: "Nutrição", label: "Nutrição", icon: Apple },
                      { id: "Enfermagem", label: "Enfermagem", icon: Stethoscope },
                    ].map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        variant={selectedSpecialty === item.id ? "default" : "outline"}
                        className={cn(
                          "w-full p-4 h-auto flex flex-col gap-2",
                          selectedSpecialty === item.id
                            ? "bg-teal-600 text-white"
                            : "border-teal-200 hover:border-teal-500"
                        )}
                        onClick={() => {
                          setSelectedSpecialty(item.id as Specialty);
                          form.setValue("especialidade", item.id);
                        }}
                      >
                        <item.icon className="h-6 w-6" />
                        <span>{item.label}</span>
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.especialidade && (
                    <p className="text-sm text-red-500 mt-2">
                      {form.formState.errors.especialidade.message}
                    </p>
                  )}
                </div>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Dados da Consulta</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Consulta</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal border-gray-300",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(parseISO(field.value), "dd/MM/yyyy", {
                                        locale: ptBR,
                                      })
                                    : <span>Escolha uma data</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? parseISO(field.value) : undefined}
                                  onSelect={(date) =>
                                    field.onChange(date ? getLocalDateString(date) : "")
                                  }
                                  components={{
                                    Caption: CustomHeader,
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="horaConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário da Consulta</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um horário">
                                  {field.value ? (
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {field.value}
                                    </div>
                                  ) : (
                                    "Selecione um horário"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {predefinedTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {time}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duracaoConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração da Consulta (minutos)</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {predefinedDurations.map((duration) => (
                              <Button
                                key={duration}
                                type="button"
                                variant={field.value === duration ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "h-8",
                                  field.value === duration &&
                                    "bg-teal-600 hover:bg-teal-700"
                                )}
                                onClick={() => field.onChange(duration)}
                              >
                                {duration} min
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipoConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Consulta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedSpecialty &&
                                consultTypesBySpecialty[selectedSpecialty]?.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type === "PrimeiraConsulta"
                                      ? "Primeira Consulta"
                                      : type === "RetornoRegular"
                                      ? "Retorno Regular"
                                      : type === "Emergencia"
                                      ? "Emergência"
                                      : type === "Nutricional"
                                      ? "Nutricional"
                                      : type === "Psicologica"
                                      ? "Psicológica"
                                      : "Controle Glicêmico"}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profissional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissional</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um profissional" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedSpecialty &&
                                predefinedProfessionals[selectedSpecialty]?.map((prof) => (
                                  <SelectItem key={prof} value={prof}>
                                    {prof}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Motivo e Observações</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="motivoConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo da Consulta</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o motivo da consulta"
                              className="border-gray-300 resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sintomasRelatados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sintomas Relatados</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva os sintomas (opcional)"
                              className="border-gray-300 resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Status e Prioridade</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="statusConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status da Consulta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um status">
                                  {field.value && (
                                    <Badge
                                      className={cn(
                                        "mr-2",
                                        field.value === "Agendada" && "bg-blue-100 text-blue-800",
                                        field.value === "Confirmada" &&
                                          "bg-green-100 text-green-800",
                                        field.value === "EmAndamento" &&
                                          "bg-yellow-100 text-yellow-800",
                                        field.value === "Concluida" &&
                                          "bg-teal-100 text-teal-800",
                                        field.value === "Cancelada" && "bg-red-100 text-red-800",
                                        field.value === "Remarcada" &&
                                          "bg-purple-100 text-purple-800"
                                      )}
                                    >
                                      {field.value === "EmAndamento"
                                        ? "Em Andamento"
                                        : field.value}
                                    </Badge>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Agendada">
                                <Badge className="bg-blue-100 text-blue-800 mr-2">
                                  Agendada
                                </Badge>
                              </SelectItem>
                              <SelectItem value="Confirmada">
                                <Badge className="bg-green-100 text-green-800 mr-2">
                                  Confirmada
                                </Badge>
                              </SelectItem>
                              <SelectItem value="EmAndamento">
                                <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                                  Em Andamento
                                </Badge>
                              </SelectItem>
                              <SelectItem value="Concluida">
                                <Badge className="bg-teal-100 text-teal-800 mr-2">
                                  Concluída
                                </Badge>
                              </SelectItem>
                              <SelectItem value="Cancelada">
                                <Badge className="bg-red-100 text-red-800 mr-2">
                                  Cancelada
                                </Badge>
                              </SelectItem>
                              <SelectItem value="Remarcada">
                                <Badge className="bg-purple-100 text-purple-800 mr-2">
                                  Remarcada
                                </Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prioridade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prioridade</FormLabel>
                          <div className="flex gap-2">
                            {["Baixa", "Media", "Alta", "Urgente"].map((prioridade) => (
                              <Button
                                key={prioridade}
                                type="button"
                                variant={field.value === prioridade ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "flex-1",
                                  field.value === prioridade &&
                                    (prioridade === "Baixa"
                                      ? "bg-green-600 hover:bg-green-700"
                                      : prioridade === "Media"
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : prioridade === "Alta"
                                      ? "bg-orange-600 hover:bg-orange-700"
                                      : "bg-red-600 hover:bg-red-700")
                                )}
                                onClick={() => field.onChange(prioridade)}
                              >
                                {prioridade === "Media" ? "Média" : prioridade}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Controle de Diabetes</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ultimaGlicemia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Glicemia (mg/dL)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 120"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ultimaHemoglobina"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Hemoglobina Glicada (%)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 7.2"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">
                    Informações Complementares
                  </h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="medicamentos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicamentos em Uso</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Liste os medicamentos em uso (opcional)"
                              className="border-gray-300 resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alergias"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alergias</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Liste as alergias conhecidas (opcional)"
                              className="border-gray-300 resize-none min-h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Acompanhamento</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="precisaAcompanhante"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Precisa de acompanhante
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4",
                        form.watch("precisaAcompanhante")
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0 overflow-hidden"
                      )}
                    >
                      {form.watch("precisaAcompanhante") && (
                        <>
                          <FormField
                            control={form.control}
                            name="nomeAcompanhante"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Acompanhante</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Digite o nome"
                                    className="border-gray-300"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="telefoneAcompanhante"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone do Acompanhante</FormLabel>
                                <FormControl>
                                  <InputMask
                                    mask="(99) 99999-9999"
                                    value={field.value}
                                    onChange={field.onChange}
                                  >
                                    {(inputProps: InputMaskProps) => (
                                      <Input
                                        placeholder="(00) 00000-0000"
                                        className="border-gray-300"
                                        {...inputProps}
                                      />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Logística</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaAtendimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sala de Atendimento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite a sala (opcional)"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultaRemota"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Consulta remota
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out",
                        form.watch("consultaRemota")
                          ? "max-h-40 opacity-100 md:col-span-2"
                          : "max-h-0 opacity-0 overflow-hidden"
                      )}
                    >
                      {form.watch("consultaRemota") && (
                        <FormField
                          control={form.control}
                          name="linkConsultaRemota"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link da Consulta</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Cole o link da videochamada"
                                  className="border-gray-300"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Notificações</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enviarLembreteEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Enviar lembrete por email
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="enviarLembreteSMS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium cursor-pointer">
                            Enviar lembrete por SMS
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-medium text-teal-700">Observações Adicionais</h2>
                  <Separator className="bg-teal-200" />
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observações adicionais sobre a consulta"
                              className="border-gray-300 resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Agendando..." : "Agendar Consulta"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowSpecialtyForm(false)}
                  className="text-teal-600 hover:bg-teal-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para formulário principal
                </Button>
              </div>
              {renderSpecialtyForm()}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-teal-600 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Consulta Agendada com Sucesso!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você será redirecionado para a página de agendamentos em instantes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              A consulta foi agendada com sucesso e os lembretes serão enviados conforme configurado.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 w-full"
              onClick={() => router.push("/agendamentos")}
            >
              Ir para Agendamentos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsultaForm;