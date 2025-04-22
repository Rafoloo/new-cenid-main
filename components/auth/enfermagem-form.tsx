"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

const EnfermagemSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  acompanhante: z.string().optional(),
  glicemiaChegada: z.string().optional(),

  // Registro de glicemia
  registroGlicemia: z
    .array(
      z.object({
        data: z.string().optional(),
        hora: z.string().optional(),
        glicemia: z.string().optional(),
      }),
    )
    .optional(),

  // Uso de medicamentos
  usoMedicamento: z.string().default("NÃO"),
  medicamentos: z
    .array(
      z.object({
        nome: z.string().optional(),
        dose: z.string().optional(),
        finalidade: z.string().optional(),
      }),
    )
    .optional(),

  // Diurese
  diurese: z.string().optional(),

  // Evacuação
  evacuacao: z.string().optional(),

  // Pressão arterial
  pressaoArterialSistolica: z.string().optional(),
  pressaoArterialDiastolica: z.string().optional(),
  frequenciaCardiaca: z.string().optional(),

  // Padrão neuropático
  formigamentoPernaDireita: z.boolean().default(false),
  formigamentoPernaEsquerda: z.boolean().default(false),
  formigamentoPeDireito: z.boolean().default(false),
  formigamentoPeEsquerdo: z.boolean().default(false),
  doresMembrosInferiores: z.boolean().default(false),
  edemaMembrosInferiores: z.boolean().default(false),
  claudicacaoNeurogenica: z.boolean().default(false),

  // Padrão oftalmológico
  embacamentoVisual: z.boolean().default(false),
  usoOculos: z.boolean().default(false),
  pruridoOcular: z.boolean().default(false),
  exameFundoOlho: z.boolean().default(false),

  // Lipodistrofia
  lipodistrofiaBracoDireito: z.boolean().default(false),
  lipodistrofiaBracoEsquerdo: z.boolean().default(false),
  lipodistrofiaAbdomen: z.boolean().default(false),
  lipodistrofiaNadegaDireita: z.boolean().default(false),
  lipodistrofiaNadegaEsquerda: z.boolean().default(false),
  lipodistrofiaCoxaDireita: z.boolean().default(false),
  lipodistrofiaCoxaEsquerda: z.boolean().default(false),

  // Alterações dos pés
  anidrose: z.boolean().default(false),
  atrofiaInterossea: z.boolean().default(false),
  calos: z.boolean().default(false),
  fissuras: z.boolean().default(false),
  haluxValgo: z.boolean().default(false),
  hiperacetose: z.boolean().default(false),
  hiperpigmentacao: z.boolean().default(false),
  micoseInterdigital: z.boolean().default(false),
  onicomicose: z.boolean().default(false),
  peCavo: z.boolean().default(false),
  peCharcot: z.boolean().default(false),
  peGarra: z.boolean().default(false),
  pePlano: z.boolean().default(false),
  proeminenciaMetatarsiana: z.boolean().default(false),
  acentuacaoArcoPlantar: z.boolean().default(false),
  lesoes: z.boolean().default(false),
  unhaEncravada: z.boolean().default(false),

  // Hipótese diagnóstica
  hipoteseDiagnostica: z.string().optional(),

  // Responsável
  nomeProfessor: z.string().optional(),
  crmProfessor: z.string().optional(),
  emailProfessor: z.string().optional(),
  telefoneProfessor: z.string().optional(),

  // Anexo
  anexo: z.any().optional(),
})

type EnfermagemFormValues = z.infer<typeof EnfermagemSchema>

