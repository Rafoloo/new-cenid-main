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
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaptionProps, useNavigation } from "react-day-picker";

// Função para obter a data local como string no formato "yyyy-MM-dd"
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Componente personalizado para o cabeçalho do calendário
const CustomHeader = (props: CaptionProps) => {
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

const PatientSchema = z.object({
  nome: z.string().min(1, "O nome completo deve ser preenchido"),
  cpf: z.string().min(1, "O CPF deve ser preenchido").regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "O CPF deve estar no formato 000.000.000-00"),
  cartaoSus: z.string().min(1, "O cartão do SUS deve ser preenchido").length(15, "O cartão do SUS deve ter exatamente 15 dígitos"),
  rg: z.string().min(7, "O RG deve ter entre 7 e 14 dígitos").max(14, "O RG deve ter entre 7 e 14 dígitos"),
  telefone: z.string().min(1, "O telefone deve ser preenchido").regex(/\(\d{2}\) \d{4,5}-\d{4}/, "O telefone deve estar no formato (00) 00000-0000"),
  dataNascimento: z.string().min(1, "A data de nascimento deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data de nascimento deve ser válida"),
  email: z.string().min(1, "O e-mail deve ser preenchido").email("O e-mail deve estar em um formato válido (exemplo@dominio.com)"),
  ocupacao: z.string().min(1, "A ocupação deve ser informada"),
  sexo: z.enum(["Masculino", "Feminino", "Outro"]),
  endereco: z.string().min(1, "O endereço completo deve ser preenchido"),
  numero: z.string().min(1, "O número do endereço deve ser preenchido"),
  municipio: z.string().min(1, "O município deve ser informado"),
  tipoAtendimento: z.string().min(1, "O tipo de atendimento deve ser especificado"),
  diagnostico: z.string().min(1, "O diagnóstico deve ser informado"),
  outrasFormasDm: z.string().min(1, "As outras formas de DM devem ser especificadas"),
  dataDiagnostico: z.string().min(1, "A data do diagnóstico deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data do diagnóstico deve ser válida"),
  metodoInsulina: z.string().min(1, "O método de aplicação de insulina deve ser especificado"),
  marcaModeloBomba: z.string().min(1, "A marca e modelo da bomba devem ser informados"),
  metodoMonitoramentoGlicemia: z.string().min(1, "O método de monitoramento da glicemia deve ser especificado"),
  marcaModeloGlicometroSensor: z.string().min(1, "A marca e modelo do glicômetro ou sensor devem be informados"),
  usoAppGlicemia: z.string().min(1, "O uso de aplicativo de glicemia deve ser especificado"),
  outrosApps: z.string().min(1, "Os outros aplicativos utilizados devem ser informados"),
  nomeResponsavel: z.string().min(1, "O nome do responsável deve ser preenchido"),
  cpfResponsavel: z.string().min(1, "O CPF do responsável deve ser preenchido").regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "O CPF do responsável deve estar no formato 000.000.000-00"),
  rgResponsavel: z.string().min(7, "O RG do responsável deve ter entre 7 e 14 dígitos").max(14, "O RG do responsável deve ter entre 7 e 14 dígitos"),
  parentescoResponsavel: z.string().min(1, "O parentesco do responsável deve ser informado"),
  telefoneResponsavel: z.string().min(1, "O telefone do responsável deve ser preenchido").regex(/\(\d{2}\) \d{4,5}-\d{4}/, "O telefone do responsável deve estar no formato (00) 00000-0000"),
  ocupacaoResponsavel: z.string().min(1, "A ocupação do responsável deve ser informada"),
  dataNascimentoResponsavel: z.string().min(1, "A data de nascimento do responsável deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data de nascimento do responsável deve ser válida"),
  auxilio: z.string().min(1, "O tipo de auxílio deve ser especificado"),
  outrosAuxilios: z.string().min(1, "Os outros auxílios devem ser informados"),
  dateCadastro: z.string().min(1, "A data de cadastro deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data de cadastro deve ser válida"),
  gestante: z.boolean(),
  amamentando: z.boolean(),
  deficiencia: z.boolean(),
  historicoDm1: z.boolean(),
  historicoDm2: z.boolean(),
  historicoOutrasFormasDm: z.boolean(),
  possuiCelularComAcessoInternet: z.boolean(),
  semanasGestacao: z.number().min(1, "O número de semanas de gestação deve ser maior que 0").optional(),
  tempoPosParto: z.string().optional(),
  tipoDeficiencia: z.string().optional(),
  parentescoDm1: z.string().optional(),
  parentescoDm2: z.string().optional(),
  parentescoOutrasFormasDm: z.string().optional(),
  anexar: z.any().optional(),
}).refine(
  (data) => !data.gestante || (data.semanasGestacao !== undefined && data.semanasGestacao > 0),
  { message: "O número de semanas de gestação deve ser informado e maior que 0 se gestante", path: ["semanasGestacao"] }
).refine(
  (data) => !data.deficiencia || (data.tipoDeficiencia && data.tipoDeficiencia !== ""),
  { message: "O tipo de deficiência deve ser especificado quando há deficiência", path: ["tipoDeficiencia"] }
).refine(
  (data) => !data.historicoDm1 || (data.parentescoDm1 && data.parentescoDm1 !== ""),
  { message: "O parentesco deve ser informado quando há histórico de DM1", path: ["parentescoDm1"] }
).refine(
  (data) => !data.historicoDm2 || (data.parentescoDm2 && data.parentescoDm2 !== ""),
  { message: "O parentesco deve ser informado quando há histórico de DM2", path: ["parentescoDm2"] }
).refine(
  (data) => !data.historicoOutrasFormasDm || (data.parentescoOutrasFormasDm && data.parentescoOutrasFormasDm !== ""),
  { message: "O parentesco deve ser informado quando há histórico de outras formas de DM", path: ["parentescoOutrasFormasDm"] }
);

