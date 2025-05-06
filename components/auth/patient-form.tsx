"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO, getYear, getMonth } from "date-fns";
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
import { CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaptionProps, useNavigation } from "react-day-picker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

// Função para obter a data local como string no formato "yyyy-MM-dd"
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Funções de formatação para máscaras
const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
  if (match) {
    const [, p1, p2, p3, p4] = match;
    return `${p1}${p2 ? "." + p2 : ""}${p3 ? "." + p3 : ""}${p4 ? "-" + p4 : ""}`;
  }
  return value;
};

const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  if (match) {
    const [, p1, p2, p3] = match;
    return `${p1 ? "(" + p1 : ""}${p2 ? ") " + p2 : ""}${p3 ? "-" + p3 : ""}`;
  }
  return value;
};

const formatCartaoSus = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 15);
  return cleaned;
};

const formatRG = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 14);
  return cleaned;
};

const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);
  const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
  if (match) {
    const [, p1, p2] = match;
    return `${p1}${p2 ? "-" + p2 : ""}`;
  }
  return value;
};

const CustomHeader = (props: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const { displayMonth } = props;

  const currentYear = getYear(new Date());
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(Number(year));
    goToMonth(newDate);
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(displayMonth.getMonth() + offset);
    goToMonth(newDate);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-teal-50 rounded-t-md border-b border-teal-200">
      <button
        onClick={() => previousMonth && handleMonthChange(-1)}
        className="p-1 rounded-full text-teal-600 hover:bg-teal-100 disabled:opacity-50 disabled:hover:bg-transparent"
        disabled={!previousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-teal-800 capitalize">
          {format(displayMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <Select
          value={getYear(displayMonth).toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm border-teal-300 focus:ring-teal-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-sm">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <button
        onClick={() => nextMonth && handleMonthChange(1)}
        className="p-1 rounded-full text-teal-600 hover:bg-teal-100 disabled:opacity-50 disabled:hover:bg-transparent"
        disabled={!nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// Constantes para as opções padronizadas
const DIAGNOSTICO_OPTIONS = [
  { value: "DM1", label: "Diabetes Mellitus Tipo 1 (DM1)" },
  { value: "DM2", label: "Diabetes Mellitus Tipo 2 (DM2)" },
  { value: "LADA", label: "Diabetes Autoimune Latente do Adulto (LADA)" },
  { value: "MODY", label: "Maturity Onset Diabetes of the Young (MODY)" },
  { value: "GESTACIONAL", label: "Diabetes Gestacional" },
  { value: "OUTRO", label: "Outro" },
];

const METODO_INSULINA_OPTIONS = [
  { value: "CANETA", label: "Caneta de Insulina" },
  { value: "SERINGA", label: "Seringa" },
  { value: "BOMBA", label: "Bomba de Insulina" },
  { value: "NAO_USA", label: "Não Utiliza Insulina" },
];

const METODO_MONITORAMENTO_OPTIONS = [
  { value: "GLICOMETRO", label: "Glicômetro Tradicional" },
  { value: "SENSOR_FGM", label: "Sensor Flash (FGM)" },
  { value: "SENSOR_CGM", label: "Sensor Contínuo (CGM)" },
  { value: "MULTI", label: "Múltiplos Métodos" },
];

const TIPO_ATENDIMENTO_OPTIONS = [
  { value: "SUS", label: "Sistema Único de Saúde (SUS)" },
  { value: "CONVENIO", label: "Convênio/Plano de Saúde" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "MISTO", label: "Misto (SUS + Outros)" },
];

const AUXILIO_OPTIONS = [
  { value: "BPC", label: "Benefício de Prestação Continuada (BPC)" },
  { value: "BOLSA_FAMILIA", label: "Bolsa Família" },
  { value: "AUXILIO_DOENCA", label: "Auxílio Doença" },
  { value: "APOSENTADORIA", label: "Aposentadoria por Invalidez" },
  { value: "OUTRO", label: "Outro Auxílio" },
  { value: "NENHUM", label: "Nenhum Auxílio" },
];

const APP_GLICEMIA_OPTIONS = [
  { value: "LIBRE", label: "LibreLink" },
  { value: "DEXCOM", label: "Dexcom" },
  { value: "MEDTRONIC", label: "Medtronic" },
  { value: "ACCU_CHEK", label: "Accu-Chek" },
  { value: "ONETOUCH", label: "OneTouch" },
  { value: "GLICOSOURCE", label: "GlicoSource" },
  { value: "OUTRO", label: "Outro App" },
  { value: "NAO_USA", label: "Não Utiliza App" },
];

const MARCAS_BOMBAS_OPTIONS = [
  { value: "MEDTRONIC_MINIMED", label: "Medtronic MiniMed" },
  { value: "ACCU_CHEK_COMBO", label: "Accu-Chek Combo" },
  { value: "ACCU_CHEK_INSIGHT", label: "Accu-Chek Insight" },
  { value: "OMNIPOD", label: "Omnipod" },
  { value: "TANDEM", label: "Tandem t:slim X2" },
  { value: "OUTRO", label: "Outro" },
];

const MARCAS_GLICOMETROS_SENSORES_OPTIONS = [
  { value: "FREESTYLE_LIBRE", label: "FreeStyle Libre" },
  { value: "FREESTYLE_LIBRE_2", label: "FreeStyle Libre 2" },
  { value: "DEXCOM_G6", label: "Dexcom G6" },
  { value: "DEXCOM_G7", label: "Dexcom G7" },
  { value: "MEDTRONIC_GUARDIAN", label: "Medtronic Guardian" },
  { value: "ACCU_CHEK_ACTIVE", label: "Accu-Chek Active" },
  { value: "ACCU_CHEK_GUIDE", label: "Accu-Chek Guide" },
  { value: "ONETOUCH_SELECT", label: "OneTouch Select Plus" },
  { value: "ONETOUCH_ULTRA", label: "OneTouch Ultra" },
  { value: "CONTOUR_PLUS", label: "Contour Plus" },
  { value: "OUTRO", label: "Outro" },
];

const TIPO_DEFICIENCIA_OPTIONS = [
  { value: "FISICA", label: "Física" },
  { value: "VISUAL", label: "Visual" },
  { value: "AUDITIVA", label: "Auditiva" },
  { value: "INTELECTUAL", label: "Intelectual" },
  { value: "MULTIPLA", label: "Múltipla" },
  { value: "OUTRO", label: "Outro" },
];

const PARENTESCO_OPTIONS = [
  { value: "MAE", label: "Mãe" },
  { value: "PAI", label: "Pai" },
  { value: "IRMAO", label: "Irmão/Irmã" },
  { value: "AVO", label: "Avô/Avó" },
  { value: "TIO", label: "Tio/Tia" },
  { value: "PRIMO", label: "Primo/Prima" },
  { value: "OUTRO", label: "Outro" },
];

// Esquema Zod para validação do formulário
const PatientSchema = z
  .object({
    nome: z.string().min(1, "O nome completo deve ser preenchido"),
    cpf: z
      .string()
      .min(1, "O CPF deve ser preenchido")
      .regex(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "O CPF deve estar no formato 000.000.000-00"),
    cartaoSus: z
      .string()
      .min(1, "O cartão do SUS deve ser preenchido")
      .length(15, "O cartão do SUS deve ter exatamente 15 dígitos"),
    rg: z
      .string()
      .min(7, "O RG deve ter entre 7 e 14 dígitos")
      .max(14, "O RG deve ter entre 7 e 14 dígitos"),
    telefone: z
      .string()
      .min(1, "O telefone deve ser preenchido")
      .regex(
        /\(\d{2}\) \d{4,5}-\d{4}/,
        "O telefone deve estar no formato (00) 00000-0000"
      ),
    dataNascimento: z
      .string()
      .min(1, "A data de nascimento deve ser selecionada")
      .refine((date) => !isNaN(Date.parse(date)), "A data de nascimento deve ser válida"),
    email: z
      .string()
      .min(1, "O e-mail deve ser preenchido")
      .email("O e-mail deve estar em um formato válido (exemplo@dominio.com)"),
    ocupacao: z.string().min(1, "A ocupação deve ser informada"),
    sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"]),
    endereco: z.string().min(1, "O endereço completo deve ser preenchido"),
    numero: z.string().min(1, "O número do endereço deve be preenchido"),
    municipio: z.string().min(1, "O município deve ser informado"),
    tipoAtendimento: z.string().min(1, "O tipo de atendimento deve ser especificado"),
    diagnostico: z.string().min(1, "O diagnóstico deve ser informado"),
    outrasInformacoesDiagnostico: z.string().optional(),
    dataDiagnostico: z
      .string()
      .min(1, "A data do diagnóstico deve ser selecionada")
      .refine((date) => !isNaN(Date.parse(date)), "A data do diagnóstico deve ser válida"),
    metodoInsulina: z
      .string()
      .min(1, "O método de aplicação de insulina deve ser especificado"),
    marcaModeloBomba: z.string().optional(),
    outroMarcaModeloBomba: z.string().optional(),
    metodoMonitoramentoGlicemia: z
      .string()
      .min(1, "O método de monitoramento da glicemia deve ser especificado"),
    marcaModeloGlicometroSensor: z
      .string()
      .min(1, "A marca e modelo do glicômetro ou sensor devem ser informados"),
    outroMarcaModeloGlicometroSensor: z.string().optional(),
    usoAppGlicemia: z
      .string()
      .min(1, "O uso de aplicativo de glicemia deve ser especificado"),
    outrosApps: z.string().optional(),
    nomeResponsavel: z.string().min(1, "O nome do responsável deve ser preenchido"),
    cpfResponsavel: z
      .string()
      .min(1, "O CPF do responsável deve ser preenchido")
      .regex(
        /\d{3}\.\d{3}\.\d{3}-\d{2}/,
        "O CPF do responsável deve estar no formato 000.000.000-00"
      ),
    rgResponsavel: z
      .string()
      .min(7, "O RG do responsável deve ter entre 7 e 14 dígitos")
      .max(14, "O RG do responsável deve ter entre 7 e 14 dígitos"),
    parentescoResponsavel: z
      .string()
      .min(1, "O parentesco do responsável deve ser informado"),
    outroParentescoResponsavel: z.string().optional(),
    telefoneResponsavel: z
      .string()
      .min(1, "O telefone do responsável deve ser preenchido")
      .regex(
        /\(\d{2}\) \d{4,5}-\d{4}/,
        "O telefone do responsável deve estar no formato (00) 00000-0000"
      ),
    ocupacaoResponsavel: z
      .string()
      .min(1, "A ocupação do responsável deve ser informada"),
    dataNascimentoResponsavel: z
      .string()
      .min(1, "A data de nascimento do responsável deve be selecionada")
      .refine(
        (date) => !isNaN(Date.parse(date)),
        "A data de nascimento do responsável deve ser válida"
      ),
    auxilio: z.string().min(1, "O tipo de auxílio deve ser especificado"),
    outrosAuxilios: z.string().optional(),
    dataCadastro: z
      .string()
      .min(1, "A data de cadastro deve ser selecionada")
      .refine((date) => !isNaN(Date.parse(date)), "A data de cadastro deve ser válida"),
    gestante: z.boolean(),
    amamentando: z.boolean(),
    deficiencia: z.boolean(),
    tipoDeficiencia: z.string().optional(),
    outroTipoDeficiencia: z.string().optional(),
    historicoDm1: z.boolean(),
    parentescoDm1: z.string().optional(),
    outroParentescoDm1: z.string().optional(),
    historicoDm2: z.boolean(),
    parentescoDm2: z.string().optional(),
    outroParentescoDm2: z.string().optional(),
    historicoOutrasFormasDm: z.boolean(),
    parentescoOutrasFormasDm: z.string().optional(),
    outroParentescoOutrasFormasDm: z.string().optional(),
    possuiCelularComAcessoInternet: z.boolean(),
    semanasGestacao: z
      .number()
      .min(1, "O número de semanas de gestação deve ser maior que 0")
      .optional(),
    tempoPosParto: z.string().optional(),
    anexar: z.any().optional(),
    cep: z.string().min(1, "O CEP deve ser preenchido"),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "O bairro deve ser preenchido"),
    cidade: z.string().min(1, "A cidade deve ser preenchida"),
    estado: z.string().min(1, "O estado deve ser preenchido"),
  })
  .refine(
    (data) =>
      !data.gestante ||
      (data.semanasGestacao !== undefined && data.semanasGestacao > 0),
    {
      message:
        "O número de semanas de gestação deve ser informado e maior que 0 se gestante",
      path: ["semanasGestacao"],
    }
  )
  .refine((data) => !data.deficiencia || data.tipoDeficiencia, {
    message: "O tipo de deficiência deve ser especificado quando há deficiência",
    path: ["tipoDeficiencia"],
  })
  .refine((data) => !data.historicoDm1 || data.parentescoDm1, {
    message: "O parentesco deve ser informado quando há histórico de DM1",
    path: ["parentescoDm1"],
  })
  .refine((data) => !data.historicoDm2 || data.parentescoDm2, {
    message: "O parentesco deve ser informado quando há histórico de DM2",
    path: ["parentescoDm2"],
  })
  .refine((data) => !data.historicoOutrasFormasDm || data.parentescoOutrasFormasDm, {
    message:
      "O parentesco deve ser informado quando há histórico de outras formas de DM",
    path: ["parentescoOutrasFormasDm"],
  })
  .refine(
    (data) =>
      data.diagnostico !== "OUTRO" ||
      (data.outrasInformacoesDiagnostico &&
        data.outrasInformacoesDiagnostico !== ""),
    {
      message:
        "As informações adicionais sobre o diagnóstico devem ser especificadas quando 'Outro' for selecionado",
      path: ["outrasInformacoesDiagnostico"],
    }
  )
  .refine((data) => data.metodoInsulina !== "BOMBA" || data.marcaModeloBomba, {
    message:
      "A marca e modelo da bomba devem ser informados quando usar bomba de insulina",
    path: ["marcaModeloBomba"],
  })
  .refine(
    (data) =>
      data.marcaModeloBomba !== "OUTRO" ||
      (data.outroMarcaModeloBomba && data.outroMarcaModeloBomba !== ""),
    {
      message:
        "Especifique a marca e modelo da bomba quando 'Outro' for selecionado",
      path: ["outroMarcaModeloBomba"],
    }
  )
  .refine(
    (data) =>
      data.marcaModeloGlicometroSensor !== "OUTRO" ||
      (data.outroMarcaModeloGlicometroSensor &&
        data.outroMarcaModeloGlicometroSensor !== ""),
    {
      message:
        "Especifique a marca e modelo do sensor/glicômetro quando 'Outro' for selecionado",
      path: ["outroMarcaModeloGlicometroSensor"],
    }
  )
  .refine(
    (data) =>
      data.usoAppGlicemia !== "OUTRO" || (data.outrosApps && data.outrosApps !== ""),
    {
      message:
        "Outros aplicativos devem ser especificados quando 'Outro App' for selecionado",
      path: ["outrosApps"],
    }
  )
  .refine(
    (data) =>
      data.auxilio !== "OUTRO" || (data.outrosAuxilios && data.outrosAuxilios !== ""),
    {
      message:
        "Outros auxílios devem ser especificados quando 'Outro Auxílio' for selecionado",
      path: ["outrosAuxilios"],
    }
  )
  .refine(
    (data) =>
      data.tipoDeficiencia !== "OUTRO" ||
      (data.outroTipoDeficiencia && data.outroTipoDeficiencia !== ""),
    {
      message:
        "Especifique o tipo de deficiência quando 'Outro' for selecionado",
      path: ["outroTipoDeficiencia"],
    }
  )
  .refine(
    (data) =>
      data.parentescoDm1 !== "OUTRO" ||
      (data.outroParentescoDm1 && data.outroParentescoDm1 !== ""),
    {
      message: "Especifique o parentesco quando 'Outro' for selecionado",
      path: ["outroParentescoDm1"],
    }
  )
  .refine(
    (data) =>
      data.parentescoDm2 !== "OUTRO" ||
      (data.outroParentescoDm2 && data.outroParentescoDm2 !== ""),
    {
      message: "Especifique o parentesco quando 'Outro' for selecionado",
      path: ["outroParentescoDm2"],
    }
  )
  .refine(
    (data) =>
      data.parentescoOutrasFormasDm !== "OUTRO" ||
      (data.outroParentescoOutrasFormasDm &&
        data.outroParentescoOutrasFormasDm !== ""),
    {
      message: "Especifique o parentesco quando 'Outro' for selecionado",
      path: ["outroParentescoOutrasFormasDm"],
    }
  )
  .refine(
    (data) =>
      data.parentescoResponsavel !== "OUTRO" ||
      (data.outroParentescoResponsavel && data.outroParentescoResponsavel !== ""),
    {
      message: "Especifique o parentesco quando 'Outro' for selecionado",
      path: ["outroParentescoResponsavel"],
    }
  );

type PatientFormValues = z.infer<typeof PatientSchema>;

const PatientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cartaoSus, setCartaoSus] = useState("");
  const [rg, setRg] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [rgResponsavel, setRgResponsavel] = useState("");

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
      outrasInformacoesDiagnostico: "",
      dataDiagnostico: "",
      gestante: false,
      semanasGestacao: undefined,
      amamentando: false,
      tempoPosParto: "",
      deficiencia: false,
      tipoDeficiencia: "",
      outroTipoDeficiencia: "",
      historicoDm1: false,
      parentescoDm1: "",
      outroParentescoDm1: "",
      historicoDm2: false,
      parentescoDm2: "",
      outroParentescoDm2: "",
      historicoOutrasFormasDm: false,
      parentescoOutrasFormasDm: "",
      outroParentescoOutrasFormasDm: "",
      metodoInsulina: "",
      marcaModeloBomba: "",
      outroMarcaModeloBomba: "",
      metodoMonitoramentoGlicemia: "",
      marcaModeloGlicometroSensor: "",
      outroMarcaModeloGlicometroSensor: "",
      usoAppGlicemia: "",
      outrosApps: "",
      nomeResponsavel: "",
      cpfResponsavel: "",
      rgResponsavel: "",
      parentescoResponsavel: "",
      outroParentescoResponsavel: "",
      telefoneResponsavel: "",
      ocupacaoResponsavel: "",
      dataNascimentoResponsavel: "",
      anexar: undefined,
      auxilio: "",
      outrosAuxilios: "",
      possuiCelularComAcessoInternet: false,
      dataCadastro: getLocalDateString(new Date()),
      cep: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Salvando paciente...");

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar paciente");
      }

      const result = await response.json();
      toast.success("Paciente cadastrado com sucesso!", { id: toastId });
      form.reset();
      setShowSuccessDialog(true);
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao cadastrar o paciente";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage, { id: toastId });
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redireciona após sucesso
  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog, router]);

  // Observadores para campos condicionais
  const watchDiagnostico = form.watch("diagnostico");
  const watchMetodoInsulina = form.watch("metodoInsulina");
  const watchGestante = form.watch("gestante");
  const watchAmamentando = form.watch("amamentando");
  const watchDeficiencia = form.watch("deficiencia");
  const watchHistoricoDm1 = form.watch("historicoDm1");
  const watchHistoricoDm2 = form.watch("historicoDm2");
  const watchHistoricoOutrasFormasDm = form.watch("historicoOutrasFormasDm");
  const watchMarcaModeloBomba = form.watch("marcaModeloBomba");
  const watchMarcaModeloGlicometroSensor = form.watch("marcaModeloGlicometroSensor");
  const watchTipoDeficiencia = form.watch("tipoDeficiencia");
  const watchParentescoDm1 = form.watch("parentescoDm1");
  const watchParentescoDm2 = form.watch("parentescoDm2");
  const watchParentescoOutrasFormasDm = form.watch("parentescoOutrasFormasDm");
  const watchParentescoResponsavel = form.watch("parentescoResponsavel");
  const watchUsoAppGlicemia = form.watch("usoAppGlicemia");
  const watchAuxilio = form.watch("auxilio");

  return (
    <>
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
            <CardTitle className="text-2xl font-semibold text-teal-800">
              Cadastro de Paciente
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados Pessoais */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Dados Pessoais</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(e) => {
                              const formatted = formatCPF(e.target.value);
                              setCpf(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={14}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cartaoSus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cartão SUS</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="15 dígitos"
                            value={cartaoSus}
                            onChange={(e) => {
                              const formatted = formatCartaoSus(e.target.value);
                              setCartaoSus(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o RG"
                            value={rg}
                            onChange={(e) => {
                              const formatted = formatRG(e.target.value);
                              setRg(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={14}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            value={telefone}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              setTelefone(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={15}
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
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="exemplo@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
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
                            <PopoverContent className="w-[280px] p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date: Date | undefined) =>
                                  field.onChange(date ? getLocalDateString(date) : "")
                                }
                                components={{
                                  Caption: CustomHeader,
                                }}
                                className="rounded-md border border-teal-200"
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
                    name="sexo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                            <SelectItem value="FEMININO">Feminino</SelectItem>
                            <SelectItem value="OUTRO">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ocupacao"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Ocupação</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a ocupação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Endereço */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Endereço</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00000-000"
                            value={field.value}
                            onChange={async (e) => {
                              const formatted = formatCEP(e.target.value);
                              field.onChange(formatted);
                              
                              if (formatted.length === 9) {
                                try {
                                  const response = await fetch(`https://viacep.com.br/ws/${formatted.replace("-", "")}/json/`);
                                  const data: ViaCEPResponse = await response.json();
                                  
                                  if (!data.erro) {
                                    form.setValue("endereco", data.logradouro);
                                    form.setValue("bairro", data.bairro);
                                    form.setValue("cidade", data.localidade);
                                    form.setValue("estado", data.uf);
                                  } else {
                                    toast.error("CEP não encontrado");
                                  }
                                } catch (error) {
                                  toast.error("Erro ao buscar CEP");
                                }
                              }
                            }}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem className="md:col-span-4">
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Rua, Avenida, etc." 
                            {...field} 
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem className="md:col-span-4">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartamento, bloco, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Bairro" 
                            {...field} 
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Cidade" 
                            {...field} 
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="UF" 
                            {...field} 
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Dados Clínicos */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Dados Clínicos</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoAtendimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Atendimento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de atendimento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIPO_ATENDIMENTO_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="diagnostico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnóstico</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o diagnóstico" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIAGNOSTICO_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchDiagnostico === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outrasInformacoesDiagnostico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Diagnóstico</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o diagnóstico" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="dataDiagnostico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data do Diagnóstico</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
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
                            <PopoverContent className="w-[280px] p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date: Date | undefined) =>
                                  field.onChange(date ? getLocalDateString(date) : "")
                                }
                                components={{
                                  Caption: CustomHeader,
                                }}
                                className="rounded-md border border-teal-200"
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Condições Especiais */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Condições Especiais</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gestante"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Gestante</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchGestante ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchGestante && (
                      <FormField
                        control={form.control}
                        name="semanasGestacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Semanas de Gestação</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Digite o número"
                                className="border-gray-300"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? Number(e.target.value) : undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="amamentando"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Amamentando</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchAmamentando
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchAmamentando && (
                      <FormField
                        control={form.control}
                        name="tempoPosParto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo Pós-Parto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o tempo"
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
                  <FormField
                    control={form.control}
                    name="deficiencia"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Possui Deficiência</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchDeficiencia
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchDeficiencia && (
                      <FormField
                        control={form.control}
                        name="tipoDeficiencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Deficiência</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIPO_DEFICIENCIA_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {watchTipoDeficiencia === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroTipoDeficiencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Tipo de Deficiência</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva a deficiência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </section>

              {/* Histórico Familiar */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Histórico Familiar</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="historicoDm1"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Histórico DM1</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchHistoricoDm1
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchHistoricoDm1 && (
                      <FormField
                        control={form.control}
                        name="parentescoDm1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco DM1</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o parentesco" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PARENTESCO_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {watchParentescoDm1 === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroParentescoDm1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Parentesco DM1</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o parentesco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="historicoDm2"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Histórico DM2</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchHistoricoDm2
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchHistoricoDm2 && (
                      <FormField
                        control={form.control}
                        name="parentescoDm2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco DM2</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o parentesco" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PARENTESCO_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {watchParentescoDm2 === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroParentescoDm2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Parentesco DM2</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o parentesco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="historicoOutrasFormasDm"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Outras Formas de DM</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      watchHistoricoOutrasFormasDm
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    )}
                  >
                    {watchHistoricoOutrasFormasDm && (
                      <FormField
                        control={form.control}
                        name="parentescoOutrasFormasDm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o parentesco" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PARENTESCO_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {watchParentescoOutrasFormasDm === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroParentescoOutrasFormasDm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Parentesco</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o parentesco" {...field} />
                          </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </section>

              {/* Tratamento */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Tratamento</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metodoInsulina"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Insulina</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {METODO_INSULINA_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchMetodoInsulina === "BOMBA" && (
                    <FormField
                      control={form.control}
                      name="marcaModeloBomba"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca/Modelo da Bomba</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a marca/modelo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MARCAS_BOMBAS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {watchMarcaModeloBomba === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroMarcaModeloBomba"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique a Marca/Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva a marca/modelo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="metodoMonitoramentoGlicemia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Monitoramento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {METODO_MONITORAMENTO_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="marcaModeloGlicometroSensor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca/Modelo do Glicômetro/Sensor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a marca/modelo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MARCAS_GLICOMETROS_SENSORES_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchMarcaModeloGlicometroSensor === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroMarcaModeloGlicometroSensor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique a Marca/Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva a marca/modelo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="usoAppGlicemia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uso de App de Glicemia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o app" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {APP_GLICEMIA_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchUsoAppGlicemia === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outrosApps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o App</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o app" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </section>

              {/* Dados do Responsável */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Dados do Responsável</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomeResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome" className="border-gray-300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpfResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF do Responsável</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            value={cpfResponsavel}
                            onChange={(e) => {
                              const formatted = formatCPF(e.target.value);
                              setCpfResponsavel(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={14}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rgResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG do Responsável</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o RG"
                            value={rgResponsavel}
                            onChange={(e) => {
                              const formatted = formatRG(e.target.value);
                              setRgResponsavel(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={14}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentescoResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o parentesco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PARENTESCO_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchParentescoResponsavel === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outroParentescoResponsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Parentesco</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o parentesco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="telefoneResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone do Responsável</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            value={telefoneResponsavel}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              setTelefoneResponsavel(formatted);
                              field.onChange(formatted);
                            }}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataNascimentoResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
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
                            <PopoverContent className="w-[280px] p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date: Date | undefined) =>
                                  field.onChange(date ? getLocalDateString(date) : "")
                                }
                                components={{
                                  Caption: CustomHeader,
                                }}
                                className="rounded-md border border-teal-200"
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
                    name="ocupacaoResponsavel"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Ocupação do Responsável</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a ocupação"
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

              {/* Outras Informações */}
              <section className="space-y-4">
                <h2 className="text-lg font-medium text-teal-700">Outras Informações</h2>
                <Separator className="bg-teal-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="auxilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auxílio</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o auxílio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AUXILIO_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchAuxilio === "OUTRO" && (
                    <FormField
                      control={form.control}
                      name="outrosAuxilios"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o Auxílio</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o auxílio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="possuiCelularComAcessoInternet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                          />
                        </FormControl>
                        <FormLabel>Celular com Internet</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataCadastro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Cadastro</FormLabel>
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
                            <PopoverContent className="w-[280px] p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date: Date | undefined) =>
                                  field.onChange(date ? getLocalDateString(date) : "")
                                }
                                components={{
                                  Caption: CustomHeader,
                                }}
                                className="rounded-md border border-teal-200"
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
                    name="anexar"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Anexar Documentos</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              className="opacity-0 absolute w-full h-full cursor-pointer"
                              onChange={(e) =>
                                field.onChange(e.target.files ? e.target.files[0] : null)
                              }
                            />
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2">
                              Escolher Arquivo
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Botão de Envio */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Cadastro"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-teal-600 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Paciente Cadastrado com Sucesso!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você será redirecionado para a página de pacientes em instantes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              O paciente foi cadastrado com sucesso.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 w-full"
              onClick={() => router.push("/dashboard")}
            >
              Ir para Pacientes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientForm;