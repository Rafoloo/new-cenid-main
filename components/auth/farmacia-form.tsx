// "use client"

// import type React from "react"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Upload } from "lucide-react"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useState } from "react"

// const   FarmaciaSchema = z.object({
//   nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
//   acompanhante: z.string().optional(),
//   glicemiaChegada: z.string().optional(),

//   // Registro de glicemia
//   registroGlicemia: z
//     .array(
//       z.object({
//         data: z.string().optional(),
//         hora: z.string().optional(),
//         glicemia: z.string().optional(),
//       }),
//     )
//     .optional(),

//   // Uso de medicamentos
//   usoMedicamento: z.string().default("NÃO"),
//   medicamentos: z
//     .array(
//       z.object({
//         nome: z.string().optional(),
//         dose: z.string().optional(),
//         finalidade: z.string().optional(),
//       }),
//     )
//     .optional(),

//   // Diurese
//   diurese: z.string().optional(),

//   // Evacuação
//   evacuacao: z.string().optional(),

//   // Pressão arterial
//   pressaoArterialSistolica: z.string().optional(),
//   pressaoArterialDiastolica: z.string().optional(),
//   frequenciaCardiaca: z.string().optional(),

//   // Padrão neuropático
//   formigamentoPernaDireita: z.boolean().default(false),
//   formigamentoPernaEsquerda: z.boolean().default(false),
//   formigamentoPeDireito: z.boolean().default(false),
//   formigamentoPeEsquerdo: z.boolean().default(false),
//   doresMembrosInferiores: z.boolean().default(false),
//   edemaMembrosInferiores: z.boolean().default(false),
//   claudicacaoNeurogenica: z.boolean().default(false),

//   // Padrão oftalmológico
//   embacamentoVisual: z.boolean().default(false),
//   usoOculos: z.boolean().default(false),
//   pruridoOcular: z.boolean().default(false),
//   exameFundoOlho: z.boolean().default(false),

//   // Lipodistrofia
//   lipodistrofiaBracoDireito: z.boolean().default(false),
//   lipodistrofiaBracoEsquerdo: z.boolean().default(false),
//   lipodistrofiaAbdomen: z.boolean().default(false),
//   lipodistrofiaNadegaDireita: z.boolean().default(false),
//   lipodistrofiaNadegaEsquerda: z.boolean().default(false),
//   lipodistrofiaCoxaDireita: z.boolean().default(false),
//   lipodistrofiaCoxaEsquerda: z.boolean().default(false),

//   // Alterações dos pés
//   anidrose: z.boolean().default(false),
//   atrofiaInterossea: z.boolean().default(false),
//   calos: z.boolean().default(false),
//   fissuras: z.boolean().default(false),
//   haluxValgo: z.boolean().default(false),
//   hiperacetose: z.boolean().default(false),
//   hiperpigmentacao: z.boolean().default(false),
//   micoseInterdigital: z.boolean().default(false),
//   onicomicose: z.boolean().default(false),
//   peCavo: z.boolean().default(false),
//   peCharcot: z.boolean().default(false),
//   peGarra: z.boolean().default(false),
//   pePlano: z.boolean().default(false),
//   proeminenciaMetatarsiana: z.boolean().default(false),
//   acentuacaoArcoPlantar: z.boolean().default(false),
//   lesoes: z.boolean().default(false),
//   unhaEncravada: z.boolean().default(false),

//   // Hipótese diagnóstica
//   hipoteseDiagnostica: z.string().optional(),

//   // Responsável
//   nomeProfessor: z.string().optional(),
//   crmProfessor: z.string().optional(),
//   emailProfessor: z.string().optional(),
//   telefoneProfessor: z.string().optional(),

//   // Anexo
//   anexo: z.any().optional(),
// })

// type FarmaciaFormValues = z.infer<typeof FarmaciaSchema>

// export default function FormularioFarmacia() {
//   const [fileError, setFileError] = useState<string | null>(null)

