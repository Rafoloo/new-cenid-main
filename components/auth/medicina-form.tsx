"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const MedicinaSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  idade: z.string().min(1, "A idade deve ser preenchida"),
  peso: z.string().min(1, "O peso deve ser preenchido"),
  estatura: z.string().min(1, "A estatura deve ser preenchida"),
  diagnostico: z.string().min(1, "O diagnóstico deve ser selecionado"),
  outrasDM: z.string().optional(),
  dataDiagnostico: z.string().min(1, "A data do diagnóstico deve ser selecionada"),
  tempoDiagnostico: z.string().min(1, "O tempo de diagnóstico deve ser preenchido"),
  classificacaoDiagnostico: z.string().min(1, "A classificação do diagnóstico deve ser selecionada"),
  metodoMonitoramento: z.string().min(1, "O método de monitoramento deve ser selecionado"),
  modeloGlicometro: z.string().optional(),
  controleGlicemico: z.string().min(1, "O estado de controle glicêmico deve ser preenchido"),
  administracaoInsulina: z.string().min(1, "O método de administração de insulina deve ser selecionado"),
  doencas: z.array(
    z.object({
      doenca: z.string().optional(),
      medicamento: z.string().optional(),
      dose: z.string().optional(),
    }),
  ),
  sintomas: z.string().optional(),
  estagioMaturacional: z.string().optional(),
  insulinaBasalNome: z.string().optional(),
  insulinaBasalDose1: z.string().optional(),
  insulinaBasalDose2: z.string().optional(),
  insulinaBolusNome: z.string().optional(),
  insulinaBolusNose1: z.string().optional(),
  insulinaBolusNose2: z.string().optional(),
  fatorSensibilidadeValor: z.string().optional(),
  fatorSensibilidadeHoraInicio: z.string().optional(),
  fatorSensibilidadeHoraFim: z.string().optional(),
  razaoCarboidratoValor: z.string().optional(),
  razaoCarboidratoHoraInicio: z.string().optional(),
  razaoCarboidratoHoraFim: z.string().optional(),
  outrasPresc: z.string().optional(),
})

type MedicinaFormValues = z.infer<typeof MedicinaSchema>

