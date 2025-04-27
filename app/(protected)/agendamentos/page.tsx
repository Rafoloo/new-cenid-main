"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Consultation } from "@/types/consultation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserIcon,
  CalendarIcon,
  ClipboardIcon,
  UsersIcon,
  MessageSquareIcon,
  PenIcon,
  TrashIcon,
  RefreshCwIcon,
  FilterIcon,
} from "lucide-react";

const formTypes = [
  "Todos",
  "Medicina",
  "Psicologia",
  "Educação Física",
  "Nutrição",
  "Enfermagem",
] as const;

const statusTypes = [
  "Todos",
  "Agendada",
  "Confirmada",
  "EmAndamento",
  "Concluida",
  "Cancelada",
  "Remarcada",
] as const;

const ConsultationModal = ({
  consultation,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  isUpdatingStatus,
}: {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (consultation: Consultation) => void;
  onDelete: (consultationId: string) => void;
  onUpdateStatus: (consultationId: string, newStatus: string) => void;
  isUpdatingStatus: boolean;
}) => {
  if (!consultation) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      Agendada: "bg-yellow-500 text-white",
      Confirmada: "bg-teal-500 text-white",
      EmAndamento: "bg-indigo-500 text-white",
      Concluida: "bg-green-500 text-white",
      Cancelada: "bg-red-500 text-white",
      Remarcada: "bg-purple-500 text-white",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const Section = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
      <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-500" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader className="border-b-2 border-teal-500 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-teal-700">
              Detalhes da Consulta
            </DialogTitle>
            <span
              className={`px-4 py-2 rounded-md font-semibold ${getStatusColor(
                consultation.statusConsulta
              )}`}
            >
              {consultation.statusConsulta}
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <Section icon={UserIcon} title="Dados do Paciente">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Nome:</span>{" "}
                {consultation.nomePaciente || consultation.patient?.nome}
              </p>
              <p>
                <span className="font-semibold">CPF:</span>{" "}
                {consultation.cpf || consultation.patient?.cpf}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {consultation.email || consultation.patient?.email}
              </p>
            </div>
          </Section>

          <Section icon={CalendarIcon} title="Dados da Consulta">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Data:</span>{" "}
                {new Date(consultation.dataConsulta).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold">Hora:</span>{" "}
                {consultation.horaConsulta}
              </p>
              <p>
                <span className="font-semibold">Duração:</span>{" "}
                {consultation.duracaoConsulta} minutos
              </p>
              <p>
                <span className="font-semibold">Especialidade:</span>{" "}
                {consultation.especialidade}
              </p>
              <p>
                <span className="font-semibold">Profissional:</span>{" "}
                {consultation.profissional}
              </p>
            </div>
          </Section>

          <Section icon={ClipboardIcon} title="Informações Clínicas">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Motivo:</span>{" "}
                {consultation.motivoConsulta}
              </p>
              {consultation.sintomasRelatados && (
                <p>
                  <span className="font-semibold">Sintomas:</span>{" "}
                  {consultation.sintomasRelatados}
                </p>
              )}
              {consultation.ultimaGlicemia && (
                <p>
                  <span className="font-semibold">Última Glicemia:</span>{" "}
                  {consultation.ultimaGlicemia}
                </p>
              )}
              {consultation.ultimaHemoglobina && (
                <p>
                  <span className="font-semibold">Última Hemoglobina:</span>{" "}
                  {consultation.ultimaHemoglobina}
                </p>
              )}
            </div>
          </Section>

          {consultation.precisaAcompanhante && (
            <Section icon={UsersIcon} title="Dados do Acompanhante">
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Nome:</span>{" "}
                  {consultation.nomeAcompanhante}
                </p>
                <p>
                  <span className="font-semibold">Telefone:</span>{" "}
                  {consultation.telefoneAcompanhante}
                </p>
              </div>
            </Section>
          )}

          {consultation.observacoes && (
            <div className="col-span-2">
              <Section icon={MessageSquareIcon} title="Observações">
                <p className="text-gray-700">{consultation.observacoes}</p>
              </Section>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-bold text-teal-700 mb-4">Alterar Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusTypes
              .filter((status) => status !== "Todos")
              .map((status) => (
                <Button
                  key={status}
                  variant={
                    status === consultation.statusConsulta
                      ? "default"
                      : "outline"
                  }
                  className={`${
                    status === consultation.statusConsulta
                      ? getStatusColor(status)
                      : ""
                  }`}
                  onClick={() => onUpdateStatus(consultation.id, status)}
                  disabled={isUpdatingStatus}
                >
                  {status}
                </Button>
              ))}
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end pt-4 mt-6 border-t border-gray-200">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => onEdit(consultation)}
            disabled={isUpdatingStatus}
          >
            <PenIcon className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => onDelete(consultation.id)}
            disabled={isUpdatingStatus}
          >
            <TrashIcon className="h-4 w-4" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ConsultasPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedForm, setSelectedForm] = useState<typeof formTypes[number]>(
    "Todos"
  );
  const [selectedStatus, setSelectedStatus] = useState<
    typeof statusTypes[number]
  >("Todos");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consultationToDeleteId, setConsultationToDeleteId] = useState<
    string | null
  >(null);
  const [filterType, setFilterType] = useState<"specialty" | "status">(
    "specialty"
  );

  const fetchConsultations = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/consultations");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const processedData = data.map((consultation: any) => ({
        ...consultation,
        nomePaciente: consultation.patient?.nome,
        cpf: consultation.patient?.cpf,
        email: consultation.patient?.email,
      }));

      setConsultations(processedData);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast.error("Erro ao carregar consultas");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleDeleteConsultation = async () => {
    if (!consultationToDeleteId) return;

    try {
      const response = await fetch(`/api/consultations/${consultationToDeleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao excluir consulta");
      }

      setConsultations(
        consultations.filter((cons) => cons.id !== consultationToDeleteId)
      );
      toast.success("Consulta excluída com sucesso!");

      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      setSelectedConsultation(null);
      setConsultationToDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir consulta"
      );
    }
  };

  const normalizeStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Concluida: "Concluída",
    };
    return statusMap[status] || status;
  };

  const handleUpdateStatus = async (consultationId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const normalizedStatus = normalizeStatus(newStatus);
      console.log("Enviando PATCH para:", `/api/consultations/${consultationId}`, {
        statusConsulta: normalizedStatus,
      });

      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ statusConsulta: normalizedStatus }),
      });

      const updatedConsultation = await response.json();
      console.log("Resposta da API:", updatedConsultation);

      if (!response.ok) {
        throw new Error(
          updatedConsultation.message || "Erro ao atualizar status da consulta"
        );
      }

      setConsultations((prev) => {
        const updatedConsultations = prev.map((cons) =>
          cons.id === consultationId ? updatedConsultation : cons
        );
        console.log("Novo estado de consultations:", updatedConsultations);
        return updatedConsultations;
      });

      if (selectedConsultation && selectedConsultation.id === consultationId) {
        setSelectedConsultation(updatedConsultation);
      }

      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status da consulta"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEditConsultation = (consultation: Consultation) => {
    router.push(`/consulta/editar/${consultation.id}`);
  };

  const confirmDelete = (consultationId: string) => {
    setConsultationToDeleteId(consultationId);
    setIsDeleteDialogOpen(true);
  };

  const filterConsultations = () => {
    let filtered = consultations;

    if (selectedForm !== "Todos") {
      filtered = filtered.filter(
        (consultation) => consultation.especialidade === selectedForm
      );
    }

    if (selectedStatus !== "Todos") {
      filtered = filtered.filter(
        (consultation) => consultation.statusConsulta === selectedStatus
      );
    }

    return filtered;
  };

  const renderConsultationCards = () => {
    const filteredConsultations = filterConsultations();

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          Carregando...
        </div>
      );
    }

    if (filteredConsultations.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          Nenhuma consulta encontrada.
        </div>
      );
    }

    const getStatusColor = (status: string) => {
      const colors = {
        Agendada: "bg-yellow-100 text-yellow-800",
        Confirmada: "bg-blue-100 text-blue-800",
        EmAndamento: "bg-indigo-100 text-indigo-800",
        Concluida: "bg-green-100 text-green-800",
        Cancelada: "bg-red-100 text-red-800",
        Remarcada: "bg-purple-100 text-purple-800",
      };
      return colors[status as keyof typeof colors] || "";
    };

    return (
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <Card
            key={consultation.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedConsultation(consultation);
              setIsModalOpen(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    Paciente:{" "}
                    {consultation.nomePaciente || consultation.patient?.nome}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Data:{" "}
                    {new Date(consultation.dataConsulta).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Hora: {consultation.horaConsulta}
                  </p>
                  <p className="text-sm text-gray-500">
                    Especialidade: {consultation.especialidade}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    consultation.statusConsulta
                  )}`}
                >
                  {consultation.statusConsulta}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Consultas</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchConsultations}
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button
            onClick={() => router.push("/consulta")}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Nova Consulta
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={filterType === "specialty" ? "default" : "outline"}
            onClick={() => setFilterType("specialty")}
            className="flex items-center gap-2"
          >
            <ClipboardIcon className="h-4 w-4" />
            Filtrar por Especialidade
          </Button>
          <Button
            variant={filterType === "status" ? "default" : "outline"}
            onClick={() => setFilterType("status")}
            className="flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filtrar por Status
          </Button>
        </div>

        {filterType === "specialty" && (
          <Tabs defaultValue="Todos" className="w-full">
            <TabsList className="flex flex-wrap">
              {formTypes.map((formType) => (
                <TabsTrigger
                  key={formType}
                  value={formType}
                  onClick={() => setSelectedForm(formType)}
                >
                  {formType}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Todos"></TabsContent>
            {formTypes.slice(1).map((formType) => (
              <TabsContent key={formType} value={formType}></TabsContent>
            ))}
          </Tabs>
        )}

        {filterType === "status" && (
          <Tabs defaultValue="Todos" className="w-full">
            <TabsList className="flex flex-wrap">
              {statusTypes.map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Todos"></TabsContent>
            {statusTypes.slice(1).map((status) => (
              <TabsContent key={status} value={status}></TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            Consultas
            {selectedForm !== "Todos" && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                Especialidade: {selectedForm}
              </span>
            )}
            {selectedStatus !== "Todos" && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                Status: {selectedStatus}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderConsultationCards()}</CardContent>
      </Card>

      <ConsultationModal
        consultation={selectedConsultation}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConsultation(null);
        }}
        onEdit={handleEditConsultation}
        onDelete={confirmDelete}
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta consulta? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConsultation}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}