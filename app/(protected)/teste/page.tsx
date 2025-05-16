"use client"

import { useState } from "react"
import { Activity, Brain, Dumbbell, Apple, Pill, FlaskConical } from "lucide-react"
import FormularioMedicina from "@/components/auth/medicina-form";
import FormularioPsicologia from "@/components/auth/psicologia-form";
import FormularioEducacaoFisica from "@/components/auth/fisica-form";
import FormularioNutricao from "@/components/auth/nutricao-form";
import FormularioFarmacia from "@/components/auth/farmacia-form";
import FormularioBioquimica from "@/components/auth/bioquimica-form"; // Import do formulário de Química
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string | null>(null)

  const selecionarEspecialidade = (especialidade: string) => {
    setEspecialidadeSelecionada(especialidade === especialidadeSelecionada ? null : especialidade)
  }

  return (
      <div className="max-w-5xl mx-auto p-4">
        <Card className="shadow-lg rounded-lg border border-gray-200 mb-6">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-2xl font-bold text-teal-800">Cadastro de Consulta</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-teal-700 mb-4">Selecione a Especialidade*</h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Botões existentes */}
                <button
                  onClick={() => selecionarEspecialidade("medicina")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "medicina"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <Activity className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Medicina</span>
                </button>
                <button
                  onClick={() => selecionarEspecialidade("psicologia")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "psicologia"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <Brain className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Psicologia</span>
                </button>
                <button
                  onClick={() => selecionarEspecialidade("educacao-fisica")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "educacao-fisica"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <Dumbbell className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Educação Física</span>
                </button>
                <button
                  onClick={() => selecionarEspecialidade("nutricao")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "nutricao"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <Apple className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Nutrição</span>
                </button>
                <button
                  onClick={() => selecionarEspecialidade("farmacia")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "farmacia"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <Pill className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Farmácia</span>
                </button>
                {/* Novo botão para Química */}
                <button
                  onClick={() => selecionarEspecialidade("bioquimica")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                    especialidadeSelecionada === "bioquimica"
                      ? "border-2 border-teal-500 bg-teal-50"
                      : "border-teal-200 hover:border-teal-500 hover:border-2"
                  }`}
                >
                  <FlaskConical className="h-8 w-8 mb-2 text-teal-600" />
                  <span className="text-teal-800">Bioquímica</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {especialidadeSelecionada && (
          <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-2xl font-bold text-teal-800">
                Formulário de Consulta -{" "}
                {especialidadeSelecionada === "medicina"
                  ? "Medicina"
                  : especialidadeSelecionada === "psicologia"
                    ? "Psicologia"
                    : especialidadeSelecionada === "educacao-fisica"
                      ? "Educação Física"
                      : especialidadeSelecionada === "nutricao"
                        ? "Nutrição"
                        : especialidadeSelecionada === "farmacia"
                          ? "Farmácia"
                          : "Bioquímica"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {especialidadeSelecionada === "medicina" && <FormularioMedicina />}
              {especialidadeSelecionada === "psicologia" && <FormularioPsicologia />}
              {especialidadeSelecionada === "educacao-fisica" && <FormularioEducacaoFisica />}
              {especialidadeSelecionada === "nutricao" && <FormularioNutricao />}
              {especialidadeSelecionada === "farmacia" && <FormularioFarmacia />}
              {especialidadeSelecionada === "bioquimica" && <FormularioBioquimica />}
            </CardContent>
          </Card>
        )}

        {especialidadeSelecionada && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
              onClick={() => setEspecialidadeSelecionada(null)}
            >
              Voltar para seleção de especialidade
            </Button>
          </div>
        )}
      </div>
  )
}
