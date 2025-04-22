"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stethoscope, Brain, Dumbbell, Apple, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FormularioMedicina from "@/components/auth/medicina-form";
import FormularioPsicologia from "@/components/auth/psicologia-form";
import FormularioEducacaoFisica from "@/components/auth/fisica-form";
import FormularioNutricao from "@/components/auth/nutricao-form";
import FormularioEnfermagem from "@/components/auth/enfermagem-form";

const ConsultaForm = () => {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string | null>(null);
  const router = useRouter();

  // Configuração do formulário (da versão do branch)
  const form = useForm({
    resolver: zodResolver(/* seu schema Zod */),
    defaultValues: {
      /* seus valores padrão */
    },
  });

  const selecionarEspecialidade = (especialidade: string) => {
    setEspecialidadeSelecionada(especialidade);
  };

  return (
    <div className="min-h-screen bg-white p-4">
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
            <CardTitle className="text-2xl font-bold text-teal-800">Iniciar Consulta</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!especialidadeSelecionada ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-teal-700 mb-4">Selecione a Especialidade*</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Botões de especialidade - versão com 5 opções */}
                {[
                  { id: "medicina", label: "Medicina", icon: Stethoscope },
                  { id: "psicologia", label: "Psicologia", icon: Brain },
                  { id: "educacao-fisica", label: "Educação Física", icon: Dumbbell },
                  { id: "nutricao", label: "Nutrição", icon: Apple },
                  { id: "enfermagem", label: "Enfermagem", icon: Stethoscope },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selecionarEspecialidade(item.id)}
                    className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                      especialidadeSelecionada === item.id
                        ? "border-2 border-teal-500 bg-teal-50"
                        : "border-teal-200 hover:border-teal-500 hover:border-2"
                    }`}
                  >
                    <item.icon className="h-8 w-8 mb-2 text-teal-600" />
                    <span className="text-teal-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setEspecialidadeSelecionada(null)}
                  className="text-teal-600 hover:bg-teal-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para especialidades
                </Button>
              </div>

              {/* Formulário específico da especialidade */}
              {especialidadeSelecionada === "medicina" && <FormularioMedicina form={form} />}
              {especialidadeSelecionada === "psicologia" && <FormularioPsicologia form={form} />}
              {especialidadeSelecionada === "educacao-fisica" && <FormularioEducacaoFisica form={form} />}
              {especialidadeSelecionada === "nutricao" && <FormularioNutricao form={form} />}
              {especialidadeSelecionada === "enfermagem" && <FormularioEnfermagem form={form} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaForm;