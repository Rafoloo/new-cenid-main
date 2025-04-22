"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const AntropometriaSchema = z.object({
  pacienteId: z.string().min(1, "ID do paciente é obrigatório"),
  nomePaciente: z.string().min(1, "Nome do paciente é obrigatório"),
  dataAvaliacao: z.string().min(1, "Data da avaliação é obrigatória"),

  // Medidas Básicas
  peso_corporal: z.number().optional(),
  estatura_metros: z.number().optional(),
  circunferencia_pescoco: z.number().optional(),
  circunferencia_braco: z.number().optional(),
  circunferencia_coxa: z.number().optional(),
  circunferencia_panturrilha: z.number().optional(),

  // Dobras Cutâneas
  dobra_sobescapular: z.number().optional(),
  dobra_tricipal: z.number().optional(),
  dobra_suprailica: z.number().optional(),
  dobra_abdominal: z.number().optional(),
  dobra_coxa_med: z.number().optional(),
  dobra_panturrilha: z.number().optional(),

  // Resultados calculados
  imc: z.number().optional(),
  percentual_gordura: z.number().optional(),
  massa_magra: z.number().optional(),
  area_muscular_braco: z.number().optional(),

  // Classificações
  classificacao_peso: z.string().optional(),
  classificacao_estatura: z.string().optional(),
  classificacao_imc: z.string().optional(),
  classificacao_gordura: z.string().optional(),

  // Observações
  observacoes: z.string().optional(),
})

type AntropometriaData = z.infer<typeof AntropometriaSchema>

