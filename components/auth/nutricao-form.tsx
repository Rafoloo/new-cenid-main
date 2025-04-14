"use client"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const NutricaoSchema = z
  .object({
    nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
    idade: z.string().optional(),
    idadeMeses: z.string().optional(),

    // Método de contagem de carboidrato
    metodoContagem: z.string().optional(),
    nomeAplicativo: z.string().optional(),

    // Frequência alimentar
    frequenciaAlimentar: z
      .record(
        z.object({
          tipo: z.string().optional(),
          valor: z.string().optional(),
        }),
      )
      .optional(),

    // Recordatório alimentar
    recordatorioAlimentar: z.string().optional(),
    anexoRecordatorio: z.any().optional(),

    // Avaliação nutricional
    avaliacaoNutricional: z.string().optional(),

    // Recomendações
    recomendacoes: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.metodoContagem ||
      data.metodoContagem !== "aplicativos" ||
      (data.nomeAplicativo && data.nomeAplicativo !== ""),
    {
      message: "O nome do aplicativo deve ser especificado quando o método de contagem é por aplicativos",
      path: ["nomeAplicativo"],
    },
  )

type NutricaoFormValues = z.infer<typeof NutricaoSchema>

export default function FormularioNutricao() {
  const form = useForm<NutricaoFormValues>({
    resolver: zodResolver(NutricaoSchema),
    defaultValues: {
      frequenciaAlimentar: {
        paoMassas: { tipo: "", valor: "" },
        arrozCereais: { tipo: "", valor: "" },
        tuberculos: { tipo: "", valor: "" },
        frutasSucosNaturais: { tipo: "", valor: "" },
        verduras: { tipo: "", valor: "" },
        legumes: { tipo: "", valor: "" },
        carneVermelha: { tipo: "", valor: "" },
        aves: { tipo: "", valor: "" },
        peixes: { tipo: "", valor: "" },
        ovos: { tipo: "", valor: "" },
        leiteDerivados: { tipo: "", valor: "" },
        leguminosas: { tipo: "", valor: "" },
        embutidos: { tipo: "", valor: "" },
        frituras: { tipo: "", valor: "" },
        lanches: { tipo: "", valor: "" },
        doces: { tipo: "", valor: "" },
        refrigerante: { tipo: "", valor: "" },
        chips: { tipo: "", valor: "" },
        adocantes: { tipo: "", valor: "" },
        sucoPo: { tipo: "", valor: "" },
        alimentosProntos: { tipo: "", valor: "" },
      },
    },
  })

  const onSubmit = (data: NutricaoFormValues) => {
    console.log(data)
  }

  const atualizarFrequenciaAlimentar = (alimento: string, campo: string, valor: string) => {
    const frequenciaAlimentar = form.getValues("frequenciaAlimentar") || {}
    form.setValue("frequenciaAlimentar", {
      ...frequenciaAlimentar,
      [alimento]: {
        ...frequenciaAlimentar[alimento],
        [campo]: valor,
      },
    })
  }

  const alimentosFrequencia = [
    { id: "paoMassas", nome: "Pão e massas" },
    { id: "arrozCereais", nome: "Arroz e cereais" },
    { id: "tuberculos", nome: "Tubérculos" },
    { id: "frutasSucosNaturais", nome: "Frutas e sucos naturais" },
    { id: "verduras", nome: "Verduras" },
    { id: "legumes", nome: "Legumes" },
    { id: "carneVermelha", nome: "Carne Vermelha" },
    { id: "aves", nome: "Aves" },
    { id: "peixes", nome: "Peixes" },
    { id: "ovos", nome: "Ovos" },
    { id: "leiteDerivados", nome: "Leite e produtos lácteos" },
    { id: "leguminosas", nome: "Leguminosas (ex: feijão, soja, grão-de-bico, etc.)" },
    { id: "embutidos", nome: "Embutidos (ex: salsicha, linguiça, etc.)" },
    { id: "frituras", nome: "Frituras" },
    { id: "lanches", nome: "Lanches" },
    { id: "doces", nome: "Doces" },
    { id: "refrigerante", nome: "Refrigerante" },
    { id: "chips", nome: 'Salgadinho tipo "chips"' },
    { id: "adocantes", nome: "Adoçantes" },
    { id: "sucoPo", nome: "Suco em pó" },
    { id: "alimentosProntos", nome: "Alimentos prontos (ex: miojo)" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Dados do Paciente */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Dados do Paciente</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
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
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Idade (anos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Calculado automaticamente"
                      className="border-teal-300 focus:ring-teal-500"
                      readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idadeMeses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Idade (meses)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Calculado automaticamente"
                      className="border-teal-300 focus:ring-teal-500"
                      readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Razão de CHO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Razão de CHO</h3>
          <Separator className="bg-teal-200" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-teal-800">Gramas/unidade de insulina</TableHead>
                <TableHead className="text-teal-800">Horário inicial</TableHead>
                <TableHead className="text-teal-800">Horário final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Fator de sensibilidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Fator de sensibilidade (FS)</h3>
          <Separator className="bg-teal-200" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-teal-800">mg/dL por unidade de insulina</TableHead>
                <TableHead className="text-teal-800">Horário inicial</TableHead>
                <TableHead className="text-teal-800">Horário final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Método de Contagem de Carboidrato */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">1- MÉTODO DE CONTAGEM DE CARBOIDRATO</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="metodoContagem"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao-realiza" id="nao-realiza" />
                        <FormLabel htmlFor="nao-realiza" className="font-normal text-teal-800">
                          NÃO REALIZA
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tabelas" id="tabelas" />
                        <FormLabel htmlFor="tabelas" className="font-normal text-teal-800">
                          TABELAS
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aplicativos" id="aplicativos" />
                        <FormLabel htmlFor="aplicativos" className="font-normal text-teal-800">
                          APLICATIVOS
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("metodoContagem") === "aplicativos" && (
              <FormField
                control={form.control}
                name="nomeAplicativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">SE APLICATIVO, QUAL?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome do aplicativo"
                        className="border-teal-300 focus:ring-teal-500 max-w-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Estimativa da Necessidade Energética Diária */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            2- ESTIMATIVA da NECESSIDADE ENERGÉTICA DIÁRIA (NED) (Kcal/dia)
          </h3>
          <Separator className="bg-teal-200" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-teal-800">IDADE/SEXO</TableHead>
                <TableHead className="text-teal-800">NED (Kcal/dia)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-10"></TableCell>
                <TableCell className="h-10"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Análise da Frequência Alimentar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">3- ANÁLISE DA FREQUÊNCIA ALIMENTAR</h3>
          <Separator className="bg-teal-200" />
          <h4 className="text-base font-medium text-teal-700">
            FREQUÊNCIA ALIMENTAR (para mensal e semanal registar número de dias)
          </h4>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-teal-800 w-1/3">Tipos de alimento</TableHead>
                  <TableHead className="text-teal-800 text-center">Nunca</TableHead>
                  <TableHead className="text-teal-800 text-center">Mensal</TableHead>
                  <TableHead className="text-teal-800 text-center">Semanal</TableHead>
                  <TableHead className="text-teal-800 text-center">Diário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alimentosFrequencia.map((alimento) => {
                  const frequenciaAlimentar = form.getValues("frequenciaAlimentar") || {}
                  const alimentoAtual = frequenciaAlimentar[alimento.id] || { tipo: "", valor: "" }

                  return (
                    <TableRow key={alimento.id}>
                      <TableCell className="font-medium">{alimento.nome}</TableCell>
                      <TableCell className="text-center">
                        <RadioGroup
                          value={alimentoAtual.tipo === "nunca" ? "nunca" : ""}
                          onValueChange={(value) => {
                            if (value === "nunca") {
                              atualizarFrequenciaAlimentar(alimento.id, "tipo", "nunca")
                              atualizarFrequenciaAlimentar(alimento.id, "valor", "")
                            }
                          }}
                          className="flex justify-center"
                        >
                          <RadioGroupItem value="nunca" id={`${alimento.id}-nunca`} />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={alimentoAtual.tipo === "mensal" ? alimentoAtual.valor : ""}
                          onChange={(e) => {
                            atualizarFrequenciaAlimentar(alimento.id, "tipo", "mensal")
                            atualizarFrequenciaAlimentar(alimento.id, "valor", e.target.value)
                          }}
                          className="w-full border-teal-300 focus:ring-teal-500"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={alimentoAtual.tipo === "semanal" ? alimentoAtual.valor : ""}
                          onChange={(e) => {
                            atualizarFrequenciaAlimentar(alimento.id, "tipo", "semanal")
                            atualizarFrequenciaAlimentar(alimento.id, "valor", e.target.value)
                          }}
                          className="w-full border-teal-300 focus:ring-teal-500"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <RadioGroup
                          value={alimentoAtual.tipo === "diario" ? "diario" : ""}
                          onValueChange={(value) => {
                            if (value === "diario") {
                              atualizarFrequenciaAlimentar(alimento.id, "tipo", "diario")
                              atualizarFrequenciaAlimentar(alimento.id, "valor", "")
                            }
                          }}
                          className="flex justify-center"
                        >
                          <RadioGroupItem value="diario" id={`${alimento.id}-diario`} />
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recordatório Alimentar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">4- RECORDATÓRIO ALIMENTAR</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="anexoRecordatorio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">ANEXAR ARQUIVO</FormLabel>
                <div className="border-2 border-dashed border-teal-200 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-teal-400 mb-2" />
                  <p className="text-sm text-teal-600 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="max-w-xs border-teal-300 focus:ring-teal-500"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <Button type="button" variant="outline" className="mt-4 border-teal-300 text-teal-700">
                    Anexar
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recordatorioAlimentar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">REGISTRAR DADOS DO RECORDATÓRIO ALIMENTAR</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o recordatório alimentar do paciente"
                    className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Resumo do Recordatório Alimentar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">RESUMO DO RECORDATÓRIO ALIMENTAR</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center font-medium text-teal-800">INGERIDO</div>
            <div className="text-center font-medium text-teal-800">RECOMENDADO</div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-teal-800">MACRONUTRIENTES</TableHead>
                  <TableHead className="text-teal-800">Gramas/dia</TableHead>
                  <TableHead className="text-teal-800">Kcal/dia</TableHead>
                  <TableHead className="text-teal-800">Total Kcal/dia</TableHead>
                  <TableHead className="text-teal-800">Gramas/dia(mínimo)</TableHead>
                  <TableHead className="text-teal-800">Gramas/dia(máximo)</TableHead>
                  <TableHead className="text-teal-800">% do VET</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Carboidrato</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Açucar</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Proteína</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gordura Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Saturada</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monoinsaturada</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Polinsaturada</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fibras</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>38</TableCell>
                  <TableCell>não se aplica</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Total de ingestão (Kcal/dia) estimada pelo recordatório alimentar (TIC)
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Avaliação Clínica e Prescrição Dietética */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">AVALIAÇÃO CLÍNICA E PRESCRIÇÃO DIETÉTICA NUTRIÇÃO</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="avaliacaoNutricional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800 font-medium">HIPÓTESE DIAGNÓSTICA NUTRICIONAL</FormLabel>
                  <p className="text-sm text-teal-600 mb-2">
                    Apresentação da avaliação nutricional em relação ao padrão alimentar observado
                  </p>
                  <FormControl>
                    <Textarea
                      placeholder="Apresentação:"
                      className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recomendacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800 font-medium">CONDUTA NUTRICIONAL</FormLabel>
                  <p className="text-sm text-teal-600 mb-2">
                    Descrição das recomendações dietéticas sugeridas aos pacientes
                  </p>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva:"
                      className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                      {...field}
                    />
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
