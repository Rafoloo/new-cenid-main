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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  UserIcon, 
  CalendarIcon, 
  ClipboardIcon, 
  UsersIcon, 
  MessageSquareIcon 
} from "lucide-react";


const formTypes = [
  "Todos",
  "Medicina",
  "Psicologia",
  "Educação Física",
  "Nutrição",
] as const;

const ConsultationModal = ({ 
  consultation, 
  isOpen, 
  onClose 
}: { 
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!consultation) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'Agendada': 'bg-yellow-500 text-white',
      'Confirmada': 'bg-teal-500 text-white',
      'EmAndamento': 'bg-indigo-500 text-white',
      'Concluida': 'bg-green-500 text-white',
      'Cancelada': 'bg-red-500 text-white',
      'Remarcada': 'bg-purple-500 text-white'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const Section = ({ title, icon: Icon, children }: { 
    title: string; 
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
      <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-500" />
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
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
            <span className={`px-4 py-2 rounded-md font-semibold ${getStatusColor(consultation.statusConsulta)}`}>
              {consultation.statusConsulta}
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <Section icon={UserIcon} title="Dados do Paciente">
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Nome:</span> {consultation.nomePaciente}</p>
              <p><span className="font-semibold">CPF:</span> {consultation.cpf}</p>
              <p><span className="font-semibold">Email:</span> {consultation.email as string}</p>
            </div>
          </Section>

          <Section icon={CalendarIcon} title="Dados da Consulta">
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Data:</span> {new Date(consultation.dataConsulta).toLocaleDateString('pt-BR')}</p>
              <p><span className="font-semibold">Hora:</span> {consultation.horaConsulta}</p>
              <p><span className="font-semibold">Duração:</span> {consultation.duracaoConsulta} minutos</p>
              <p><span className="font-semibold">Especialidade:</span> {consultation.especialidade}</p>
              <p><span className="font-semibold">Profissional:</span> {consultation.profissional}</p>
            </div>
          </Section>

          <Section icon={ClipboardIcon} title="Informações Clínicas">
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Motivo:</span> {consultation.motivoConsulta}</p>
              {consultation.sintomasRelatados && (
                <p><span className="font-semibold">Sintomas:</span> {consultation.sintomasRelatados}</p>
              )}
              {consultation.ultimaGlicemia && (
                <p><span className="font-semibold">Última Glicemia:</span> {consultation.ultimaGlicemia}</p>
              )}
              {consultation.ultimaHemoglobina && (
                <p><span className="font-semibold">Última Hemoglobina:</span> {consultation.ultimaHemoglobina}</p>
              )}
            </div>
          </Section>

          {consultation.precisaAcompanhante && (
            <Section icon={UsersIcon} title="Dados do Acompanhante">
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Nome:</span> {consultation.nomeAcompanhante}</p>
                <p><span className="font-semibold">Telefone:</span> {consultation.telefoneAcompanhante}</p>
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
      </DialogContent>
    </Dialog>
  );
};

export default function ConsultasPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<typeof formTypes[number]>("Todos");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('/api/consultations');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setConsultations(data);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        toast.error("Erro ao carregar consultas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const renderConsultationCards = () => {
    let filteredConsultations = consultations;
    
    if (selectedForm !== "Todos") {
      filteredConsultations = consultations.filter(
        consultation => consultation.especialidade.toLowerCase() === selectedForm.toLowerCase()
      );
    }

    if (isLoading) {
      return <div>Carregando...</div>;
    }

    if (filteredConsultations.length === 0) {
      return <div className="text-gray-500">Nenhuma consulta encontrada.</div>;
    }

    const getStatusColor = (status: string) => {
      const colors = {
        Agendada: "bg-yellow-100 text-yellow-800",
        EmAndamento: "bg-teal-100 text-teal-800",
        Concluida: "bg-green-100 text-green-800",
        Cancelada: "bg-red-100 text-red-800"
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
                  <h3 className="font-semibold">Paciente: {consultation.nomePaciente}</h3>
                  <p className="text-sm text-gray-500">
                    Data: {new Date(consultation.dataConsulta).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Hora: {consultation.horaConsulta}
                  </p>
                  <p className="text-sm text-gray-500">
                    Especialidade: {consultation.especialidade}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(consultation.statusConsulta)}`}>
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
        <Button 
          onClick={() => router.push("/cadastrar-consulta")}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Nova Consulta
        </Button>
      </div>

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

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            {renderConsultationCards()}
          </CardContent>
        </Card>
      </Tabs>

      <ConsultationModal 
        consultation={selectedConsultation} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedConsultation(null);
        }} 
      />
    </div>
  );
}