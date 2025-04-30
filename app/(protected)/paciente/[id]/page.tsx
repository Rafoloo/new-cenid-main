// /app/paciente/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Adicionar useCallback
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, FileText, Phone, Mail, Home, Stethoscope, Baby, Accessibility, Syringe, Smartphone } from "lucide-react";
import { format } from "date-fns";

interface Patient {
  id: number;
  nome: string;
  cpf: string;
  cartaoSus?: string;
  rg?: string;
  telefone?: string;
  dataNascimento: string;
  email: string;
  ocupacao?: string;
  sexo?: string;
  endereco?: string;
  numero?: string;
  municipio?: string;
  tipoAtendimento?: string;
  diagnostico: string;
  outrasFormasDm?: string;
  dataDiagnostico?: string;
  gestante?: string;
  semanasGestacao?: number;
  amamentando?: string;
  tempoPosParto?: string;
  deficiencia?: string;
  tipoDeficiencia?: string;
  historicoDm1?: string;
  parentescoDm1?: string;
  historicoDm2?: string;
  parentescoDm2?: string;
  historicoOutrasFormasDm?: string;
  parentescoOutrasFormasDm?: string;
  metodoInsulina?: string;
  marcaModeloBomba?: string;
  metodoMonitoramentoGlicemia?: string;
  marcaModeloGlicometroSensor?: string;
  usoAppGlicemia?: string;
  outrosApps?: string;
  nomeResponsavel?: string;
  cpfResponsavel?: string;
  rgResponsavel?: string;
  parentescoResponsavel?: string;
  telefoneResponsavel?: string;
  ocupacaoResponsavel?: string;
  dataNascimentoResponsavel?: string;
  auxilio?: string;
  outrosAuxilios?: string;
  possuiCelularComAcessoInternet?: string;
  dataCadastro: string;
}

const formatDateSafely = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy");
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return "Data inválida";
  }
};

const PatientDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar fetchPatient com useCallback
  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      const patientId = parseInt(id as string, 10);
      if (isNaN(patientId)) {
        throw new Error("ID inválido. Deve ser um número.");
      }

      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar paciente: ${response.status}`);
      }
      const data = await response.json();
      setPatient(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar paciente:", err);
      setError("Não foi possível carregar os detalhes do paciente.");
    } finally {
      setLoading(false);
    }
  }, [id]); // id é uma dependência de fetchPatient

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id, fetchPatient]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error || "Paciente não encontrado."}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Detalhes do Paciente
        </h1>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{patient.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informações Pessoais */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{patient.nome || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{patient.cpf || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Cartão SUS</p>
                <p className="font-medium">{patient.cartaoSus || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">RG</p>
                <p className="font-medium">{patient.rg || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium">{formatDateSafely(patient.dataNascimento)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{patient.telefone || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">{patient.sexo || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Home className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{patient.endereco || "N/A"}, {patient.numero || "N/A"}, {patient.municipio || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Ocupação</p>
                <p className="font-medium">{patient.ocupacao || "N/A"}</p>
              </div>
            </div>

            {/* Informações Médicas */}
            <div className="flex items-center">
              <Stethoscope className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Diagnóstico</p>
                <p className="font-medium">{patient.diagnostico || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Data do Diagnóstico</p>
                <p className="font-medium">{formatDateSafely(patient.dataDiagnostico)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Baby className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Gestante</p>
                <p className="font-medium">{patient.gestante || "N/A"} {patient.semanasGestacao ? `(${patient.semanasGestacao} semanas)` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Baby className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Amamentando</p>
                <p className="font-medium">{patient.amamentando || "N/A"} {patient.tempoPosParto ? `(${patient.tempoPosParto})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Accessibility className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Deficiência</p>
                <p className="font-medium">{patient.deficiencia || "N/A"} {patient.tipoDeficiencia ? `(${patient.tipoDeficiencia})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Syringe className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Método de Insulina</p>
                <p className="font-medium">{patient.metodoInsulina || "N/A"} {patient.marcaModeloBomba ? `(${patient.marcaModeloBomba})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Monitoramento de Glicemia</p>
                <p className="font-medium">{patient.metodoMonitoramentoGlicemia || "N/A"} {patient.marcaModeloGlicometroSensor ? `(${patient.marcaModeloGlicometroSensor})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Uso de App de Glicemia</p>
                <p className="font-medium">{patient.usoAppGlicemia || "N/A"} {patient.outrosApps ? `(${patient.outrosApps})` : ""}</p>
              </div>
            </div>

            {/* Histórico Familiar */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Histórico DM1</p>
                <p className="font-medium">{patient.historicoDm1 || "N/A"} {patient.parentescoDm1 ? `(${patient.parentescoDm1})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Histórico DM2</p>
                <p className="font-medium">{patient.historicoDm2 || "N/A"} {patient.parentescoDm2 ? `(${patient.parentescoDm2})` : ""}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Outras Formas de DM</p>
                <p className="font-medium">{patient.historicoOutrasFormasDm || "N/A"} {patient.parentescoOutrasFormasDm ? `(${patient.parentescoOutrasFormasDm})` : ""}</p>
              </div>
            </div>

            {/* Informações do Responsável */}
            <div className="flex items-center">
              <User className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Nome do Responsável</p>
                <p className="font-medium">{patient.nomeResponsavel || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">CPF do Responsável</p>
                <p className="font-medium">{patient.cpfResponsavel || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone do Responsável</p>
                <p className="font-medium">{patient.telefoneResponsavel || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento do Responsável</p>
                <p className="font-medium">{formatDateSafely(patient.dataNascimentoResponsavel)}</p>
              </div>
            </div>

            {/* Outras Informações */}
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Acesso à Internet</p>
                <p className="font-medium">{patient.possuiCelularComAcessoInternet || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-teal-600 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium">{formatDateSafely(patient.dataCadastro)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetails;