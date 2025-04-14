"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputMask from "react-input-mask";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Stethoscope, Brain, Dumbbell, Apple, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CaptionProps, useNavigation } from "react-day-picker";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ... (manter todas as validações Zod e tipos existentes)

const ConsultaForm = () => {
  // ... (manter toda a lógica existente de estado e formulários)

  return (
    <div className="min-h-screen bg-white">
      <Card className="max-w-5xl mx-auto my-8 shadow-md rounded-lg border border-gray-100">
        <CardHeader className="bg-teal-100 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-teal-200"
            >
              <ArrowLeft className="h-5 w-5 text-teal-800" />
            </Button>
            <CardTitle className="text-xl font-semibold text-teal-800">Cadastro de Consulta</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Seção de Especialidade - Estilo do primeiro arquivo */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">Selecione a Especialidade*</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleSpecialtyClick('Medicina')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Medicina'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Stethoscope className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Medicina</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Psicologia')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Psicologia'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Brain className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Psicologia</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Educação Física')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Educação Física'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Dumbbell className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Educação Física</span>
              </button>
              <button
                onClick={() => handleSpecialtyClick('Nutrição')}
                className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                  selectedSpecialty === 'Nutrição'
                    ? "border-2 border-teal-500 bg-teal-50"
                    : "border-teal-200 hover:border-teal-500 hover:border-2"
                }`}
              >
                <Apple className="h-8 w-8 mb-2 text-teal-600" />
                <span className="text-teal-800">Nutrição</span>
              </button>
            </div>
          </div>

          {/* Restante do formulário (manter toda a implementação existente) */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ... (manter todas as seções do formulário existente) */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaForm;