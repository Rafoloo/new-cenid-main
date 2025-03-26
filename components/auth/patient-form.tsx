"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputMask from "react-input-mask";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema ajustado para corrigir o erro com .min() e .regex()/.email()
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
  municipio: z.string().min(1, "O município deve ser informado"),
  numero: z.string().min(1, "O número do endereço deve ser preenchido"),
  tipoAtendimento: z.string().min(1, "O tipo de atendimento deve ser especificado"),
  diagnostico: z.string().min(1, "O diagnóstico deve ser informado"),
  outrasFormasDm: z.string().min(1, "As outras formas de DM devem ser especificadas"),
  dataDiagnostico: z.string().min(1, "A data do diagnóstico deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data do diagnóstico deve ser válida"),
  gestante: z.boolean(),
  semanasGestacao: z.number().optional().refine((val) => !val || val > 0, {
    message: "O número de semanas de gestação deve ser maior que 0",
  }),
  amamentando: z.boolean(),
  tempoPosParto: z.string().min(1, "O tempo pós-parto deve ser informado"),
  deficiencia: z.boolean(),
  tipoDeficiencia: z.string().optional(),
  historicoDm1: z.boolean(),
  parentescoDm1: z.string().optional(),
  historicoDm2: z.boolean(),
  parentescoDm2: z.string().optional(),
  historicoOutrasFormasDm: z.boolean(),
  parentescoOutrasFormasDm: z.string().optional(),
  metodoInsulina: z.string().min(1, "O método de aplicação de insulina deve ser especificado"),
  marcaModeloBomba: z.string().min(1, "A marca e modelo da bomba devem ser informados"),
  metodoMonitoramentoGlicemia: z.string().min(1, "O método de monitoramento da glicemia deve ser especificado"),
  marcaModeloGlicometroSensor: z.string().min(1, "A marca e modelo do glicômetro ou sensor devem ser informados"),
  usoAppGlicemia: z.string().min(1, "O uso de aplicativo de glicemia deve ser especificado"),
  outrosApps: z.string().min(1, "Os outros aplicativos utilizados devem ser informados"),
  nomeResponsavel: z.string().min(1, "O nome do responsável deve ser preenchido"),
  cpfResponsavel: z.string().min(1, "O CPF do responsável deve ser preenchido").regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "O CPF do responsável deve estar no formato 000.000.000-00"),
  rgResponsavel: z.string().min(7, "O RG do responsável deve ter entre 7 e 14 dígitos").max(14, "O RG do responsável deve ter entre 7 e 14 dígitos"),
  parentescoResponsavel: z.string().min(1, "O parentesco do responsável deve ser informado"),
  telefoneResponsavel: z.string().min(1, "O telefone do responsável deve ser preenchido").regex(/\(\d{2}\) \d{4,5}-\d{4}/, "O telefone do responsável deve estar no formato (00) 00000-0000"),
  ocupacaoResponsavel: z.string().min(1, "A ocupação do responsável deve ser informada"),
  dataNascimentoResponsavel: z.string().min(1, "A data de nascimento do responsável deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data de nascimento do responsável deve ser válida"),
  anexar: z.any(),
  auxilio: z.string().min(1, "O tipo de auxílio deve ser especificado"),
  outrosAuxilios: z.string().min(1, "Os outros auxílios devem ser informados"),
  possuiCelularComAcessoInternet: z.boolean(),
  dateCadastro: z.string().min(1, "A data de cadastro deve ser selecionada").refine((date) => !isNaN(Date.parse(date)), "A data de cadastro deve ser válida"),
})
.refine(
  (data) => !data.deficiencia || (data.tipoDeficiencia && data.tipoDeficiencia !== ""),
  {
    message: "O tipo de deficiência deve ser especificado quando há deficiência",
    path: ["tipoDeficiencia"],
  }
)
.refine(
  (data) => !data.historicoDm1 || (data.parentescoDm1 && data.parentescoDm1 !== ""),
  {
    message: "O parentesco deve ser informado quando há histórico de DM1",
    path: ["parentescoDm1"],
  }
)
.refine(
  (data) => !data.historicoDm2 || (data.parentescoDm2 && data.parentescoDm2 !== ""),
  {
    message: "O parentesco deve ser informado quando há histórico de DM2",
    path: ["parentescoDm2"],
  }
)
.refine(
  (data) => !data.historicoOutrasFormasDm || (data.parentescoOutrasFormasDm && data.parentescoOutrasFormasDm !== ""),
  {
    message: "O parentesco deve ser informado quando há histórico de outras formas de DM",
    path: ["parentescoOutrasFormasDm"],
  }
);

type PatientFormValues = z.infer<typeof PatientSchema>;

const PatientForm = () => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      gestante: false,
      amamentando: false,
      deficiencia: false,
      historicoDm1: false,
      parentescoDm1: "",
      historicoDm2: false,
      parentescoDm2: "",
      historicoOutrasFormasDm: false,
      parentescoOutrasFormasDm: "",
      possuiCelularComAcessoInternet: false,
      semanasGestacao: undefined,
      tipoDeficiencia: "",
    },
  });

  const onSubmit = (data: PatientFormValues) => {
    console.log(data);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="bg-teal-50">
        <CardTitle className="text-2xl font-bold text-teal-800">Cadastro de Paciente</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Dados Pessoais</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">CPF</FormLabel>
                    <FormControl>
                      <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                        {(inputProps) => <Input placeholder="000.000.000-00" className="border-teal-300 focus:ring-teal-500" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cartaoSus" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Cartão SUS</FormLabel>
                    <FormControl>
                      <Input maxLength={15} placeholder="15 dígitos" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rg" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">RG</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o RG" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Telefone</FormLabel>
                    <FormControl>
                      <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                        {(inputProps) => <Input placeholder="(00) 00000-0000" className="border-teal-300 focus:ring-teal-500" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Data de Nascimento</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-teal-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemplo@email.com" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ocupacao" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Ocupação</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a ocupação" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
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
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Endereço</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="endereco" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-teal-800">Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Avenida, etc." className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="numero" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="municipio" render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel className="text-teal-800">Município</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o município" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Dados Clínicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Dados Clínicos</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="tipoAtendimento" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Tipo de Atendimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tipo" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="diagnostico" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Diagnóstico</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o diagnóstico" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="outrasFormasDm" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Outras Formas DM</FormLabel>
                    <FormControl>
                      <Input placeholder="Especifique" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataDiagnostico" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Data do Diagnóstico</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-teal-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Gestação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Gestação</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="gestante" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Gestante</FormLabel>
                  </FormItem>
                )} />
                {form.watch("gestante") && (
                  <FormField control={form.control} name="semanasGestacao" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Semanas de Gestação</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Digite o número de semanas" className="border-teal-300 focus:ring-teal-500" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                <FormField control={form.control} name="amamentando" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Amamentando</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="tempoPosParto" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Tempo Pós-Parto</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tempo" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Deficiência */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Deficiência</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="deficiencia" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Possui Deficiência</FormLabel>
                  </FormItem>
                )} />
                {form.watch("deficiencia") && (
                  <FormField control={form.control} name="tipoDeficiencia" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Tipo de Deficiência</FormLabel>
                      <FormControl>
                        <Input placeholder="Especifique" className="border-teal-300 focus:ring-teal-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
            </div>

            {/* Histórico Familiar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Histórico Familiar</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="historicoDm1" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Histórico DM1</FormLabel>
                  </FormItem>
                )} />
                {form.watch("historicoDm1") && (
                  <FormField control={form.control} name="parentescoDm1" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Parentesco DM1</FormLabel>
                      <FormControl>
                        <Input placeholder="Especifique o parentesco" className="border-teal-300 focus:ring-teal-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                <FormField control={form.control} name="historicoDm2" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Histórico DM2</FormLabel>
                  </FormItem>
                )} />
                {form.watch("historicoDm2") && (
                  <FormField control={form.control} name="parentescoDm2" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Parentesco DM2</FormLabel>
                      <FormControl>
                        <Input placeholder="Especifique o parentesco" className="border-teal-300 focus:ring-teal-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                <FormField control={form.control} name="historicoOutrasFormasDm" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Histórico Outras Formas DM</FormLabel>
                  </FormItem>
                )} />
                {form.watch("historicoOutrasFormasDm") && (
                  <FormField control={form.control} name="parentescoOutrasFormasDm" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Parentesco Outras Formas DM</FormLabel>
                      <FormControl>
                        <Input placeholder="Especifique o parentesco" className="border-teal-300 focus:ring-teal-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
            </div>

            {/* Tratamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Tratamento</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="metodoInsulina" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Método de Insulina</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o método" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="marcaModeloBomba" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Marca/Modelo da Bomba</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a marca/modelo" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="metodoMonitoramentoGlicemia" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Método de Monitoramento da Glicemia</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o método" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="marcaModeloGlicometroSensor" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Marca/Modelo do Glicômetro/Sensor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a marca/modelo" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="usoAppGlicemia" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Uso de App de Glicemia</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o app" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="outrosApps" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Outros Apps</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite outros apps" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Dados do Responsável */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Dados do Responsável</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="nomeResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpfResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">CPF do Responsável</FormLabel>
                    <FormControl>
                      <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange}>
                        {(inputProps) => <Input placeholder="000.000.000-00" className="border-teal-300 focus:ring-teal-500" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rgResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">RG do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o RG" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="parentescoResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Parentesco</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o parentesco" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telefoneResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Telefone do Responsável</FormLabel>
                    <FormControl>
                      <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                        {(inputProps) => <Input placeholder="(00) 00000-0000" className="border-teal-300 focus:ring-teal-500" {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ocupacaoResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Ocupação do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a ocupação" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dataNascimentoResponsavel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Data de Nascimento do Responsável</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-teal-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Outras Informações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700">Outras Informações</h3>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="anexar" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Anexar Documentos</FormLabel>
                    <FormControl>
                      <Input type="file" className="border-teal-300 focus:ring-teal-500" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="auxilio" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Auxílio</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o auxílio" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="outrosAuxilios" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Outros Auxílios</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite outros auxílios" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="possuiCelularComAcessoInternet" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-teal-800">Possui Celular com Acesso à Internet</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="dateCadastro" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Data de Cadastro</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-teal-300", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                            {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;