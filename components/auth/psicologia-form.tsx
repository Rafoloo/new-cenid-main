"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const PsicologiaSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  dataAvaliacao: z.string().min(1, "A data da avaliação deve ser selecionada"),
  respostasQualidadeVida: z.array(z.string().optional()).length(33),
  respostasHADS: z.array(z.string().optional()).length(14),
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
    },
  })

  const onSubmit = (data: PsicologiaFormValues) => {
    console.log(data)
  }

  const questoesQualidadeVida = [
    "Ter diabetes dificulta minhas relações sociais (amigos, colegas, parceiros, etc).",
    "Sinto-me diferente por ter diabetes.",
    "Ter que aplicar insulina é um problema diário para mim.",
    "Ter diabetes limita minha vida social e de lazer (comer fora de casa, comemorações, viagens, etc).",
    "Minha vida mudou por eu ter diabetes.",
    "Ter diabetes dificulta as relações com minha família.",
    "Sinto-me limitado(a) no trabalho ou escola por ter diabetes.",
    "Tenho alguma(s) complicação(ções) do diabetes que piora(m) a minha qualidade de vida porque me limita(m) fisicamente.",
    "O dia a dia com diabetes me representa um estresse a mais.",
    "Fico preocupado(a) que os outros saibam que tenho diabetes.",
    "Minha vida sexual está limitada por eu ter diabetes.",
    "Tendo diabetes posso levar uma vida normal.",
    "Estou satisfeito(a) com o envolvimento que tenho no dia a dia no autocuidado do meu diabetes.",
    "O nível de formação/conhecimento que tenho sobre meu diabetes me ajuda a ter um bom controle.",
    "O conhecimento que tenho em contagem de carboidratos proporciona flexibilidade na minha alimentação.",
    "Estou satisfeito(a) com a forma que levo meu diabetes.",
    "Estou motivado(a) no autocuidado do meu diabetes.",
    "Ajusto a dose de insulina de acordo com a minha alimentação para ter um bom controle.",
    "Estou satisfeito(a) com o tratamento farmacológico/insulina que sigo, porque me facilita o controle do diabetes.",
    "Estou satistfeito(a) com meu atual controle glicêmico (hemoglobina glicada/tempo no alvo).",
    "O controle do meu diabetes está integrado em minha vida cotidiana com normalidade.",
    "Considero que tenho flexibilidade e liberdade na minha alimentação embora eu tenha diabetes.",
    "É muito difícil fazer os controles (glicemias) diariamente.",
    "Descanso bem e meu sono noturno é bom.",
    "Estou bem fisicamente.",
    "Estou bem psicologicamente.",
    "Tenho outra(s) doença(s) em consequência do diabetes que piora(m) minha qualidade de vida.",
    "Estou satisfeito(a) com o tempo que dedico para fazer atividade física.",
    "Considero que, em geral, minha qualidade de vida é boa.",
    "Tenho medo de ter hipoglicemias (baixas de açucar no sangue).",
    "Com frequência me preocupa ter uma hipoglicemia.",
    "Fico preocupado(a) quando tenho glicemia alta.",
    "Com frequência fico preocupado(a) em ter futuras complicações pelo diabetes.",
  ]

  const questoesHADS = [
    {
      pergunta: "Sinto-me tenso(a) ou nervoso(a)",
      opcoes: ["Quase sempre", "Muitas vezes", "Por vezes", "Nunca"],
    },
    {
      pergunta: "Ainda sinto prazer nas coisas de que costumava gostar",
      opcoes: ["Tanto como antes", "Não tanto como agora", "Só um pouco", "Quase nada"],
    },
    {
      pergunta: "Tenho uma sensação de medo, como se algo terrível estivesse para acontecer",
      opcoes: ["Sim e muito forte", "Sim, mas não muito forte", "Um pouco, mas não me aflige", "De modo algum"],
    },
    {
      pergunta: "Sou capaz de rir e ver o lado divertido das coisas",
      opcoes: ["Tanto como antes", "Não tanto como antes", "Muito menos agora", "Nunca"],
    },
    {
      pergunta: "Tenho a cabeça cheia de preocupações",
      opcoes: ["A maior parte do tempo", "Muitas vezes", "Por vezes", "Quase nunca"],
    },
    {
      pergunta: "Sinto-me animado(a)",
      opcoes: ["Nunca", "Poucas vezes", "De vez em quando", "Quase sempre"],
    },
    {
      pergunta: "Sou capaz de estar descontraidamente sentado(a) e sentir-me relaxado(a)",
      opcoes: ["Quase sempre", "Muitas vezes", "Por vezes", "Nunca"],
    },
    {
      pergunta: "Sinto-me mais lento(a), como se fizesse as coisas mais devagar",
      opcoes: ["Quase sempre", "Muitas vezes", "Por vezes", "Nunca"],
    },
    {
      pergunta: "Fico de tal forma apreensivo(a)/com medo, que até sinto um aperto no estômago",
      opcoes: ["Nunca", "Por vezes", "Muitas vezes", "Quase sempre"],
    },
    {
      pergunta: "Perdi o interesse em cuidar do meu aspecto físico",
      opcoes: [
        "Completamente",
        "Não dou a atenção que devia",
        "Talvez cuide menos que antes",
        "Tenho o mesmo interesse de sempre",
      ],
    },
    {
      pergunta: "Sinto-me de tal forma inquieto(a) que não consigo estar parado(a)",
      opcoes: ["Muito", "Bastante", "Não muito", "Nada"],
    },
    {
      pergunta: "Penso com prazer nas coisas que podem acontecer no futuro",
      opcoes: ["Tanto como antes", "Não tanto como antes", "Bastante menos agora", "Quase nunca"],
    },
    {
      pergunta: "De repente, tenho sensações de pânico",
      opcoes: ["Muitas vezes", "Bastante vezes", "Por vezes", "Nunca"],
    },
    {
      pergunta: "Sou capaz de apreciar um bom livro ou um programa de rádio ou televisão",
      opcoes: ["Muitas vezes", "De vez em quando", "Poucas vezes", "Quase nunca"],
    },
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
            A avaliação dos questionários de "Ansiedade e Depressão" e da análise da "Qualidade de Vida" deverá ser
            realizada com intervalo mínimo de 4 meses e máximo de 12 meses.
          </p>
        </div>

        {/* Percepção de Qualidade de Vida */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">PERCEPÇÃO DE QUALIDADE DE VIDA</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-2">
            <p className="text-sm text-teal-800">
              Para as questões abaixo responda como você se sente considerando a escala de 1 a 5
            </p>
            <p className="text-sm text-teal-800">
              1 - discordo totalmente; 2 - discordo; 3 - não concordo nem discordo; 4 - concordo; 5 - concordo
              totalmente
            </p>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Os itens 12, 23 e 27 são invertidos para uma interpretação correta, como segue abaixo:
                <br />1 - concordo totalmente; 2 - concordo; 3 - não concordo e nem discordo; 4 - discordo; 5 - discordo
                totalmente
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {questoesQualidadeVida.map((questao, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`respostasQualidadeVida.${index}`}
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
                        {[1, 2, 3, 4, 5].map((valor) => (
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

        {/* Resultados - Percepção de Qualidade de Vida */}
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
        </div>

        {/* Escala de Ansiedade e Depressão */}
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
        </div>

        {/* Análise dos resultados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            Análise dos resultados do Escala de Ansiedade e Depressão (HADS)
          </h3>
          <Separator className="bg-teal-200" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-teal-800">Sintomas</TableHead>
                <TableHead className="text-teal-800">Pontuação</TableHead>
                <TableHead className="text-teal-800">Sugestão diagnóstica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Ansiedade</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  0-7 pontos: improvável
                  <br />
                  8-11 pontos: possível - (questionável ou duvidosa)
                  <br />
                  12-21 pontos: provável
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Depressão</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  0-7 pontos: improvável
                  <br />
                  8-11 pontos: possível - (questionável ou duvidosa)
                  <br />
                  12-21 pontos: provável
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

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
