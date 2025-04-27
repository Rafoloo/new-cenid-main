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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EducacaoFisicaSchema = z
  .object({
    nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
    gestante: z.boolean().default(false),
    trimestre: z.string().optional(),
    semanaGestacao: z.string().optional(),
    lactacao: z.boolean().default(false),
    semanaLactacao: z.string().optional(),
    deficienciaFisica: z.boolean().default(false),
    descricaoDeficiencia: z.string().optional(),

    // Dados antropométricos
    peso: z.string().min(1, "O peso deve ser preenchido"),
    altura: z.string().min(1, "A altura deve ser preenchida"),
    imc: z.string().optional(),
    circunferenciaCintura: z.string().optional(),
    circunferenciaQuadril: z.string().optional(),
    relacaoCinturaQuadril: z.string().optional(),

    // Pressão arterial
    pressaoArterialSistolica: z.string().optional(),
    pressaoArterialDiastolica: z.string().optional(),
    frequenciaCardiaca: z.string().optional(),

    // Nível de atividade física
    nivelAtividadeFisica: z.string().optional(),

    // Avaliação de força
    forcaPreensaoManual: z.string().optional(),
    forcaMembrosSuperior: z.string().optional(),
    forcaMembrosInferior: z.string().optional(),

    // Avaliação de flexibilidade
    flexibilidadeTronco: z.string().optional(),
    flexibilidadeOmbros: z.string().optional(),

    // Avaliação cardiorrespiratória
    vo2max: z.string().optional(),
    testeSelecionado: z.string().optional(),

    // Observações e recomendações
    observacoes: z.string().optional(),
    recomendacoes: z.string().optional(),

    // Anexos
    anexos: z.any().optional(),
  })
  .refine((data) => !data.gestante || (data.trimestre && data.trimestre !== ""), {
    message: "O trimestre deve ser especificado quando gestante",
    path: ["trimestre"],
  })
  .refine((data) => !data.gestante || (data.semanaGestacao && data.semanaGestacao !== ""), {
    message: "A semana de gestação deve ser especificada quando gestante",
    path: ["semanaGestacao"],
  })
  .refine((data) => !data.lactacao || (data.semanaLactacao && data.semanaLactacao !== ""), {
    message: "A semana de lactação deve ser especificada quando amamentando",
    path: ["semanaLactacao"],
  })
  .refine((data) => !data.deficienciaFisica || (data.descricaoDeficiencia && data.descricaoDeficiencia !== ""), {
    message: "A descrição da deficiência deve ser especificada quando há deficiência física",
    path: ["descricaoDeficiencia"],
  })

type EducacaoFisicaFormValues = z.infer<typeof EducacaoFisicaSchema>

export default function FormularioEducacaoFisica() {
  const form = useForm<EducacaoFisicaFormValues>({
    resolver: zodResolver(EducacaoFisicaSchema),
    defaultValues: {
      gestante: false,
      lactacao: false,
      deficienciaFisica: false,
    },
  })

  const onSubmit = (data: EducacaoFisicaFormValues) => {
    console.log(data)
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
          </div>
        </div>

        {/* Gestação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Gestação</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="gestante"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}
                     className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="text-teal-800">Gestante</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("gestante") && (
              <FormField
                control={form.control}
                name="trimestre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Trimestre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escreva o Trimestre"
                        className="border-teal-300 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("gestante") && (
              <FormField
                control={form.control}
                name="semanaGestacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Semana de gestação</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="43"
                        placeholder="Digite o número de semanas"
                        className="border-teal-300 focus:ring-teal-500"
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

        {/* Lactação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Lactação</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="lactacao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}
                     className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="text-teal-800">Lactação (amamentando)</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("lactacao") && (
              <FormField
                control={form.control}
                name="semanaLactacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Semanas de lactação</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o número de semanas"
                        className="border-teal-300 focus:ring-teal-500"
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

        {/* Deficiência Física */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Deficiência Física</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="deficienciaFisica"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}
                     className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
                  </FormControl>
                  <FormLabel className="text-teal-800">Deficiência física</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("deficienciaFisica") && (
              <FormField
                control={form.control}
                name="descricaoDeficiencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descreva a deficiência"
                        className="border-teal-300 focus:ring-teal-500"
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

        {/* Dados Antropométricos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Dados Antropométricos</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Digite o peso"
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
              name="altura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Altura (m)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Digite a altura"
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
              name="imc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">IMC (kg/m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="circunferenciaCintura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Circunferência da Cintura (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Digite a medida"
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
              name="circunferenciaQuadril"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Circunferência do Quadril (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Digite a medida"
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
              name="relacaoCinturaQuadril"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Relação Cintura/Quadril</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
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

        {/* Pressão Arterial e Frequência Cardíaca */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Pressão Arterial e Frequência Cardíaca</h3>
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
                  <FormLabel className="text-teal-800">Frequência Cardíaca de Repouso (bpm)</FormLabel>
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

        {/* Nível de Atividade Física */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Nível de Atividade Física</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="nivelAtividadeFisica"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">Classificação</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sedentario" id="sedentario" />
                      <FormLabel htmlFor="sedentario" className="font-normal">
                        Sedentário (menos de 150 min/semana)
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="irregularmente-ativo" id="irregularmente-ativo" />
                      <FormLabel htmlFor="irregularmente-ativo" className="font-normal">
                        Irregularmente Ativo (150-299 min/semana)
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ativo" id="ativo" />
                      <FormLabel htmlFor="ativo" className="font-normal">
                        Ativo (300+ min/semana)
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Avaliação de Força */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Avaliação de Força</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="forcaPreensaoManual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Força de Preensão Manual (kgf)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
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
              name="forcaMembrosSuperior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Força de Membros Superiores</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fraco">Fraco</SelectItem>
                        <SelectItem value="abaixo-da-media">Abaixo da Média</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="acima-da-media">Acima da Média</SelectItem>
                        <SelectItem value="excelente">Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forcaMembrosInferior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Força de Membros Inferiores</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fraco">Fraco</SelectItem>
                        <SelectItem value="abaixo-da-media">Abaixo da Média</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="acima-da-media">Acima da Média</SelectItem>
                        <SelectItem value="excelente">Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Avaliação de Flexibilidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Avaliação de Flexibilidade</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="flexibilidadeTronco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Flexibilidade de Tronco (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
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
              name="flexibilidadeOmbros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Flexibilidade de Ombros</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limitada">Limitada</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="boa">Boa</SelectItem>
                        <SelectItem value="excelente">Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Avaliação Cardiorrespiratória */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Avaliação Cardiorrespiratória</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="testeSelecionado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Teste Selecionado</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                        <SelectValue placeholder="Selecione o teste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooper">Teste de Cooper</SelectItem>
                        <SelectItem value="vai-vem">Teste de Vai e Vem</SelectItem>
                        <SelectItem value="caminhada-6min">Teste de Caminhada de 6 minutos</SelectItem>
                        <SelectItem value="banco">Teste do Banco</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vo2max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">VO2 máx (ml/kg/min)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
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

        {/* Anexar Exames */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Anexar Exames</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="anexos"
            render={({ field }) => (
              <FormItem>
                <div className="border-2 border-dashed border-teal-200 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-teal-400 mb-2" />
                  <p className="text-sm text-teal-600 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                  <FormControl>
                    <Input
                      type="file"
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
        </div>

        {/* Observações e Recomendações */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Observações e Recomendações</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre a avaliação física"
                      className="min-h-[100px] border-teal-300 focus:ring-teal-500"
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
                  <FormLabel className="text-teal-800">Recomendações de Atividade Física</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Recomendações de atividade física para o paciente"
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