export default function FormularioEnfermagem() {
  const [fileError, setFileError] = useState<string | null>(null)

  const form = useForm<EnfermagemFormValues>({
    resolver: zodResolver(EnfermagemSchema),
    defaultValues: {
      registroGlicemia: [
        { data: "", hora: "", glicemia: "" },
        { data: "", hora: "", glicemia: "" },
        { data: "", hora: "", glicemia: "" },
      ],
      medicamentos: [
        { nome: "", dose: "", finalidade: "" },
        { nome: "", dose: "", finalidade: "" },
        { nome: "", dose: "", finalidade: "" },
      ],
      usoMedicamento: "NÃO",
    },
  })

  const onSubmit = (data: EnfermagemFormValues) => {
    console.log(data)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1000000) {
      const fileSizeMB = file.size / 1000000
      setFileError(
        `O tamanho do arquivo deve ser no máximo 1MB. O arquivo atual tem o tamanho ${fileSizeMB.toFixed(2)} MB`,
      )
    } else {
      setFileError(null)
      onChange(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Dados do Paciente */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Dados do Paciente</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Nome do Paciente</FormLabel>
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
            <FormField
              control={form.control}
              name="acompanhante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Acompanhante da consulta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do acompanhante"
                      className="border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="glicemiaChegada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Glicemia de chegada</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o valor da glicemia"
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

        {/* Registro de Glicemia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Registro da glicemia dos últimos 3 dias</h3>
          <Separator className="bg-teal-200" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-teal-800">Data</TableHead>
                  <TableHead className="text-teal-800">Hora</TableHead>
                  <TableHead className="text-teal-800">Glicemia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[0, 1, 2].map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`registroGlicemia.${index}.data`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" className="border-teal-300 focus:ring-teal-500" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`registroGlicemia.${index}.hora`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`registroGlicemia.${index}.glicemia`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Digite o valor"
                                className="border-teal-300 focus:ring-teal-500"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Uso de Medicamentos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Uso de Medicamentos</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="usoMedicamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">Está fazendo uso de algum medicamento além da insulina?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NÃO" id="nao-medicamento" />
                      <FormLabel htmlFor="nao-medicamento" className="font-normal">
                        Não
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SIM" id="sim-medicamento" />
                      <FormLabel htmlFor="sim-medicamento" className="font-normal">
                        Sim, se sim preencher os dados no quadro abaixo
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("usoMedicamento") === "SIM" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-teal-800">Nome do medicamento</TableHead>
                    <TableHead className="text-teal-800">Dose (descrição)</TableHead>
                    <TableHead className="text-teal-800">Finalidade do medicamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[0, 1, 2].map((index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.nome`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Digite o nome"
                                  className="border-teal-300 focus:ring-teal-500"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.dose`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Digite a dose"
                                  className="border-teal-300 focus:ring-teal-500"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.finalidade`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Digite a finalidade"
                                  className="border-teal-300 focus:ring-teal-500"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Diurese */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Diurese (Urina)</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="diurese"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Oligúria" id="oliguria" />
                      <FormLabel htmlFor="oliguria" className="font-normal">
                        <span className="font-semibold">Oligúria</span> - (produção de urina entre 100ml a 400ml no
                        período de 24 horas).
                      </FormLabel>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Poliúria" id="poliuria" />
                      <FormLabel htmlFor="poliuria" className="font-normal">
                        <span className="font-semibold">Poliúria</span> - aumento do volume urinário
                      </FormLabel>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Disúria" id="disuria" />
                      <FormLabel htmlFor="disuria" className="font-normal">
                        <span className="font-semibold">Disúria</span> - dificuldade para urinar que pode ser
                        acompanhada de dor
                      </FormLabel>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Polaciúria" id="polaciuria" />
                      <FormLabel htmlFor="polaciuria" className="font-normal">
                        <span className="font-semibold">Polaciúria</span> - aumento da frequência das micções, ou seja,
                        micções com intervalos menores que o habitual
                      </FormLabel>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Nictúria" id="nicturia" />
                      <FormLabel htmlFor="nicturia" className="font-normal">
                        <span className="font-semibold">Nictúria</span> - são aqueles que se levantam pelo menos duas
                        vezes por noite para urinar
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Evacuação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Evacuação (Dejeção de fezes)</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="evacuacao"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Diário" id="diario" />
                      <FormLabel htmlFor="diario" className="font-normal">
                        <span className="font-semibold">Diário</span>
                      </FormLabel>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="Constipação" id="constipacao" />
                      <FormLabel htmlFor="constipacao" className="font-normal">
                        <span className="font-semibold">Constipação</span> - menos de três evacuações por semana
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pressão Arterial */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            Pressão arterial & frequência cardíaca de repouso (sentado após 3 minutos de repouso)
          </h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="pressaoArterialSistolica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Pressão Arterial Sistólica (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o valor"
                      className="border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pressaoArterialDiastolica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Pressão Arterial Diastólica (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o valor"
                      className="border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequenciaCardiaca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Frequência Cardíaca (bpm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o valor"
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

        {/* Padrão Neuropático */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Padrão Neuropático</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="formigamentoPernaDireita"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Formigamento na perna direita</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formigamentoPernaEsquerda"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Formigamento na perna esquerda</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formigamentoPeDireito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Formigamento no pé direito</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formigamentoPeEsquerdo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Formigamento no pé esquerdo</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doresMembrosInferiores"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Dores nos membros inferiores</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edemaMembrosInferiores"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Edema (inchaço) nos membros inferiores</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="claudicacaoNeurogenica"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Claudicação neurogênica - é caracterizada por dor glútea, sensação de peso nas pernas que piora em
                    pé ou andando e tipicamente melhora sentado. Com frequência é relatado fraqueza nas pernas e
                    sensação de formigamento nas plantas dos pés.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Padrão Oftalmológico */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Padrão Oftalmológico</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="embacamentoVisual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Embaçamento visual</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usoOculos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Uso de óculos</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pruridoOcular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Prurido ocular - coceira em olho</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exameFundoOlho"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Realizou exame de fundo de olho - A (Fundoscopia) direta é um exame clínico para análise do nervo
                    óptico e mácula. Sim, anexar exame.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="anexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">Anexar exame de fundo de olho</FormLabel>
                <div className="border-2 border-dashed border-teal-200 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-teal-400 mb-2" />
                  <p className="text-sm text-teal-600 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="max-w-xs border-teal-300 focus:ring-teal-500"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                    />
                  </FormControl>
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Avaliação da Lipodistrofia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Avaliação da Lipodistrofia</h3>
          <Separator className="bg-teal-200" />
          <p className="text-sm text-teal-700 mb-4">
            A Lipodistrofia causa um acúmulo de gordura na região na qual a insulina foi aplicada repetidas vezes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lipodistrofiaBracoDireito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Braço direito</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaBracoEsquerdo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Braço esquerdo</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaAbdomen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Abdômen</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaNadegaDireita"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Nádega direita</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaNadegaEsquerda"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Nádega esquerda</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaCoxaDireita"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Coxa direita</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipodistrofiaCoxaEsquerda"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="font-normal">Coxa esquerda</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Alterações dos pés */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Alterações dos pés</h3>
          <Separator className="bg-teal-200" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6 text-teal-800">Alteração</TableHead>
                  <TableHead className="w-1/6 text-teal-800">Presente</TableHead>
                  <TableHead className="w-4/6 text-teal-800">Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Anidrose</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="anidrose"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>É a ausência anormal de suor</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Atrofia Interossea</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="atrofiaInterossea"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    Uma <strong>atrofia</strong> dos músculos metacarpais e hipotenares ocorre em estágios avançados
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Calos</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="calos"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <strong>Calo</strong> no <strong>pé</strong> é uma camada espessa e dura de pele que se forma em
                    resposta à pressão ou atrito constante dos <strong>pés</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fissuras</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="fissuras"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <strong>Fissuras</strong> calcâneas popularmente conhecidas como <strong>pé</strong> rachado, é
                    caracterizada por lesões lineares que surgem na pele
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Halux Valgo</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="haluxValgo"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    É a principal patologia de antepé, acometendo a primeira articulação metatarsofalangeana
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hiperacetose</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="hiperacetose"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>A hiperaqueratose é um espessamento da parte mais externa da epiderme</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hiperpigmentação</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="hiperpigmentacao"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>Quando há aumento na produção de melanina, ocorre escurecimento no tom da pele</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Micose Interdigital</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="micoseInterdigital"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    Infecção fúngica que acomete os espaços <strong>interdigitais</strong> e regiões plantares
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Onicomicose</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="onicomicose"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    É uma infecção causada por fungos que se alimentam da queratina, proteína que forma a maior parte
                    das unhas
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pé Cavo</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="peCavo"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    O <strong>pé cavo</strong> é uma alteração estrutural em que o arco natural da planta do{" "}
                    <strong>pé</strong> apresenta uma curvatura excessiva
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pé de Charcot</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="peCharcot"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    É uma deformidade nos ossos e articulações associados a perda de sensibilidade protetora e a traumas
                    repetitivos
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pé em Garra</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="peGarra"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    Deformidades dos dedos menores do <strong>pé</strong> (dedos em <strong>garra</strong>)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pé Plano</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="pePlano"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>Condição em que toda a sola do pé toca no chão quando o indivíduo está de pé</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Proeminência Metatarsiana</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="proeminenciaMetatarsiana"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500"/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    Metatarsalgia é um termo geral que se refere a uma condição dolorosa na região do metatarso do pé
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Acentuação do Arco Plantar</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="acentuacaoArcoPlantar"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <strong>Arco Plantar</strong>, a curva que surge durante a infância tem a função de distribuir o
                    peso do corpo e ajudar na absorção de impactos
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lesões</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="lesoes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Unha Encravada</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="unhaEncravada"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>Condição na qual o canto ou lado de uma unha cresce na carne</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Hipótese Diagnóstica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Hipótese Diagnóstica Geral</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="hipoteseDiagnostica"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">
                  Apresentação do resumo dos achados da avaliação clínica do paciente
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a hipótese diagnóstica..."
                    className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Responsável pela avaliação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Professor responsável</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nomeProfessor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do professor"
                      className="border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crmProfessor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">CRM</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o CRM" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailProfessor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite o email"
                      className="border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefoneProfessor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o telefone" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
            Salvar Avaliação
          </Button>
        </div>
      </form>
    </Form>
  )
}