//   const form = useForm<FarmaciaFormValues>({
//     resolver: zodResolver(FarmaciaSchema),
//     defaultValues: {
//       registroGlicemia: [
//         { data: "", hora: "", glicemia: "" },
//         { data: "", hora: "", glicemia: "" },
//         { data: "", hora: "", glicemia: "" },
//       ],
//       medicamentos: [
//         { nome: "", dose: "", finalidade: "" },
//         { nome: "", dose: "", finalidade: "" },
//         { nome: "", dose: "", finalidade: "" },
//       ],
//       usoMedicamento: "NÃO",
//     },
//   })

//   const onSubmit = (data: FarmaciaFormValues) => {
//     console.log(data)
//   }

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     if (file.size > 1000000) {
//       const fileSizeMB = file.size / 1000000
//       setFileError(
//         `O tamanho do arquivo deve ser no máximo 1MB. O arquivo atual tem o tamanho ${fileSizeMB.toFixed(2)} MB`,
//       )
//     } else {
//       setFileError(null)
//       onChange(file)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {/* Dados do Paciente */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Dados do Paciente</h3>
//           <Separator className="bg-teal-200" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="nome"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Nome do Paciente</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Digite o nome completo"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="acompanhante"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Acompanhante da consulta</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Digite o nome do acompanhante"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="glicemiaChegada"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Glicemia de chegada</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Digite o valor da glicemia"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Registro de Glicemia */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Registro da glicemia dos últimos 3 dias</h3>
//           <Separator className="bg-teal-200" />
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-teal-800">Data</TableHead>
//                   <TableHead className="text-teal-800">Hora</TableHead>
//                   <TableHead className="text-teal-800">Glicemia</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {[0, 1, 2].map((index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormField
//                         control={form.control}
//                         name={`registroGlicemia.${index}.data`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="date" className="border-teal-300 focus:ring-teal-500" {...field} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <FormField
//                         control={form.control}
//                         name={`registroGlicemia.${index}.hora`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="time" className="border-teal-300 focus:ring-teal-500" {...field} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <FormField
//                         control={form.control}
//                         name={`registroGlicemia.${index}.glicemia`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input
//                                 placeholder="Digite o valor"
//                                 className="border-teal-300 focus:ring-teal-500"
//                                 {...field}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         {/* Uso de Medicamentos */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Uso de Medicamentos</h3>
//           <Separator className="bg-teal-200" />
//           <FormField
//             control={form.control}
//             name="usoMedicamento"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-teal-800">Está fazendo uso de algum medicamento além da insulina?</FormLabel>
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     className="flex flex-col space-y-2"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="NÃO" id="nao-medicamento" />
//                       <FormLabel htmlFor="nao-medicamento" className="font-normal">
//                         Não
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="SIM" id="sim-medicamento" />
//                       <FormLabel htmlFor="sim-medicamento" className="font-normal">
//                         Sim, se sim preencher os dados no quadro abaixo
//                       </FormLabel>
//                     </div>
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {form.watch("usoMedicamento") === "SIM" && (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-teal-800">Nome do medicamento</TableHead>
//                     <TableHead className="text-teal-800">Dose (descrição)</TableHead>
//                     <TableHead className="text-teal-800">Finalidade do medicamento</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {[0, 1, 2].map((index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <FormField
//                           control={form.control}
//                           name={`medicamentos.${index}.nome`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Digite o nome"
//                                   className="border-teal-300 focus:ring-teal-500"
//                                   {...field}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <FormField
//                           control={form.control}
//                           name={`medicamentos.${index}.dose`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Digite a dose"
//                                   className="border-teal-300 focus:ring-teal-500"
//                                   {...field}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <FormField
//                           control={form.control}
//                           name={`medicamentos.${index}.finalidade`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   placeholder="Digite a finalidade"
//                                   className="border-teal-300 focus:ring-teal-500"
//                                   {...field}
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </div>

//         {/* Diurese */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Diurese (Urina)</h3>
//           <Separator className="bg-teal-200" />
//           <FormField
//             control={form.control}
//             name="diurese"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     className="flex flex-col space-y-2"
//                   >
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Oligúria" id="oliguria" />
//                       <FormLabel htmlFor="oliguria" className="font-normal">
//                         <span className="font-semibold">Oligúria</span> - (produção de urina entre 100ml a 400ml no
//                         período de 24 horas).
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Poliúria" id="poliuria" />
//                       <FormLabel htmlFor="poliuria" className="font-normal">
//                         <span className="font-semibold">Poliúria</span> - aumento do volume urinário
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Disúria" id="disuria" />
//                       <FormLabel htmlFor="disuria" className="font-normal">
//                         <span className="font-semibold">Disúria</span> - dificuldade para urinar que pode ser
//                         acompanhada de dor
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Polaciúria" id="polaciuria" />
//                       <FormLabel htmlFor="polaciuria" className="font-normal">
//                         <span className="font-semibold">Polaciúria</span> - aumento da frequência das micções, ou seja,
//                         micções com intervalos menores que o habitual
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Nictúria" id="nicturia" />
//                       <FormLabel htmlFor="nicturia" className="font-normal">
//                         <span className="font-semibold">Nictúria</span> - são aqueles que se levantam pelo menos duas
//                         vezes por noite para urinar
//                       </FormLabel>
//                     </div>
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Evacuação */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Evacuação (Dejeção de fezes)</h3>
//           <Separator className="bg-teal-200" />
//           <FormField
//             control={form.control}
//             name="evacuacao"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     className="flex flex-col space-y-2"
//                   >
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Diário" id="diario" />
//                       <FormLabel htmlFor="diario" className="font-normal">
//                         <span className="font-semibold">Diário</span>
//                       </FormLabel>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <RadioGroupItem value="Constipação" id="constipacao" />
//                       <FormLabel htmlFor="constipacao" className="font-normal">
//                         <span className="font-semibold">Constipação</span> - menos de três evacuações por semana
//                       </FormLabel>
//                     </div>
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Pressão Arterial */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">
//             Pressão arterial & frequência cardíaca de repouso (sentado após 3 minutos de repouso)
//           </h3>
//           <Separator className="bg-teal-200" />
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <FormField
//               control={form.control}
//               name="pressaoArterialSistolica"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Pressão Arterial Sistólica (mmHg)</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Digite o valor"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="pressaoArterialDiastolica"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Pressão Arterial Diastólica (mmHg)</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Digite o valor"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="frequenciaCardiaca"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Frequência Cardíaca (bpm)</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Digite o valor"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Padrão Neuropático */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Padrão Neuropático</h3>
//           <Separator className="bg-teal-200" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="formigamentoPernaDireita"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Formigamento na perna direita</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="formigamentoPernaEsquerda"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Formigamento na perna esquerda</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="formigamentoPeDireito"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Formigamento no pé direito</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="formigamentoPeEsquerdo"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Formigamento no pé esquerdo</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="doresMembrosInferiores"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Dores nos membros inferiores</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="edemaMembrosInferiores"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Edema (inchaço) nos membros inferiores</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="claudicacaoNeurogenica"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">
//                     Claudicação neurogênica - é caracterizada por dor glútea, sensação de peso nas pernas que piora em
//                     pé ou andando e tipicamente melhora sentado. Com frequência é relatado fraqueza nas pernas e
//                     sensação de formigamento nas plantas dos pés.
//                   </FormLabel>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Padrão Oftalmológico */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Padrão Oftalmológico</h3>
//           <Separator className="bg-teal-200" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="embacamentoVisual"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Embaçamento visual</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="usoOculos"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Uso de óculos</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="pruridoOcular"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Prurido ocular - coceira em olho</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="exameFundoOlho"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">
//                     Realizou exame de fundo de olho - A (Fundoscopia) direta é um exame clínico para análise do nervo
//                     óptico e mácula. Sim, anexar exame.
//                   </FormLabel>
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="anexo"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-teal-800">Anexar exame de fundo de olho</FormLabel>
//                 <div className="border-2 border-dashed border-teal-200 rounded-md p-6 flex flex-col items-center justify-center">
//                   <Upload className="h-10 w-10 text-teal-400 mb-2" />
//                   <p className="text-sm text-teal-600 mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
//                   <FormControl>
//                     <Input
//                       type="file"
//                       accept=".pdf"
//                       className="max-w-xs border-teal-300 focus:ring-teal-500"
//                       onChange={(e) => handleFileChange(e, field.onChange)}
//                     />
//                   </FormControl>
//                   {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Avaliação da Lipodistrofia */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Avaliação da Lipodistrofia</h3>
//           <Separator className="bg-teal-200" />
//           <p className="text-sm text-teal-700 mb-4">
//             A Lipodistrofia causa um acúmulo de gordura na região na qual a insulina foi aplicada repetidas vezes.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="lipodistrofiaBracoDireito"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Braço direito</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaBracoEsquerdo"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Braço esquerdo</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaAbdomen"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Abdômen</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaNadegaDireita"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Nádega direita</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaNadegaEsquerda"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Nádega esquerda</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaCoxaDireita"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Coxa direita</FormLabel>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lipodistrofiaCoxaEsquerda"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                   </FormControl>
//                   <FormLabel className="font-normal">Coxa esquerda</FormLabel>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Alterações dos pés */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Alterações dos pés</h3>
//           <Separator className="bg-teal-200" />
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-1/6 text-teal-800">Alteração</TableHead>
//                   <TableHead className="w-1/6 text-teal-800">Presente</TableHead>
//                   <TableHead className="w-4/6 text-teal-800">Descrição</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell className="font-medium">Anidrose</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="anidrose"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>É a ausência anormal de suor</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Atrofia Interossea</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="atrofiaInterossea"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     Uma <strong>atrofia</strong> dos músculos metacarpais e hipotenares ocorre em estágios avançados
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Calos</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="calos"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <strong>Calo</strong> no <strong>pé</strong> é uma camada espessa e dura de pele que se forma em
//                     resposta à pressão ou atrito constante dos <strong>pés</strong>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Fissuras</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="fissuras"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <strong>Fissuras</strong> calcâneas popularmente conhecidas como <strong>pé</strong> rachado, é
//                     caracterizada por lesões lineares que surgem na pele
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Halux Valgo</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="haluxValgo"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     É a principal patologia de antepé, acometendo a primeira articulação metatarsofalangeana
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Hiperacetose</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="hiperacetose"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>A hiperaqueratose é um espessamento da parte mais externa da epiderme</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Hiperpigmentação</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="hiperpigmentacao"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>Quando há aumento na produção de melanina, ocorre escurecimento no tom da pele</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Micose Interdigital</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="micoseInterdigital"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     Infecção fúngica que acomete os espaços <strong>interdigitais</strong> e regiões plantares
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Onicomicose</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="onicomicose"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     É uma infecção causada por fungos que se alimentam da queratina, proteína que forma a maior parte
//                     das unhas
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Pé Cavo</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="peCavo"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     O <strong>pé cavo</strong> é uma alteração estrutural em que o arco natural da planta do{" "}
//                     <strong>pé</strong> apresenta uma curvatura excessiva
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Pé de Charcot</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="peCharcot"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     É uma deformidade nos ossos e articulações associados a perda de sensibilidade protetora e a traumas
//                     repetitivos
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Pé em Garra</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="peGarra"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     Deformidades dos dedos menores do <strong>pé</strong> (dedos em <strong>garra</strong>)
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Pé Plano</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="pePlano"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>Condição em que toda a sola do pé toca no chão quando o indivíduo está de pé</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Proeminência Metatarsiana</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="proeminenciaMetatarsiana"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500"/>
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     Metatarsalgia é um termo geral que se refere a uma condição dolorosa na região do metatarso do pé
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Acentuação do Arco Plantar</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="acentuacaoArcoPlantar"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <strong>Arco Plantar</strong>, a curva que surge durante a infância tem a função de distribuir o
//                     peso do corpo e ajudar na absorção de impactos
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Lesões</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="lesoes"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell></TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell className="font-medium">Unha Encravada</TableCell>
//                   <TableCell>
//                     <FormField
//                       control={form.control}
//                       name="unhaEncravada"
//                       render={({ field }) => (
//                         <FormItem className="flex items-center justify-center">
//                           <FormControl>
//                             <Checkbox checked={field.value} onCheckedChange={field.onChange}  className="h-5 w-5 rounded border-teal-300 text-teal-600 focus:ring--500" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell>Condição na qual o canto ou lado de uma unha cresce na carne</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         {/* Hipótese Diagnóstica */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Hipótese Diagnóstica Geral</h3>
//           <Separator className="bg-teal-200" />
//           <FormField
//             control={form.control}
//             name="hipoteseDiagnostica"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-teal-800">
//                   Apresentação do resumo dos achados da avaliação clínica do paciente
//                 </FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Descreva a hipótese diagnóstica..."
//                     className="min-h-[150px] border-teal-300 focus:ring-teal-500"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Responsável pela avaliação */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-teal-700">Professor responsável</h3>
//           <Separator className="bg-teal-200" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="nomeProfessor"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Nome Completo</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Digite o nome do professor"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="crmProfessor"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">CRM</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Digite o CRM" className="border-teal-300 focus:ring-teal-500" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="emailProfessor"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Email</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="Digite o email"
//                       className="border-teal-300 focus:ring-teal-500"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="telefoneProfessor"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-teal-800">Telefone</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Digite o telefone" className="border-teal-300 focus:ring-teal-500" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
//             Salvar Avaliação
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }

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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AvaliacaoFarmaciaSchema = z.object({
  // Dados básicos
  data: z.date().optional(),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  idade: z.string().optional(),

  // Método de administração de insulina
  metodoAdministracao: z.string().optional(),
  insulinaBasal: z.string().optional(),
  insulinaBolus: z.string().optional(),

  // Adesão ao tratamento com insulina
  adesaoInsulina1: z.string().default("0"),
  adesaoInsulina2: z.string().default("0"),
  adesaoInsulina3: z.string().default("0"),
  adesaoInsulina4: z.string().default("0"),

  // Medicamentos (array de 5 medicamentos)
  medicamentos: z
    .array(
      z.object({
        nomeComercial: z.string().optional(),
        principioAtivo: z.string().optional(),
        comPrescricao: z.string().optional(),
        tempoUso: z.string().optional(),
        dataInicio: z.date().optional(),
        dataTermino: z.date().optional(),
        finalidadeUso: z.string().optional(),
        posologias: z
          .array(
            z.object({
              dose: z.string().optional(),
              horario: z.string().optional(),
              jejum: z.string().optional(),
            }),
          )
          .length(4),
        adesao1: z.string().default("0"),
        adesao2: z.string().default("0"),
        adesao3: z.string().default("0"),
        adesao4: z.string().default("0"),
      }),
    )
    .length(5),
})

type AvaliacaoFarmaciaFormValues = z.infer<typeof AvaliacaoFarmaciaSchema>

export default function FormularioAvaliacaoFarmacia() {
  const form = useForm<AvaliacaoFarmaciaFormValues>({
    resolver: zodResolver(AvaliacaoFarmaciaSchema),
    defaultValues: {
      adesaoInsulina1: "0",
      adesaoInsulina2: "0",
      adesaoInsulina3: "0",
      adesaoInsulina4: "0",
      medicamentos: Array(5).fill({
        nomeComercial: "",
        principioAtivo: "",
        comPrescricao: "",
        tempoUso: "",
        finalidadeUso: "",
        posologias: Array(4).fill({
          dose: "",
          horario: "",
          jejum: "",
        }),
        adesao1: "0",
        adesao2: "0",
        adesao3: "0",
        adesao4: "0",
      }),
    },
  })

  const onSubmit = (data: AvaliacaoFarmaciaFormValues) => {
    console.log(data)
  }

  // Função para calcular o escore de adesão à insulina
  const calcularEscoreInsulinaAdesao = () => {
    const adesao1 = form.watch("adesaoInsulina1") === "0" ? 1 : 0
    const adesao2 = form.watch("adesaoInsulina2") === "0" ? 1 : 0
    const adesao3 = form.watch("adesaoInsulina3") === "0" ? 1 : 0
    const adesao4 = form.watch("adesaoInsulina4") === "0" ? 1 : 0

    return adesao1 + adesao2 + adesao3 + adesao4
  }

  // Função para determinar o nível de adesão com base no escore
  const determinarNivelAdesao = (escore: number) => {
    if (escore === 4) return "Máxima"
    if (escore === 3) return "Alta"
    if (escore === 2) return "Média"
    if (escore === 1) return "Baixa"
    return "Mínima"
  }

  // Função para calcular o escore de adesão ao medicamento
  const calcularEscoreMedicamentoAdesao = (index: number) => {
    const adesao1 = form.watch(`medicamentos.${index}.adesao1`) === "0" ? 1 : 0
    const adesao2 = form.watch(`medicamentos.${index}.adesao2`) === "0" ? 1 : 0
    const adesao3 = form.watch(`medicamentos.${index}.adesao3`) === "0" ? 1 : 0
    const adesao4 = form.watch(`medicamentos.${index}.adesao4`) === "0" ? 1 : 0

    return adesao1 + adesao2 + adesao3 + adesao4
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-teal-700">AVALIAÇÃO FARMÁCIA</h1>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-teal-800">Data</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            {/* Método de administração de insulina */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="metodoAdministracao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Método de administração de insulina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="caneta">Caneta</SelectItem>
                            <SelectItem value="seringa">Seringa</SelectItem>
                            <SelectItem value="bomba">Bomba de insulina</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="insulinaBasal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Insulina Basal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a insulina basal"
                            className="border-teal-300 focus:ring-teal-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="insulinaBolus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Insulina Bolus</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a insulina bolus"
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
            </div>

            {/* Adesão ao tratamento da terapia com insulina */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teal-700 mb-4">
                Adesão ao tratamento da terapia com insulina adaptado de Morisky
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-4/5">Perguntas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1. Você já se esqueceu de tomar alguma dose de insulina?</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina1"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina1-sim" />
                                  <FormLabel htmlFor="adesaoInsulina1-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina1-nao" />
                                  <FormLabel htmlFor="adesaoInsulina1-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      2. Você é negligente com o horário de aplicação das injeções de insulina conforme prescrito pelo
                      seu médico?
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina2"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina2-sim" />
                                  <FormLabel htmlFor="adesaoInsulina2-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina2-nao" />
                                  <FormLabel htmlFor="adesaoInsulina2-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3. Você às vezes para de tomar insulina quando se sente melhor?</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina3"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina3-sim" />
                                  <FormLabel htmlFor="adesaoInsulina3-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina3-nao" />
                                  <FormLabel htmlFor="adesaoInsulina3-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      4. Você às vezes aumenta ou diminui a dose de insulina quando não se sente bem sem o
                      aconselhamento do seu médico?
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina4"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina4-sim" />
                                  <FormLabel htmlFor="adesaoInsulina4-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina4-nao" />
                                  <FormLabel htmlFor="adesaoInsulina4-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-yellow-50">
                    <TableCell className="font-medium">Avaliação da adesão para insulina</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-around">
                        <div>
                          <span className="font-semibold">Escore</span>
                          <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                            {calcularEscoreInsulinaAdesao()}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold">Adesão</span>
                          <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                            {determinarNivelAdesao(calcularEscoreInsulinaAdesao())}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Informação sobre medicamentos a investigar */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-md text-sm">
              <p className="text-gray-700">
                <strong>Importante, fazer a investigação sobre os seguintes medicamento:</strong> Inibidores da
                dipeptidil peptidase-4 (DPP4- gliplitinas); Inibidores do Cotransportador de Sódio-Glicose-1/2
                (SGLT-1/2i - dapaglofozina - Forxiga); Inibidores do Cotransportador de Sódio-Glicose-2 (SGLT-2i-
                empaglifozina - Jardiance); GLYXAMBI (empaglifozina e linaglipitina); GLYXAMBI (empaglifozina e
                linaglipitina); Qterm (saxaglipitina e dapaglifozina); e; agonistas do receptor de GLP-1 (liraglutida
                (Saxenda®), dulaglutida (Trulicity®), exenatida, lixisenatida e tirzepatida (Mounjaro®)).
              </p>
            </div>

            {/* Perfil de medicamentos em uso */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teal-700 mb-4">Perfil de medicamentos em uso</h3>

              {/* Repetir para cada medicamento (5 vezes) */}
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="mb-10 border border-teal-200 rounded-md p-4">
                  <h4 className="text-md font-semibold text-teal-700 mb-4 bg-yellow-200 p-2 rounded">
                    {index + 1}. Medicamento (nome comercial)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.nomeComercial`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Nome comercial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome comercial"
                              className="border-teal-300 focus:ring-teal-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.principioAtivo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-teal-800">Princípio ativo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite o princípio ativo"
                                  className="border-teal-300 focus:ring-teal-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.comPrescricao`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-teal-800">Com prescrição médica</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sim">Sim</SelectItem>
                                  <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.tempoUso`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Tempo de uso</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 6 meses, 2 anos"
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
                      name={`medicamentos.${index}.dataInicio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Data início</FormLabel>
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

                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.dataTermino`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Data término</FormLabel>
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
                                  disabled={(date) => date < new Date("1900-01-01")}
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

                  <FormField
                    control={form.control}
                    name={`medicamentos.${index}.finalidadeUso`}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-teal-800">Finalidade do uso (origem da prescrição ou não)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a finalidade do uso"
                            className="border-teal-300 focus:ring-teal-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Posologia */}
                  <div className="mb-4">
                    <h5 className="text-md font-semibold text-teal-700 mb-2">Posologia</h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-teal-800">Posologia</TableHead>
                          <TableHead className="text-teal-800">Dose</TableHead>
                          <TableHead className="text-teal-800">Horário</TableHead>
                          <TableHead className="text-teal-800">Jejum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[0, 1, 2, 3].map((posIndex) => (
                          <TableRow key={posIndex}>
                            <TableCell>Posologia {posIndex + 1}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`medicamentos.${index}.posologias.${posIndex}.dose`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Dose"
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
                                name={`medicamentos.${index}.posologias.${posIndex}.horario`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Horário"
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
                                name={`medicamentos.${index}.posologias.${posIndex}.jejum`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="sim">Sim</SelectItem>
                                        <SelectItem value="nao">Não</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Adesão ao tratamento medicamento */}
                  <div>
                    <h5 className="text-md font-semibold text-teal-700 mb-2">
                      Adesão ao tratamento medicamento adaptado de Morisky
                    </h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-4/5">Perguntas</TableHead>o
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>1. Você já se esqueceu de tomar alguma dose do medicamento?</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao1`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao1-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao1-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao1-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao1-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            2. Você é negligente com o horário de tomar a medicação conforme prescrito pelo seu médico?
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao2`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao2-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao2-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao2-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao2-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>3. Você às vezes para de tomar a medicação quando se sente melhor?</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao3`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao3-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao3-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao3-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao3-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            4. Você às vezes aumenta ou diminui a dose da medicação quando não se sente bem sem o
                            aconselhamento do seu médico?
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao4`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao4-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao4-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao4-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao4-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-yellow-50">
                          <TableCell className="font-medium">Avaliação da adesão ao tratamento medicamentoso</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-around">
                              <div>
                                <span className="font-semibold">Escore</span>
                                <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                                  {calcularEscoreMedicamentoAdesao(index)}
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold">Adesão</span>
                                <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                                  {determinarNivelAdesao(calcularEscoreMedicamentoAdesao(index))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
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
