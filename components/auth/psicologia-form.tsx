"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Activity, AlertCircle, Brain, CalendarIcon, HeartPulse, ClipboardList } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PsicologiaSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  dataAvaliacao: z.string().min(1, "A data da avaliação deve ser selecionada"),
  respostasQualidadeVida: z.array(z.string().optional()).length(33),
  respostasHADS: z.array(z.string().optional()).length(14),
  respostasAnsiedade: z.array(z.number().optional()).length(7),
  respostasDepressao: z.array(z.number().optional()).length(9),
  respostasAutocuidado: z.array(z.number().optional()).length(15),
  hipoteseDiagnostica: z.string().optional(),
  condutaClinica: z.string().optional(),
})

type PsicologiaFormValues = z.infer<typeof PsicologiaSchema>

export default function FormularioPsicologia() {
  const form = useForm<PsicologiaFormValues>({
    resolver: zodResolver(PsicologiaSchema),
    defaultValues: {
      respostasQualidadeVida: Array(33).fill(""),
      respostasHADS: Array(14).fill(""),
      respostasAnsiedade: Array(7).fill(""),
      respostasDepressao: Array(9).fill(""),
      respostasAutocuidado: Array(15).fill(""),
    },
  })

  const onSubmit = (data: PsicologiaFormValues) => {
    console.log(data)
  }

  //calcular ansiedade
  const calcularScoreAnsiedade = (respostas: string[]) => {
    return respostas.map((resposta) => Number.parseInt(resposta || "0")).reduce((total, valor) => total + valor, 0)
  }

  const classificarAnsiedade = (score: number) => {
    if (score < 5) return "Ansiedade Mínima"
    if (score < 10) return "Ansiedade Leve"
    if (score < 15) return "Ansiedade Moderada"
    return "Ansiedade Grave"
  }

  //calcular depressão
  const calcularScoreDepressao = (respostas: string[]) => {
    return respostas.map((resposta) => Number.parseInt(resposta || "0")).reduce((total, valor) => total + valor, 0)
  }

  const classificarDepressao = (score: number) => {
    if (score < 5) return "Ausente"
    if (score < 10) return "Depressão Leve"
    if (score < 15) return "Depressão Moderada"
    if (score < 20) return "Depressão Moderadamente Severa"
    return "Depressão Severa"
  }

  //calcular autocuidado
  const calcularScoreAutocuidado = (respostas: string[]) => {
    return respostas.map((resposta) => Number.parseInt(resposta || "0")).reduce((total, valor) => total + valor, 0)
  }

  const classificarAutocuidado = (score: number) => {
    const percentual = (score / 75) * 100
    if (percentual < 50) return "Inadequado"
    if (percentual < 70) return "Regular"
    if (percentual < 85) return "Bom"
    return "Excelente"
  }

  interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: React.ReactNode
    className?: string
  }

  const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )

  const questoesAnsiedade = [
    "Sentir-se nervoso/a, ansioso/a ou muito tenso/a.",
    "Não ser capaz de impedir ou de controlar as preocupações.",
    "Preocupar-se muito com diversas coisas.",
    "Dificuldade para relaxar.",
    "Ficar tão agitado/a que se torna difícil permanecer parado.",
    "Ficar facilmente aborrecido/a ou irritado/a.",
    "Sentir medo como se algo horrível fosse acontecer",
  ]

  const questoesDepressao = [
    "Pouco interesse ou pouco prazer em fazer as coisas",
    "Se sentir “para baixo”, deprimido/a ou sem perspectiva",
    "Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume",
    "Se sentir cansado/a ou com pouca energia",
    "Falta de apetite ou comendo demais",
    "Se sentir mal consigo mesmo/a — ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo/a",
    "Dificuldade para se concentrar nas coisas, como ler ou ver assitir televisão",
    "Lentidão para se movimentar ou falar, a ponto das outras pessoas perceberem? Ou o oposto – estar tão agitado/a ou irrequieto/a que você fica andando de um lado para o outro muito mais do que de costume",
    "Pensar em se ferir de alguma maneira ou que seria melhor estar morto/a",
  ]

  const questoesAutocuidado = [
    "Verifica a glicose no sangue com monitor (glicosímetro ou CGM)",
    "Anota os resultados de glicose no sangue quando verifica com o monitor",
    "Verifica cetonas no sangue ou na urina quando o nível de glicose está alto",
    "Usa a dose correta de insulina ou dos remédios para diabetes",
    "Usa a insulina ou os remédios para diabetes na hora certa",
    "Come as porções corretas de comida",
    "Come as refeições e lanches na hora certa",
    "Anota o que come, principalmente os carboidratos",
    "Lê os rótulos dos alimentos",
    "Carrega carboidrato para, em caso de emergência, tratar a glicose baixa no sangue",
    "Quando a glicose no sangue está baixa, trata somente com a quantidade de carboidratos recomendada",
    "Comparece às consultas marcadas",
    "Carrega algum tipo de identificação que comprove o diabetes (por exemplo: cartão, pulseira, colar)",
    "Faz exercícios físico",
    "Você modifica a dose de insulina baseado nos valores da glicose, comida e/ou exercícios",
  ]

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
              name="dataAvaliacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Data da Avaliação</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-teal-300",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                          {field.value ? (
                            format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
          <p className="text-sm text-teal-800">
            A seguir, você encontrará dois breves questionários utilizados para avaliar sintomas de ansiedade (GAD-7) e
            depressão (PHQ-9). Eles são instrumentos reconhecidos e servem como apoio na identificação de sinais
            relacionados à saúde mental. As perguntas se referem ao que você sentiu ou vivenciou{" "}
            <span className="font-semibold text-teal-900">nas últimas duas semanas.</span> Não há respostas certas ou
            erradas — apenas indique o que melhor representa como você tem se sentido. Os dados são confidenciais e
            utilizados apenas para fins de acompanhamento e orientação.
          </p>
        </div>

        {/* Percepção de Qualidade de Vida */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            Avaliação da Ansiedade (GAD-7) <span className="text-rose-500">» Aplicar a partir dos 6 anos</span>
          </h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-2">
            <p className="text-sm text-teal-800 mb-6">
              Este questionário pretende aferir o seu nível de ansiedade e depressão, avaliando como se tem sentido na
              última semana. Tenha em consideração que não há respostas certas ou erradas. Por favor, responda todas as
              perguntas. Não demore muito tempo a pensar nas respostas, a sua reação imediata a cada questão será
              provavelmente mais correta do que uma resposta ponderada.
            </p>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Para as questões abaixo responda como o paciente se sente considerando a escala de 0 a 3:
                <br />0 ─ nenhuma vez; 1 ─ Vários dias; 2 ─ Mais da metade dos dias; 3 ─ Todos os dias.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {questoesAnsiedade.map((questao, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`respostasAnsiedade.${index}`}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border-b border-teal-100">
                    <div>
                      <FormLabel
                        className={cn(
                          "text-sm font-normal",
                          [11, 22, 26].includes(index) ? "bg-yellow-50 p-2 rounded inline-block" : "",
                        )}
                      >
                        {index + 1}. {questao}
                      </FormLabel>
                    </div>
                    <div className="flex justify-end">
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        {[0, 1, 2, 3].map((valor) => (
                          <FormItem key={valor} className="flex flex-col items-center space-y-1">
                            <FormControl>
                              <RadioGroupItem value={valor.toString()} id={`q${index}-${valor}`} />
                            </FormControl>
                            <FormLabel htmlFor={`q${index}-${valor}`} className="text-xs font-normal text-teal-700">
                              {valor}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Análise dos resultados da Ansiedade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Resultados da Avaliação de Ansiedade (GAD-7)</h3>
          <Separator className="bg-teal-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Score de Ansiedade"
              value={calcularScoreAnsiedade(form.watch("respostasAnsiedade") || [])}
              description="Pontuação total na escala GAD-7"
              icon={<AlertCircle className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />

            <StatCard
              title="Classificação"
              value={classificarAnsiedade(calcularScoreAnsiedade(form.watch("respostasAnsiedade") || []))}
              description="Nível de ansiedade baseado na pontuação"
              icon={<Activity className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />
          </div>
        </div>

        {/* Percepção de Qualidade de Vida */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            Avaliação da Depressão (PHQ-9) <span className="text-rose-500">» Aplicar a partir dos 12 anos</span>
          </h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-2">
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Para as questões abaixo responda como o paciente se sente considerando a escala de 0 a 3:
                <br />0 ─ nenhuma vez; 1 ─ Vários dias; 2 ─ Mais da metade dos dias; 3 ─ Todos os dias.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {questoesDepressao.map((questao, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`respostasDepressao.${index}`}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border-b border-teal-100">
                    <div>
                      <FormLabel
                        className={cn(
                          "text-sm font-normal",
                          [11, 22, 26].includes(index) ? "bg-yellow-50 p-2 rounded inline-block" : "",
                        )}
                      >
                        {index + 1}. {questao}
                      </FormLabel>
                    </div>
                    <div className="flex justify-end">
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        {[0, 1, 2, 3].map((valor) => (
                          <FormItem key={valor} className="flex flex-col items-center space-y-1">
                            <FormControl>
                              <RadioGroupItem value={valor.toString()} id={`q${index}-${valor}`} />
                            </FormControl>
                            <FormLabel htmlFor={`q${index}-${valor}`} className="text-xs font-normal text-teal-700">
                              {valor}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Resultados da Avaliação de Depressão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Resultados da Avaliação de Depressão (PHQ-9)</h3>
          <Separator className="bg-teal-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Score de Depressão"
              value={calcularScoreDepressao(form.watch("respostasDepressao") || [])}
              description="Pontuação total na escala PHQ-9"
              icon={<HeartPulse className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />

            <StatCard
              title="Classificação"
              value={classificarDepressao(calcularScoreDepressao(form.watch("respostasDepressao") || []))}
              description="Nível de depressão baseado na pontuação"
              icon={<Brain className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />
          </div>
        </div>

        {/* Inventário de Autocuidado */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700 flex items-center gap-2">
            <ClipboardList className="h-5 w-5" /> Inventário de Autocuidado em Diabetes (SCI-R)
          </h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-2">
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Para as questões abaixo responda com que frequência o paciente realiza cada uma das atividades de auto cuidado listadas a baixo, considerando a escala de 1 a 5:
                <br />1 ─ nunca; 2 ─ raramente; 3 ─ as vezes; 4 ─ geralmente; 5 ─ sempre.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {questoesAutocuidado.map((questao, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`respostasAutocuidado.${index}`}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 border-b border-teal-100">
                    <div>
                      <FormLabel className="text-sm font-normal">
                        {index + 1}. {questao}
                      </FormLabel>
                    </div>
                    <div className="flex justify-end">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        {[1, 2, 3, 4, 5].map((valor) => (
                          <FormItem key={valor} className="flex flex-col items-center space-y-1">
                            <FormControl>
                              <RadioGroupItem value={valor.toString()} id={`autocuidado-${index}-${valor}`} />
                            </FormControl>
                            <FormLabel
                              htmlFor={`autocuidado-${index}-${valor}`}
                              className="text-xs font-normal text-teal-700"
                            >
                              {valor}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Resultados do Autocuidado */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-teal-700">Resultados do Inventário de Autocuidado</h3>
          <Separator className="bg-teal-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Pontuação Total"
              value={calcularScoreAutocuidado(form.watch("respostasAutocuidado") || [])}
              description="Pontuação total no inventário de autocuidado"
              icon={<ClipboardList className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />

            <StatCard
              title="Classificação"
              value={classificarAutocuidado(calcularScoreAutocuidado(form.watch("respostasAutocuidado") || []))}
              description="Nível de autocuidado baseado na pontuação"
              icon={<Activity className="h-5 w-5 text-teal-600" />}
              className="bg-white border-l-4 border-teal-500 rounded-xl"
            />
          </div>
        </div>

        {/* Resultados - Percepção de Qualidade de Vida
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">RESULTADOS - PERCEPÇÃO DE QUALIDADE DE VIDA</h3>
          <Separator className="bg-teal-200" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-teal-800">DOMÍNIO</TableHead>
                <TableHead className="text-teal-800">ESCORE</TableHead>
                <TableHead className="text-teal-800">VARIAÇÃO DA PONTUAÇÃO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Interferência com a vida (menor melhor)</TableCell>
                <TableCell></TableCell>
                <TableCell>12 a 50 pontos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Autocuidado (maior melhor)</TableCell>
                <TableCell></TableCell>
                <TableCell>11 a 45 pontos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bem estar (maior melhor)</TableCell>
                <TableCell></TableCell>
                <TableCell>6 a 30 pontos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Preocupação com a doença (menor melhor)</TableCell>
                <TableCell></TableCell>
                <TableCell>5 a 25 pontos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Domínios positivos (autocuidado e bem estar) (maior melhor)
                </TableCell>
                <TableCell></TableCell>
                <TableCell>17 a 75 pontos</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Domínios negativos (interferência com a vida e preocupação com a doença) (maior melhor)
                </TableCell>
                <TableCell></TableCell>
                <TableCell>17 a 75 pontos</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div> */}

        {/* Escala de Ansiedade e Depressão
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Escala de Ansiedade e Depressão (HADS)</h3>
          <Separator className="bg-teal-200" />

          <p className="text-sm text-teal-800 mb-6">
            Este questionário pretende aferir o seu nível de ansiedade e depressão, avaliando como se tem sentido na
            última semana. Tenha em consideração que não há respostas certas ou erradas. Por favor, responda todas as
            perguntas. Não demore muito tempo a pensar nas respostas, a sua reação imediata a cada questão será
            provavelmente mais correta do que uma resposta ponderada.
          </p>

          <div className="space-y-6">
            {questoesHADS.map((questao, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`respostasHADS.${index}`}
                render={({ field }) => (
                  <FormItem className="border border-teal-100 rounded-md p-4">
                    <FormLabel className="text-teal-800 font-medium mb-3 block">
                      {index + 1}. {questao.pergunta}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                        {questao.opcoes.map((opcao, opcaoIndex) => (
                          <div key={opcaoIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={opcaoIndex.toString()} id={`hads-${index}-${opcaoIndex}`} />
                            <FormLabel htmlFor={`hads-${index}-${opcaoIndex}`} className="font-normal text-teal-700">
                              {opcao}
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div> */}

        {/* Hipótese Diagnóstica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">HIPÓTESE DIAGNÓSTICA GERAL</h3>
          <Separator className="bg-teal-200" />

          <FormField
            control={form.control}
            name="hipoteseDiagnostica"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">
                  Apresentação da avaliação clínica em conjunto com a análise da percepção de qualidade de vida e escala
                  de ansiedade e depressão.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Apresentação..."
                    className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conduta Clínica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">CONDUTA CLÍNICA</h3>
          <Separator className="bg-teal-200" />

          <FormField
            control={form.control}
            name="condutaClinica"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">
                  Descrição da conduta clínica e cuidados necessários para o tratamento.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva..."
                    className="min-h-[150px] border-teal-300 focus:ring-teal-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