export default function AntropometriaForm() {
  const [calculando, setCalculando] = useState(false)

  const form = useForm<AntropometriaData>({
    resolver: zodResolver(AntropometriaSchema),
    defaultValues: {
      pacienteId: "",
      nomePaciente: "",
      dataAvaliacao: new Date().toISOString().split("T")[0],
      peso_corporal: undefined,
      estatura_metros: undefined,
      circunferencia_pescoco: undefined,
      circunferencia_braco: undefined,
      circunferencia_coxa: undefined,
      circunferencia_panturrilha: undefined,
      dobra_sobescapular: undefined,
      dobra_tricipal: undefined,
      dobra_suprailica: undefined,
      dobra_abdominal: undefined,
      dobra_coxa_med: undefined,
      dobra_panturrilha: undefined,
      imc: undefined,
      percentual_gordura: undefined,
      massa_magra: undefined,
      area_muscular_braco: undefined,
      classificacao_peso: "",
      classificacao_estatura: "",
      classificacao_imc: "",
      classificacao_gordura: "",
      observacoes: "",
    },
  })

  const calcularIMC = () => {
    const peso = form.getValues("peso_corporal")
    const altura = form.getValues("estatura_metros")

    if (peso && altura) {
      const imc = peso / (altura * altura)
      form.setValue("imc", Number.parseFloat(imc.toFixed(2)))

      // Classificação básica de IMC
      let classificacao = ""
      if (imc < 18.5) classificacao = "Abaixo do peso"
      else if (imc < 25) classificacao = "Peso normal"
      else if (imc < 30) classificacao = "Sobrepeso"
      else if (imc < 35) classificacao = "Obesidade Grau I"
      else if (imc < 40) classificacao = "Obesidade Grau II"
      else classificacao = "Obesidade Grau III"

      form.setValue("classificacao_imc", classificacao)
    }
  }

  const calcularPercentualGordura = () => {
    // Exemplo simplificado de cálculo de percentual de gordura usando dobras cutâneas
    // Na prática, existem várias fórmulas diferentes dependendo do sexo, idade, etc.
    const dobra1 = form.getValues("dobra_tricipal") || 0
    const dobra2 = form.getValues("dobra_sobescapular") || 0
    const dobra3 = form.getValues("dobra_suprailica") || 0
    const dobra4 = form.getValues("dobra_abdominal") || 0

    if (dobra1 && dobra2 && dobra3 && dobra4) {
      // Fórmula simplificada para exemplo
      const somaDobrasCutaneas = dobra1 + dobra2 + dobra3 + dobra4
      const percentualGordura =
        0.29288 * somaDobrasCutaneas - 0.0005 * somaDobrasCutaneas * somaDobrasCutaneas + 0.15845 * 30 - 5.76377

      form.setValue("percentual_gordura", Number.parseFloat(percentualGordura.toFixed(2)))

      // Cálculo da massa magra
      const peso = form.getValues("peso_corporal")
      if (peso) {
        const massaMagra = peso * (1 - percentualGordura / 100)
        form.setValue("massa_magra", Number.parseFloat(massaMagra.toFixed(2)))
      }
    }
  }

  const calcularAreaMuscularBraco = () => {
    const circunferenciaBraco = form.getValues("circunferencia_braco")
    const dobraTricipital = form.getValues("dobra_tricipal")

    if (circunferenciaBraco && dobraTricipital) {
      // Fórmula para área muscular do braço
      const circunferenciaBracoCm = circunferenciaBraco
      const dobraTricipitalCm = dobraTricipital / 10 // Convertendo de mm para cm

      const areaMuscularBraco = Math.pow(circunferenciaBracoCm - Math.PI * dobraTricipitalCm, 2) / (4 * Math.PI)
      form.setValue("area_muscular_braco", Number.parseFloat(areaMuscularBraco.toFixed(2)))
    }
  }

  const calcularTodos = () => {
    setCalculando(true)
    calcularIMC()
    calcularPercentualGordura()
    calcularAreaMuscularBraco()
    setTimeout(() => setCalculando(false), 500)
  }

  const onSubmit = (data: AntropometriaData) => {
    console.log("Dados da avaliação antropométrica:", data)
    // Aqui você implementaria a lógica para salvar os dados no banco de dados
    alert("Avaliação antropométrica salva com sucesso!")
  }

  return (
    <Card className="max-w-4xl mx-auto my-8 shadow-md">
      <CardHeader className="bg-teal-50">
        <CardTitle className="text-xl font-semibold text-teal-800">Avaliação Antropométrica</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados do Paciente */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados do Paciente</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="pacienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">ID do Paciente</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o ID do paciente" className="border-teal-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomePaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Nome do Paciente</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do paciente" className="border-teal-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataAvaliacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Data da Avaliação</FormLabel>
                      <FormControl>
                        <Input type="date" className="border-teal-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Medidas Antropométricas */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Medidas Antropométricas</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="peso_corporal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Peso Corporal (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Digite o peso"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estatura_metros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Estatura (metros)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Digite a estatura"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="circunferencia_pescoco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência do Pescoço (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="circunferencia_braco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência do Braço (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="circunferencia_coxa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência da Coxa (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="circunferencia_panturrilha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência da Panturrilha (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Dobras Cutâneas */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dobras Cutâneas</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dobra_sobescapular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra Subescapular (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dobra_tricipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra Tricipital (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dobra_suprailica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra Suprailíaca (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dobra_abdominal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra Abdominal (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dobra_coxa_med"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra da Coxa Medial (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dobra_panturrilha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra da Panturrilha (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  onClick={calcularTodos}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={calculando}
                >
                  {calculando ? "Calculando..." : "Calcular Resultados"}
                </Button>
              </div>
            </section>

            {/* Resultados */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Resultados</h2>
              <Separator className="bg-teal-200" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-teal-800">Medida</TableHead>
                    <TableHead className="font-medium text-teal-800">Valor</TableHead>
                    <TableHead className="font-medium text-teal-800">Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>IMC (kg/m²)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="imc"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="classificacao_imc"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Percentual de Gordura (%)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="percentual_gordura"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="classificacao_gordura"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Massa Magra (%)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="massa_magra"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="text" className="border-teal-300 h-8" readOnly />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* Classificação Corporal */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Classificação Corporal por Medidas Antropométricas</h2>
              <Separator className="bg-teal-200" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-teal-800">Medida</TableHead>
                    <TableHead className="font-medium text-teal-800">Valores</TableHead>
                    <TableHead className="font-medium text-teal-800">Percentil</TableHead>
                    <TableHead className="font-medium text-teal-800">z-Escore</TableHead>
                    <TableHead className="font-medium text-teal-800">Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Área Muscular do Braço (cm²)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="area_muscular_braco"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="Percentil" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="z-Escore" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" className="border-teal-300 h-8" placeholder="Classificação" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>% Gordura Corporal - Dobras (%)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        className="border-teal-300 h-8"
                        value={form.watch("percentual_gordura") || ""}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="Percentil" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="z-Escore" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" className="border-teal-300 h-8" placeholder="Classificação" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Massa Magra (%)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        className="border-teal-300 h-8"
                        value={form.watch("massa_magra") || ""}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="Percentil" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.01" className="border-teal-300 h-8" placeholder="z-Escore" />
                    </TableCell>
                    <TableCell>
                      <Input type="text" className="border-teal-300 h-8" placeholder="Classificação" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>

            {/* Observações */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Observações</h2>
              <Separator className="bg-teal-200" />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Observações Adicionais</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[100px] p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digite observações adicionais sobre a avaliação antropométrica"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="anexar" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Anexar Documentos</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          className="opacity-0 absolute w-full h-full cursor-pointer"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        />
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2">
                          Escolher Arquivo
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </section>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                Salvar Avaliação Antropométrica
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
