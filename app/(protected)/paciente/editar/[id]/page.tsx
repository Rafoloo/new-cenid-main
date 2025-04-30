"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, Calendar, Home, FileText, Stethoscope } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Patient {
  id: number;
  nome?: string;
  cpf?: string;
  cartaoSus?: string;
  rg?: string;
  telefone?: string;
  dataNascimento?: string;
  email: string;
  ocupacao?: string;
  sexo?: string;
  endereco?: string;
  numero?: string;
  municipio?: string;
  tipoAtendimento?: string;
  diagnostico?: string;
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
  dateCadastro?: string;
}

const EditPatient = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [initialPatient, setInitialPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const id = params.id as string;
        console.log("ID extraído da URL:", id);

        if (!id || isNaN(parseInt(id, 10))) {
          throw new Error("ID inválido. Deve ser um número.");
        }

        console.log("Fazendo requisição para:", `/api/patients/${id}`);
        const response = await fetch(`/api/patients/${id}`);
        console.log("Status da resposta:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log("Erro retornado pela API:", errorData);
          if (response.status === 404) {
            throw new Error("Paciente não encontrado.");
          }
          throw new Error(errorData.error || `Erro ao buscar paciente: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        setPatient(data);
        setInitialPatient(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar paciente:", err);
        const message = err instanceof Error ? err.message : "Erro desconhecido ao carregar paciente.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => (prev ? { ...prev, [name]: value || undefined } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPatient((prev) => (prev ? { ...prev, [name]: value || undefined } : null));
  };

  const hasChanges = useMemo(() => {
    if (!patient || !initialPatient) return false;
    return Object.keys(patient).some((key) => {
      const patientValue = patient[key as keyof Patient];
      const initialValue = initialPatient[key as keyof Patient];
      return patientValue !== initialValue;
    });
  }, [patient, initialPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !hasChanges) {
      toast({
        title: "Nenhuma alteração",
        description: "Nenhuma mudança foi feita nos dados do paciente.",
        className: "bg-yellow-500 text-white",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/patients/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error("Paciente não encontrado.");
        } else if (response.status === 400) {
          throw new Error(errorData.error || "Dados inválidos.");
        }
        throw new Error(errorData.error || `Erro ao atualizar paciente: ${response.status}`);
      }

      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
        className: "bg-green-500 text-white",
      });

      // Redirecionar após 1.5s para garantir que o toast seja visto
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Erro ao atualizar paciente:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido ao atualizar paciente.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error || "Paciente não encontrado."}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="bg-teal-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-teal-800">
            Editar Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-lg bg-teal-100 p-1">
                <TabsTrigger value="personal" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow">
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="medical" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow">
                  Informações Médicas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label htmlFor="nome" className="text-teal-700">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="nome"
                        name="nome"
                        value={patient.nome || ""}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="Digite o nome completo"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="cpf" className="text-teal-700">CPF</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="cpf"
                        name="cpf"
                        value={patient.cpf || ""}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="email" className="text-teal-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={patient.email || ""}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="exemplo@dominio.com"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="telefone" className="text-teal-700">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="telefone"
                        name="telefone"
                        value={patient.telefone || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="dataNascimento" className="text-teal-700">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={patient.dataNascimento || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="cartaoSus" className="text-teal-700">Cartão SUS</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="cartaoSus"
                        name="cartaoSus"
                        value={patient.cartaoSus || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="Digite o número do cartão SUS"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="rg" className="text-teal-700">RG</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="rg"
                        name="rg"
                        value={patient.rg || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="Digite o número do RG"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="endereco" className="text-teal-700">Endereço</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="endereco"
                        name="endereco"
                        value={patient.endereco || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="Rua, bairro"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="municipio" className="text-teal-700">Município</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                      <Input
                        id="municipio"
                        name="municipio"
                        value={patient.municipio || ""}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                        placeholder="Digite o município"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="diagnostico" className="text-teal-700">Diagnóstico</Label>
                    <Select
                      value={patient.diagnostico || ""}
                      onValueChange={(value) => handleSelectChange("diagnostico", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-lg">
                        <Stethoscope className="h-4 w-4 text-teal-500 mr-2" />
                        <SelectValue placeholder="Selecione o diagnóstico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DM1">DM1</SelectItem>
                        <SelectItem value="DM2">DM2</SelectItem>
                        <SelectItem value="LADA">LADA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={submitting}
                className="border-teal-300 text-teal-700 hover:bg-teal-50 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting || !hasChanges}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPatient;