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
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Stethoscope, Brain, ActivitySquare, Apple, ArrowLeft } from "lucide-react";
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

// Função para validar CPF
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
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
      today.setHours(0, 0, 0, 0); // Normaliza para comparação apenas da data
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
    <Card className="max-w-3xl mx-auto my-8 shadow-md rounded-lg border border-gray-100">
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
          <CardTitle className="text-xl font-semibold text-teal-800">Cadastro de Consulta</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados do Paciente</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecionar Paciente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder={isLoadingPatients ? "Carregando..." : "Selecione um paciente"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={String(patient.id)}>
                              {patient.nome} (CPF: {patient.cpf})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsNewPatient(true)}
                        className="mt-2 text-teal-600"
                      >
                        Cadastrar novo paciente
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isNewPatient && (
                <Form {...patientForm}>
                  <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-4 border p-4 rounded-md">
                    <h3 className="text-md font-medium text-teal-700">Cadastrar Novo Paciente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={patientForm.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF do Paciente</FormLabel>
                            <FormControl>
                              <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                                {(inputProps: InputMaskProps) => (
                                  <Input placeholder="000.000.000-00" className="border-gray-300" {...inputProps} />
                                )}
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={patientForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Paciente</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o nome completo" className="border-gray-300" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={patientForm.control}
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsNewPatient(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                        Salvar Paciente
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </section>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-teal-700 mb-4">
                Selecione a Especialidade*
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  type="button"
                  variant={selectedSpecialty === 'Medicina' ? 'default' : 'outline'}
                  className={cn(
                    "w-full p-4 h-auto flex flex-col gap-2",
                    selectedSpecialty === 'Medicina' ? 'bg-teal-600 text-white' : 'border-teal-200'
                  )}
                  onClick={() => handleSpecialtyClick('Medicina')}
                >
                  <Stethoscope className="h-6 w-6" />
                  <span>Medicina</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedSpecialty === 'Psicologia' ? 'default' : 'outline'}
                  className={cn(
                    "w-full p-4 h-auto flex flex-col gap-2",
                    selectedSpecialty === 'Psicologia' ? 'bg-teal-600 text-white' : 'border-teal-200'
                  )}
                  onClick={() => handleSpecialtyClick('Psicologia')}
                >
                  <Brain className="h-6 w-6" />
                  <span>Psicologia</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedSpecialty === 'Educação Física' ? 'default' : 'outline'}
                  className={cn(
                    "w-full p-4 h-auto flex flex-col gap-2",
                    selectedSpecialty === 'Educação Física' ? 'bg-teal-600 text-white' : 'border-teal-200'
                  )}
                  onClick={() => handleSpecialtyClick('Educação Física')}
                >
                  <ActivitySquare className="h-6 w-6" />
                  <span>Educação Física</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedSpecialty === 'Nutrição' ? 'default' : 'outline'}
                  className={cn(
                    "w-full p-4 h-auto flex flex-col gap-2",
                    selectedSpecialty === 'Nutrição' ? 'bg-teal-600 text-white' : 'border-teal-200'
                  )}
                  onClick={() => handleSpecialtyClick('Nutrição')}
                >
                  <Apple className="h-6 w-6" />
                  <span>Nutrição</span>
                </Button>
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
                                ? format(parseISO(field.value), "dd/MM/yyyy", { locale: ptBR })
                                : <span>Escolha uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? parseISO(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? getLocalDateString(date) : "")}
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
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="time"
                            placeholder="00:00"
                            className="border-gray-300"
                            {...field}
                          />
                          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duracaoConsulta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="15"
                          max="240"
                          placeholder="60"
                          className="border-gray-300"
                          value={field.value}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                        />
                      </FormControl>
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
                          <SelectItem value="PrimeiraConsulta">Primeira Consulta</SelectItem>
                          <SelectItem value="RetornoRegular">Retorno Regular</SelectItem>
                          <SelectItem value="Emergencia">Emergência</SelectItem>
                          <SelectItem value="Nutricional">Nutricional</SelectItem>
                          <SelectItem value="Psicologica">Psicológica</SelectItem>
                          <SelectItem value="ControleGlicemico">Controle Glicêmico</SelectItem>
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
                      <FormControl>
                        <Input placeholder="Digite o nome do profissional" className="border-gray-300" {...field} />
                      </FormControl>
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
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Agendada">Agendada</SelectItem>
                          <SelectItem value="Confirmada">Confirmada</SelectItem>
                          <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                          <SelectItem value="Concluida">Concluída</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                          <SelectItem value="Remarcada">Remarcada</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Media">Média</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="Ex: 120" className="border-gray-300" {...field} />
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
                        <Input placeholder="Ex: 7.2" className="border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Informações Complementares</h2>
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
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Precisa de Acompanhante</FormLabel>
                    </FormItem>
                  )}
                />
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4",
                    form.watch("precisaAcompanhante") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
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
                              <Input placeholder="Digite o nome" className="border-gray-300" {...field} />
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
                              <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                                {(inputProps: InputMaskProps) => (
                                  <Input placeholder="(00) 00000-0000" className="border-gray-300" {...inputProps} />
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
                        <Input placeholder="Digite a sala (opcional)" className="border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consultaRemota"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Consulta Remota</FormLabel>
                    </FormItem>
                  )}
                />
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    form.watch("consultaRemota") ? "max-h-40 opacity-100 md:col-span-2" : "max-h-0 opacity-0 overflow-hidden"
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
                            <Input placeholder="Cole o link da videochamada" className="border-gray-300" {...field} />
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
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Enviar Lembrete por E-mail</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enviarLembreteSMS"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Enviar Lembrete por SMS</FormLabel>
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
      </CardContent>
    </Card>
  );
};

export default ConsultaForm;