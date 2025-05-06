"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserPlus,
  PieChart,
  FilePlus,
  CalendarRange,
  FileSearch,
  Users,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface DiagnosticData {
  label: string;
  value: number;
  color: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const formatDateSafely = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy");
  } catch (error) {
    console.error(`Erro ao formatar data: ${dateString}`, error);
    return "Data inválida";
  }
};

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterDiagnostico, setFilterDiagnostico] = useState("todos");
  const [sortField, setSortField] = useState<keyof Patient | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    console.log("Dashboard montado no cliente", { patients, loading, error });
  }, [error, loading, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patients");
      console.log("Resposta da API /api/patients:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API de pacientes não encontrada.");
        } else if (response.status === 500) {
          throw new Error("Erro no servidor. Tente novamente mais tarde.");
        }
        throw new Error(`Erro ao buscar pacientes: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido ao carregar pacientes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated) {
      fetchPatients();
    }
  }, [hydrated]);

  const deletePatient = async (id: number) => {
    try {
      setDeleting(true);
      console.log(`Tentando deletar paciente com ID: ${id}`);
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(`Resposta da API: ${response.status}`, errorData);
        if (response.status === 404) {
          throw new Error("Paciente não encontrado.");
        } else if (response.status === 403) {
          throw new Error("Permissão negada para remover paciente.");
        }
        throw new Error(
          `Erro ao deletar paciente: ${response.status} - ${
            errorData.message || "Detalhes não disponíveis"
          }`
        );
      }

      setPatients(patients.filter((patient) => patient.id !== id));
      toast({
        title: "Paciente removido",
        description: "O paciente foi removido com sucesso.",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.error("Erro ao deletar paciente:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido ao remover paciente.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setPatientToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getDiagnosticCounts = () => {
    const counts = {
      DM1: 0,
      DM2: 0,
      OUTROS: 0,
    };

    patients.forEach((patient) => {
      if (patient.diagnostico === "DM1") counts.DM1++;
      else if (patient.diagnostico === "DM2") counts.DM2++;
      else if (patient.diagnostico === "OUTROS") counts.OUTROS++;
    });

    return counts;
  };

  const diagnosticCounts = getDiagnosticCounts();

  const diagnosticData: DiagnosticData[] = [
    { label: "DM1", value: diagnosticCounts.DM1, color: "#1E88E5" },
    { label: "DM2", value: diagnosticCounts.DM2, color: "#43A047" },
    { label: "OUTROS", value: diagnosticCounts.OUTROS, color: "#FBC02D" },
  ];

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        (patient.nome?.toLowerCase().includes(debouncedSearch.toLowerCase()) || false) ||
        (patient.cpf?.includes(debouncedSearch) || false) ||
        (patient.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) || false);

      const matchesDiagnostico =
        filterDiagnostico === "todos" || patient.diagnostico === filterDiagnostico;

      return matchesSearch && matchesDiagnostico;
    });
  }, [patients, debouncedSearch, filterDiagnostico]);

  const sortedPatients = useMemo(() => {
    if (!sortField) return filteredPatients;
    return [...filteredPatients].sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [filteredPatients, sortField, sortOrder]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedPatients.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedPatients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (sortedPatients.length === 0) {
      setCurrentPage(1);
    }
  }, [sortedPatients, itemsPerPage, currentPage, totalPages]);

  const navigateToForm = () => {
    router.push("/cadastro");
  };

  const navigateToEditPatient = (id: number) => {
    console.log(`Navegando para /paciente/editar/${id}`);
    router.push(`/paciente/editar/${id}`);
  };

  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportToCSV = () => {
    const headers = ["Nome", "CPF", "Data de Nascimento", "Diagnóstico", "Telefone", "Email", "Data de Cadastro"];
    const rows = sortedPatients.map((patient) => [
      patient.nome || "",
      patient.cpf || "",
      formatDateSafely(patient.dataNascimento),
      patient.diagnostico || "",
      patient.telefone || "",
      patient.email || "",
      formatDateSafely(patient.dataCadastro),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pacientes.csv";
    link.click();
  };

  const handleDeleteClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    console.log("Paciente selecionado para exclusão:", patient);
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Gerencie os pacientes cadastrados no sistema com facilidade
          </p>
        </div>
        <Button
          onClick={navigateToForm}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Novo Paciente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pacientes"
          value={patients.length}
          description="Pacientes cadastrados"
          icon={<Users className="h-5 w-5 text-teal-600" />}
          className="bg-white border border-gray-200 rounded-xl"
        />
        <StatCard
          title="DM1"
          value={diagnosticData[0].value}
          description="Pacientes com DM1"
          icon={<PieChart className="h-5 w-5 text-teal-600" />}
          className="bg-white border-l-4 border-teal-700 rounded-xl"
        />
        <StatCard
          title="DM2"
          value={diagnosticData[1].value}
          description="Pacientes com DM2"
          icon={<PieChart className="h-5 w-5 text-teal-600" />}
          className="bg-white border-l-4 border-teal-500 rounded-xl"
        />
        <StatCard
          title="OUTROS"
          value={diagnosticData[2].value}
          description="Pacientes com outros diagnósticos"
          icon={<PieChart className="h-5 w-5 text-teal-600" />}
          className="bg-white border-l-4 border-teal-300 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer bg-white border border-gray-200 rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <FilePlus className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">Novo Relatório</h3>
            <p className="text-sm text-gray-500 mt-1">Gere relatórios personalizados</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer bg-white border border-gray-200 rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-md"
          onClick={() => router.push("/agendamentos")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CalendarRange className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">Agendamentos</h3>
            <p className="text-sm text-gray-500 mt-1">Consultas agendadas</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer bg-white border border-gray-200 rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <FileSearch className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">Monitoramento</h3>
            <p className="text-sm text-gray-500 mt-1">Acompanhe medições recentes</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer bg-white border border-gray-200 rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <PieChart className="h-8 w-8 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">Estatísticas</h3>
            <p className="text-sm text-gray-500 mt-1">Análise de dados dos pacientes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 rounded-xl shadow-md">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-800">Pacientes Cadastrados</CardTitle>
          <CardDescription className="text-gray-500">
            Visualize, edite ou remova os pacientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente por nome, CPF ou email..."
                className="pl-10 border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar pacientes por nome, CPF ou email"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterDiagnostico} onValueChange={setFilterDiagnostico}>
                <SelectTrigger className="w-[180px] border-gray-300 rounded-lg">
                  <SelectValue placeholder="Filtrar por diagnóstico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os diagnósticos</SelectItem>
                  <SelectItem value="DM1">DM1</SelectItem>
                  <SelectItem value="DM2">DM2</SelectItem>
                  <SelectItem value="LADA">LADA</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={exportToCSV}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Exportar CSV
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-10">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"
                role="status"
                aria-label="Carregando pacientes"
              ></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              <p>{error}</p>
              <Button
                onClick={fetchPatients}
                variant="outline"
                className="mt-2 text-sm border-red-300 text-red-700 hover:bg-red-100"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead
                      className="text-gray-700 cursor-pointer"
                      onClick={() => handleSort("nome")}
                    >
                      Nome {sortField === "nome" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer"
                      onClick={() => handleSort("cpf")}
                    >
                      CPF {sortField === "cpf" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer"
                      onClick={() => handleSort("dataNascimento")}
                    >
                      Data de Nascimento{" "}
                      {sortField === "dataNascimento" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-gray-700">Diagnóstico</TableHead>
                    <TableHead className="text-gray-700">Contato</TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer"
                      onClick={() => handleSort("dataCadastro")}
                    >
                      Cadastro {sortField === "dataCadastro" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-gray-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((patient) => (
                      <TableRow
                        key={patient.id}
                        className="hover:bg-teal-50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-800">{patient.nome}</TableCell>
                        <TableCell className="text-gray-600">{patient.cpf}</TableCell>
                        <TableCell className="text-gray-600">
                          {formatDateSafely(patient.dataNascimento)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                            ${patient.diagnostico === "DM1" ? "bg-teal-800 text-teal-50" : 
                              patient.diagnostico === "DM2" ? "bg-teal-500 text-teal-50" : 
                              "bg-teal-100 text-teal-500"}`}
                          >
                            {patient.diagnostico}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">{patient.telefone || "N/A"}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDateSafely(patient.dataCadastro)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToEditPatient(patient.id);
                              }}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleDeleteClick(e, patient)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        Nenhum paciente encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {isDeleteDialogOpen && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Remoção</DialogTitle>
                  <DialogDescription>
                    Tem certeza de que deseja remover o paciente{" "}
                    <span className="font-semibold">{patientToDelete?.nome}</span>?
                    Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPatientToDelete(null);
                      setIsDeleteDialogOpen(false);
                    }}
                    className="border-gray-300"
                    disabled={deleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      console.log("Botão Remover clicado, ID:", patientToDelete?.id);
                      patientToDelete && deletePatient(patientToDelete.id);
                    }}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                          />
                        </svg>
                        Removendo...
                      </span>
                    ) : (
                      "Remover"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {!loading && !error && sortedPatients.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-medium">{currentItems.length > 0 ? currentPage * itemsPerPage - itemsPerPage + 1 : 0}</span> a{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, sortedPatients.length)}
                  </span>{" "}
                  de <span className="font-medium">{sortedPatients.length}</span> resultados
                </p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[70px] border-gray-300 rounded-lg">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "text-teal-600"}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <PaginationItem key={page}>
                        {index > 0 && array[index - 1] !== page - 1 ? (
                          <PaginationEllipsis />
                        ) : null}
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className={page === currentPage ? "bg-teal-600 text-white" : "text-teal-600"}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "text-teal-600"}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;