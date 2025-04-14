"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ConsultaFormProps {
  especialidade: string
}

export default function ConsultaForm({ especialidade }: ConsultaFormProps) {
  const [date, setDate] = useState<Date>()

  return (
    <div className="space-y-6 mt-6">
      {/* Dados do Paciente */}
      <div>
        <h2 className="text-green-700 mb-4 border-b pb-2">Dados do Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF do Paciente</Label>
            <Input id="cpf" placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Paciente</Label>
            <Input id="nome" placeholder="Digite o nome completo" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="email">Email do Paciente</Label>
          <Input id="email" type="email" placeholder="exemplo@email.com" />
        </div>
      </div>

      {/* Dados da Consulta */}
      <div>
        <h2 className="text-green-700 mb-4 border-b pb-2">Dados da Consulta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="data">Data da Consulta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Escolha uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="horario">Horário da Consulta</Label>
            <div className="flex">
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">--:--</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="duracao">Duração (minutos)</Label>
            <Input id="duracao" type="number" defaultValue="60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Consulta</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primeira">Primeira Consulta</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
                <SelectItem value="avaliacao">Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input id="especialidade" defaultValue={especialidade} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profissional">Profissional</Label>
            <Input id="profissional" placeholder="Digite o nome do profissional" />
          </div>
        </div>
      </div>

      {/* Motivo e Observações */}
      <div>
        <h2 className="text-green-700 mb-4 border-b pb-2">Motivo e Observações</h2>
        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo da Consulta</Label>
          <Textarea id="motivo" placeholder="Descreva o motivo da consulta" rows={4} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-green-600 hover:bg-green-700">Cadastrar Consulta</Button>
      </div>
    </div>
  )
}