export default function FormularioMedicina() {
  const form = useForm<MedicinaFormValues>({
    resolver: zodResolver(MedicinaSchema),
    defaultValues: {
      doencas: [{ doenca: "", medicamento: "", dose: "" }],
    },
  })

  const onSubmit = (data: MedicinaFormValues) => {
    console.log(data)
  }

  const adicionarDoenca = () => {
    const doencasAtuais = form.getValues("doencas")
    form.setValue("doencas", [...doencasAtuais, { doenca: "", medicamento: "", dose: "" }])
  }

  const removerDoenca = (index: number) => {
    const doencasAtuais = form.getValues("doencas")
    if (doencasAtuais.length > 1) {
      form.setValue(
        "doencas",
        doencasAtuais.filter((_, i) => i !== index),
      )
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
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Idade</FormLabel>
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
              name="estatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Estatura (metros)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Digite a estatura"
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

        {/* Diagnóstico */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Diagnóstico</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="diagnostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Diagnóstico</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DM1" id="DM1" />
                        <FormLabel htmlFor="DM1" className="font-normal">
                          DM1
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DM2" id="DM2" />
                        <FormLabel htmlFor="DM2" className="font-normal">
                          DM2
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DMG" id="DMG" />
                        <FormLabel htmlFor="DMG" className="font-normal">
                          DMG
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sem Diagnóstico" id="sem-diagnostico" />
                        <FormLabel htmlFor="sem-diagnostico" className="font-normal">
                          Sem Diagnóstico
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Outras formas de DM" id="outras-dm" />
                        <FormLabel htmlFor="outras-dm" className="font-normal">
                          Outras formas de DM
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("diagnostico") === "Outras formas de DM" && (
              <FormField
                control={form.control}
                name="outrasDM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Especifique outras formas de DM</FormLabel>
                    <FormControl>
                      <Input placeholder="Especifique" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dataDiagnostico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Data do Diagnóstico</FormLabel>
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

              <FormField
                control={form.control}
                name="tempoDiagnostico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Tempo de Diagnóstico em Meses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o tempo em meses"
                        className="border-teal-300 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="classificacaoDiagnostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Classificação do Tempo de Diagnóstico</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Recente até 100 dias" id="recente" />
                        <FormLabel htmlFor="recente" className="font-normal">
                          Recente até 100 dias
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Lua de mel (remissão)" id="lua-mel" />
                        <FormLabel htmlFor="lua-mel" className="font-normal">
                          Lua de mel (remissão)
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Esgotamento de reserva pancreática de insulina" id="esgotamento" />
                        <FormLabel htmlFor="esgotamento" className="font-normal">
                          Esgotamento de reserva pancreática de insulina
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Monitoramento e Controle */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Monitoramento e Controle</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="metodoMonitoramento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Método de Monitoramento de Glicemia</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Glicosimetro" id="glicosimetro" />
                        <FormLabel htmlFor="glicosimetro" className="font-normal">
                          Glicosímetro
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sensor Medtronic" id="sensor-medtronic" />
                        <FormLabel htmlFor="sensor-medtronic" className="font-normal">
                          Sensor Medtronic
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Freestyle Libre" id="freestyle-libre" />
                        <FormLabel htmlFor="freestyle-libre" className="font-normal">
                          Freestyle Libre
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("metodoMonitoramento") === "Glicosimetro" && (
              <FormField
                control={form.control}
                name="modeloGlicometro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Marca/modelo do glicômetro</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accu-chek">Accu-Chek</SelectItem>
                          <SelectItem value="onetouch">OneTouch</SelectItem>
                          <SelectItem value="contour">Contour</SelectItem>
                          <SelectItem value="freestyle">FreeStyle</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="controleGlicemico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Estado de Controle Glicêmico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descreva o estado de controle glicêmico"
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
              name="administracaoInsulina"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Método de Administração de Insulina</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Não faz uso de insulina" id="nao-usa" />
                        <FormLabel htmlFor="nao-usa" className="font-normal">
                          Não faz uso de insulina
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Caneta/seringa (MDI)" id="caneta-seringa" />
                        <FormLabel htmlFor="caneta-seringa" className="font-normal">
                          Caneta/seringa (MDI)
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bomba (SICI)" id="bomba" />
                        <FormLabel htmlFor="bomba" className="font-normal">
                          Bomba (SICI)
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Outras morbidades */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Outras morbidades (doenças)</h3>
          <Separator className="bg-teal-200" />

          {form.watch("doencas").map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-teal-100 rounded-md">
              <FormField
                control={form.control}
                name={`doencas.${index}.doenca`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Doença</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a doença" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`doencas.${index}.medicamento`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Medicamento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o medicamento"
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
                name={`doencas.${index}.dose`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Dose</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input placeholder="Digite a dose" className="border-teal-300 focus:ring-teal-500" {...field} />
                      </FormControl>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removerDoenca(index)}
                          className="flex-shrink-0 border-teal-300 text-teal-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button type="button" variant="outline" onClick={adicionarDoenca} className="border-teal-300 text-teal-700">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Doença
          </Button>
        </div>

        {/* Sintomas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Sintomas</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="sintomas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">
                  Registro de queixas do paciente em relação ao estado de saúde e controle do diabetes
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os sintomas"
                    className="min-h-[100px] border-teal-300 focus:ring-teal-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Estágio maturacional */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Estágio maturacional: Escala de TANNER</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="estagioMaturacional"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pré-púbere" id="pre-pubere" />
                      <FormLabel htmlFor="pre-pubere" className="font-normal">
                        Pré-púbere
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Púbere" id="pubere" />
                      <FormLabel htmlFor="pubere" className="font-normal">
                        Púbere
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pós-púbere" id="pos-pubere" />
                      <FormLabel htmlFor="pos-pubere" className="font-normal">
                        Pós-púbere
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Administração de insulina atual */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Administração de insulina atual</h3>
          <Separator className="bg-teal-200" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="insulinaBasalNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Insulina Basal - Nome</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lantus">Lantus</SelectItem>
                          <SelectItem value="levemir">Levemir</SelectItem>
                          <SelectItem value="tresiba">Tresiba</SelectItem>
                          <SelectItem value="toujeo">Toujeo</SelectItem>
                          <SelectItem value="basaglar">Basaglar</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insulinaBasalDose1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Dose diária (U/dia)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a dose" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insulinaBasalDose2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Dose diária (U/kg/dia)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a dose" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="insulinaBolusNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Insulina Bolus - Nome</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novolog">NovoLog</SelectItem>
                          <SelectItem value="humalog">Humalog</SelectItem>
                          <SelectItem value="apidra">Apidra</SelectItem>
                          <SelectItem value="fiasp">Fiasp</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insulinaBolusNose1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Dose diária (U/dia)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a dose" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insulinaBolusNose2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Dose diária (U/kg/dia)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a dose" className="border-teal-300 focus:ring-teal-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Fator de sensibilidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">
            Fator de sensibilidade a insulina (FS) para BOLUS de insulina
          </h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fatorSensibilidadeValor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">FS (mg/dl/U)</FormLabel>
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
              name="fatorSensibilidadeHoraInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Hora Início</FormLabel>
                  <FormControl>
                    <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatorSensibilidadeHoraFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Hora Fim</FormLabel>
                  <FormControl>
                    <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Razão de carboidrato */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Razão de carboidrato insulina (rCHOi)</h3>
          <Separator className="bg-teal-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="razaoCarboidratoValor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">rCHOi (gramas/U)</FormLabel>
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
              name="razaoCarboidratoHoraInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Hora Início</FormLabel>
                  <FormControl>
                    <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="razaoCarboidratoHoraFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-800">Hora Fim</FormLabel>
                  <FormControl>
                    <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Outras prescrições */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-teal-700">Outras prescrições médicas</h3>
          <Separator className="bg-teal-200" />
          <FormField
            control={form.control}
            name="outrasPresc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-teal-800">Conduta Clínica</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição de conduta clínica e cuidados necessários para o tratamento do diabetes ou outras morbidades"
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