type PatientFormValues = z.infer<typeof PatientSchema>;

interface InputMaskProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientForm = () => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      cartaoSus: "",
      rg: "",
      telefone: "",
      dataNascimento: "",
      email: "",
      ocupacao: "",
      sexo: undefined,
      endereco: "",
      municipio: "",
      numero: "",
      tipoAtendimento: "",
      diagnostico: "",
      outrasFormasDm: "",
      dataDiagnostico: "",
      gestante: false,
      semanasGestacao: undefined,
      amamentando: false,
      tempoPosParto: "",
      deficiencia: false,
      tipoDeficiencia: "",
      historicoDm1: false,
      parentescoDm1: "",
      historicoDm2: false,
      parentescoDm2: "",
      historicoOutrasFormasDm: false,
      parentescoOutrasFormasDm: "",
      metodoInsulina: "",
      marcaModeloBomba: "",
      metodoMonitoramentoGlicemia: "",
      marcaModeloGlicometroSensor: "",
      usoAppGlicemia: "",
      outrosApps: "",
      nomeResponsavel: "",
      cpfResponsavel: "",
      rgResponsavel: "",
      parentescoResponsavel: "",
      telefoneResponsavel: "",
      ocupacaoResponsavel: "",
      dataNascimentoResponsavel: "",
      anexar: undefined,
      auxilio: "",
      outrosAuxilios: "",
      possuiCelularComAcessoInternet: false,
      dateCadastro: "",
    },
  });

  const onSubmit = (data: PatientFormValues) => {
    console.log(data);
  };

  return (
    <Card className="max-w-5xl mx-auto my-8 shadow-md rounded-lg border border-gray-100">
      <CardHeader className="bg-teal-100 p-4">
        <CardTitle className="text-2xl font-semibold text-teal-800">Cadastro de Paciente</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados Pessoais</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                        {(inputProps: InputMaskProps) => <Input placeholder="000.000.000-00" className="border-gray-300" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cartaoSus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cartão SUS</FormLabel>
                    <FormControl>
                      <Input maxLength={15} placeholder="15 dígitos" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rg" render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o RG" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                        {(inputProps: InputMaskProps) => <Input placeholder="(00) 00000-0000" className="border-gray-300" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemplo@email.com" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-gray-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(parseISO(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date: Date | undefined) => field.onChange(date ? getLocalDateString(date) : "")}
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
                )} />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ocupacao" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ocupação</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a ocupação" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Endereço */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Endereço</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="endereco" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Avenida, etc." className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="numero" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="municipio" render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Município</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o município" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Dados Clínicos */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados Clínicos</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="tipoAtendimento" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Atendimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tipo" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="diagnostico" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnóstico</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o diagnóstico" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataDiagnostico" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Diagnóstico</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-gray-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(parseISO(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date: Date | undefined) => field.onChange(date ? getLocalDateString(date) : "")}
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
                )} />
                <FormField control={form.control} name="outrasFormasDm" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outras Formas de DM</FormLabel>
                    <FormControl>
                      <Input placeholder="Especifique" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Condições Especiais */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Condições Especiais</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="gestante" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Gestante</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("gestante") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("gestante") && (
                    <FormField control={form.control} name="semanasGestacao" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semanas de Gestação</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Digite o número"
                            className="border-gray-300"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
                <FormField control={form.control} name="amamentando" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Amamentando</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("amamentando") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("amamentando") && (
                    <FormField control={form.control} name="tempoPosParto" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo Pós-Parto</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o tempo" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
                <FormField control={form.control} name="deficiencia" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Possui Deficiência</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("deficiencia") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("deficiencia") && (
                    <FormField control={form.control} name="tipoDeficiencia" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Deficiência</FormLabel>
                        <FormControl>
                          <Input placeholder="Especifique" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              </div>
            </section>

            {/* Histórico Familiar */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Histórico Familiar</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="historicoDm1" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Histórico DM1</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("historicoDm1") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("historicoDm1") && (
                    <FormField control={form.control} name="parentescoDm1" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco DM1</FormLabel>
                        <FormControl>
                          <Input placeholder="Especifique" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
                <FormField control={form.control} name="historicoDm2" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Histórico DM2</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("historicoDm2") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("historicoDm2") && (
                    <FormField control={form.control} name="parentescoDm2" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco DM2</FormLabel>
                        <FormControl>
                          <Input placeholder="Especifique" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
                <FormField control={form.control} name="historicoOutrasFormasDm" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Outras Formas de DM</FormLabel>
                  </FormItem>
                )} />
                <div className={cn("transition-all duration-300 ease-in-out", form.watch("historicoOutrasFormasDm") ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
                  {form.watch("historicoOutrasFormasDm") && (
                    <FormField control={form.control} name="parentescoOutrasFormasDm" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco</FormLabel>
                        <FormControl>
                          <Input placeholder="Especifique" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              </div>
            </section>

            {/* Tratamento */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Tratamento</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="metodoInsulina" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Insulina</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o método" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="marcaModeloBomba" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca/Modelo da Bomba</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a marca/modelo" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="metodoMonitoramentoGlicemia" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Monitoramento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o método" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="marcaModeloGlicometroSensor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca/Modelo do Glicômetro</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a marca/modelo" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="usoAppGlicemia" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uso de App de Glicemia</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o app" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="outrosApps" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outros Apps</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite outros apps" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Dados do Responsável */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados do Responsável</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nomeResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpfResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF do Responsável</FormLabel>
                    <FormControl>
                      <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                        {(inputProps: InputMaskProps) => <Input placeholder="000.000.000-00" className="border-gray-300" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rgResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o RG" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="parentescoResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parentesco</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o parentesco" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefoneResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Responsável</FormLabel>
                    <FormControl>
                      <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                        {(inputProps: InputMaskProps) => <Input placeholder="(00) 00000-0000" className="border-gray-300" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataNascimentoResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-gray-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(parseISO(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date: Date | undefined) => field.onChange(date ? getLocalDateString(date) : "")}
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
                )} />
                <FormField control={form.control} name="ocupacaoResponsavel" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ocupação do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a ocupação" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Outras Informações */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Outras Informações</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="auxilio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auxílio</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o auxílio" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="outrosAuxilios" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outros Auxílios</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite outros auxílios" className="border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="possuiCelularComAcessoInternet" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                       className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                    </FormControl>
                    <FormLabel>Celular com Internet</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="dateCadastro" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Cadastro</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-gray-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(parseISO(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date: Date | undefined) => field.onChange(date ? getLocalDateString(date) : "")}
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
                )} />
                <FormField control={form.control} name="anexar" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Anexar Documentos</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          className="opacity-0 absolute w-full h-full cursor-pointer"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        />
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2">
                          Escolher Arquivo
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </section>

            {/* Botão de Envio */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2">
                Salvar Cadastro
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;