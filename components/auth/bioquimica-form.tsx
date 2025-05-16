"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Lista de medidas bioquímicas
const medidas = [
  { nome: "Glicemia", unidade: "mg/dL" },
  { nome: "HbA1c", unidade: "%" },
  { nome: "Colesterol total", unidade: "mg/dL" },
  { nome: "Triglicerídeo", unidade: "mg/dL" },
  { nome: "LDL", unidade: "mg/dL" },
  { nome: "HDL", unidade: "mg/dL" },
  { nome: "Peptídeo C", unidade: "" },
  { nome: "Vitamina D", unidade: "" },
  { nome: "Albumina sérica", unidade: "g/dL" },
  { nome: "Albumina Urinária", unidade: "g/dL" },
  { nome: "Creatinina sérica", unidade: "mg/dL" },
  { nome: "Creatinina urinária", unidade: "mg/dL" },
  { nome: "Microalbuminuria", unidade: "" },
  { nome: "Relação Alb/Creat", unidade: "" },
  { nome: "TGO", unidade: "" },
  { nome: "TGP", unidade: "" },
  { nome: "TSH", unidade: "" },
  { nome: "T4L", unidade: "" },
  { nome: "Clearance de creatinina", unidade: "" },
  { nome: "Cortisol", unidade: "µg/dL" },
]

// Definição do schema para validação
const BioquimicaSchema = z.object({
  dataConsulta: z.date().optional(),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  idade: z.string().optional(),

  // Valores para cada medida e data
  valores: z.array(
    z.object({
      medidaId: z.number(),
      data1: z.string().optional(),
      data2: z.string().optional(),
      data3: z.string().optional(),
      data4: z.string().optional(),
      data5: z.string().optional(),
    }),
  ) as z.ZodArray<
    z.ZodObject<{
      medidaId: z.ZodNumber;
      data1: z.ZodOptional<z.ZodString>;
      data2: z.ZodOptional<z.ZodString>;
      data3: z.ZodOptional<z.ZodString>;
      data4: z.ZodOptional<z.ZodString>;
      data5: z.ZodOptional<z.ZodString>;
    }>
  >,

  // Datas das colunas
  datas: z.array(z.date().optional()).length(5),
})

type BioquimicaFormValues = z.infer<typeof BioquimicaSchema>

export default function FormularioBioquimica() {
  // Inicializar o formulário com valores padrão
  const form = useForm<BioquimicaFormValues>({
    resolver: zodResolver(BioquimicaSchema),
    defaultValues: {
      datas: [undefined, undefined, undefined, undefined, undefined],
      valores: medidas.map((medida, index) => ({
        medidaId: index,
        data1: "",
        data2: "",
        data3: "",
        data4: "",
        data5: "",
      })),
    },
  })

  const onSubmit = (data: BioquimicaFormValues) => {
    console.log(data)
    // Aqui você pode implementar a lógica para salvar os dados
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            {/* Cabeçalho */}

            {/* Seção de Avaliação Médica */}
            <div className="grid grid-cols-2 border border-gray-300 mb-4">
              <div className="p-3 text-center font-semibold border-r border-gray-300 flex items-center justify-center">
                AVALIAÇÃO MÉDICA
              </div>
              <div className="p-3">
                <FormField
                  control={form.control}
                  name="dataConsulta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-teal-800">Data da consulta</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            type="date"
                            className="border-teal-300 focus:ring-teal-500"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : undefined
                              field.onChange(date)
                            }}
                          />
                        </FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="border-teal-300 focus:ring-teal-500">
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dados do Paciente */}
            <div className="grid grid-cols-2 border border-gray-300 mb-4">
              <div className="p-3">
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo"
                          className="border-teal-300 focus:ring-teal-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-3 border-l border-gray-300">
                <FormField
                  control={form.control}
                  name="idade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Idade (anos)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Digite a idade"
                          className="border-teal-300 focus:ring-teal-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-gray-200 p-3 text-center text-sm border border-gray-300 mb-4">
              Controle glicêmico e exames laboratorias (o exame completo escanear ou fotografar e anexar a pasta do
              paciente). Preencher novas datas sem apagar exames anteriores
            </div>

            {/* Tabela de Medidas */}
            <div className="border border-gray-300 mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 text-teal-800 w-1/6">Medidas</TableHead>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <TableHead key={index} className="bg-gray-100 text-teal-800">
                        <FormField
                          control={form.control}
                          name={`datas.${index}`}
                          render={({ field }) => (
                            <FormItem className="mb-0">
                              <FormLabel className="text-teal-800 block mb-1">DATA:</FormLabel>
                              <div className="flex space-x-1">
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="border-teal-300 focus:ring-teal-500 h-8 text-sm"
                                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                    onChange={(e) => {
                                      const date = e.target.value ? new Date(e.target.value) : undefined
                                      field.onChange(date)
                                    }}
                                  />
                                </FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="border-teal-300 focus:ring-teal-500 h-8 w-8"
                                    >
                                      <CalendarIcon className="h-3 w-3" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                      initialFocus
                                      locale={ptBR}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medidas.map((medida, medidaIndex) => (
                    <TableRow key={medidaIndex}>
                      <TableCell className="font-medium">
                        {medida.nome} {medida.unidade && `(${medida.unidade})`}
                      </TableCell>
                      {[1, 2, 3, 4, 5].map((dataIndex) => (
                        <TableCell key={dataIndex}>
                          <FormField
                            control={form.control}
                            name={`valores.${medidaIndex}.data${dataIndex}` as keyof BioquimicaFormValues}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder=""
                                    className="border-teal-300 focus:ring-teal-500"
                                    value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-teal-300 text-teal-700"
                onClick={() => form.reset()}
              >
                Limpar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                Salvar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
