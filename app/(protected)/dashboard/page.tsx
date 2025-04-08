"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  Search, 
  UserPlus, 
  PieChart, 
  FilePlus, 
  CalendarRange, 
  FileSearch,
  Calendar,
  Users,
  Activity,
  FileText,
  Settings,
  PlusCircle,
  Bell,
  Clock
} from "lucide-react";

 
interface Patient {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  diagnostico: string;
  telefone: string;
  email: string;
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

// Componente de card de estatísticas
const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={`${className}`}>
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterDiagnostico, setFilterDiagnostico] = useState("todos");
  
  // Dados de exemplo (seriam carregados da API)
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      nome: "João Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1985-04-12",
      diagnostico: "DM1",
      telefone: "(11) 98765-4321",
      email: "joao.silva@email.com",
      dataCadastro: "2023-10-15",
    },
    {
      id: "2",
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
      dataNascimento: "1990-08-22",
      diagnostico: "DM2",
      telefone: "(11) 91234-5678",
      email: "maria.oliveira@email.com",
      dataCadastro: "2023-11-05",
    },
    {
      id: "3",
      nome: "Carlos Souza",
      cpf: "456.789.123-00",
      dataNascimento: "1975-01-30",
      diagnostico: "LADA",
      telefone: "(11) 95555-9999",
      email: "carlos.souza@email.com",
      dataCadastro: "2024-01-10",
    },
    {
      id: "4",
      nome: "Ana Costa",
      cpf: "111.222.333-44",
      dataNascimento: "2000-05-15",
      diagnostico: "DM1",
      telefone: "(11) 94444-8888",
      email: "ana.costa@email.com",
      dataCadastro: "2024-02-20",
    },
    {
      id: "5",
      nome: "Paulo Mendes",
      cpf: "555.666.777-88",
      dataNascimento: "1965-10-07",
      diagnostico: "DM2",
      telefone: "(11) 93333-7777",
      email: "paulo.mendes@email.com",
      dataCadastro: "2024-03-01",
    },
  ]);


  const diagnosticData: DiagnosticData[] = [
    { label: "DM1", value: 2, color: "#0ea5e9" },
    { label: "DM2", value: 2, color: "#10b981" },
    { label: "LADA", value: 1, color: "#f59e0b" },
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.nome.toLowerCase().includes(search.toLowerCase()) || 
                          patient.cpf.includes(search) ||
                          patient.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesDiagnostico = filterDiagnostico === "todos" || patient.diagnostico === filterDiagnostico;
    
    return matchesSearch && matchesDiagnostico;
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);


  const navigateToForm = () => {
    router.push("/cadastro");
  };

  const navigateToPatientDetails = (id: string) => {
    router.push(`/paciente/${id}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie os pacientes cadastrados no sistema
          </p>
        </div>
        <Button 
          onClick={navigateToForm}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Pacientes"
          value={patients.length}
          description="Pacientes cadastrados"
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="DM1"
          value={diagnosticData[0].value}
          description="Pacientes com DM1"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="DM2"
          value={diagnosticData[1].value}
          description="Pacientes com DM2"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="LADA"
          value={diagnosticData[2].value}
          description="Pacientes com LADA"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          className="border-l-4 border-amber-500"
        />
      </div>

      {/* Cards de Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <FilePlus className="h-8 w-8 text-teal-600 mb-3" />
            <h3 className="font-medium">Novo Relatório</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Gere relatórios personalizados
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => router.push('/agendamentos')}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CalendarRange className="h-8 w-8 text-teal-600 mb-3" />
            <h3 className="font-medium">Agendamentos</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Consultas agendadas
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <FileSearch className="h-8 w-8 text-teal-600 mb-3" />
            <h3 className="font-medium">Monitoramento</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Acompanhe medições recentes
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <PieChart className="h-8 w-8 text-teal-600 mb-3" />
            <h3 className="font-medium">Estatísticas</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Análise de dados dos pacientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os pacientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente por nome, CPF ou email..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={filterDiagnostico}
              onValueChange={setFilterDiagnostico}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por diagnóstico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os diagnósticos</SelectItem>
                <SelectItem value="DM1">DM1</SelectItem>
                <SelectItem value="DM2">DM2</SelectItem>
                <SelectItem value="LADA">LADA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((patient) => (
                    <TableRow 
                      key={patient.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigateToPatientDetails(patient.id)}
                    >
                      <TableCell className="font-medium">{patient.nome}</TableCell>
                      <TableCell>{patient.cpf}</TableCell>
                      <TableCell>
                        {format(new Date(patient.dataNascimento), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${patient.diagnostico === "DM1" ? "bg-blue-100 text-blue-800" : 
                            patient.diagnostico === "DM2" ? "bg-green-100 text-green-800" : 
                            "bg-amber-100 text-amber-800"}`}
                        >
                          {patient.diagnostico}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>{patient.telefone}</div>
                        <div className="text-sm text-muted-foreground">{patient.email}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(patient.dataCadastro), "dd/MM/yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum paciente encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredPatients.length)}
                </span>{" "}
                de <span className="font-medium">{filteredPatients.length}</span> resultados
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
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
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;