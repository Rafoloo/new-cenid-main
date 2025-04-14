"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email inválido",
    }),
    password: z.string().min(6, {
      message: "Mínimo de 6 caracteres",
    }),
    name: z.string().min(1, {
      message: "Nome é obrigatório",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";

import { register } from "@/actions/register";

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.sucess) {
            setSuccess(data.sucess);
            form.reset();
          }
        })
        .catch(() => setError("Algo deu errado. Tente novamente."));
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white">
      {/* Left sidebar */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-2/5 bg-gradient-to-br from-teal-600 to-teal-800 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-900/20 backdrop-blur-sm z-0"></div>

        <div className="p-12 z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">CENID</h1>
            <p className="text-xl text-teal-100 mt-4">Centro Interdisciplinar em Diabetes</p>
          </div>
        </div>

        <div className="space-y-8 p-12 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-3">Acesso completo ao sistema</h3>
            <p className="text-teal-100 text-sm">
              Gerencie prontuários, consultas e acompanhamentos em uma única plataforma integrada.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-3">Dados seguros</h3>
            <p className="text-teal-100 text-sm">
              Todas as informações são criptografadas e protegidas.
            </p>
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div className="w-full lg:w-2/3 xl:w-3/5 flex flex-col min-h-screen">
        <header className="p-4 sm:p-6 md:p-8 flex justify-between items-center">
          <div className="lg:hidden w-full flex flex-col items-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-teal-800">CENID</h1>
            <p className="text-xs sm:text-sm text-gray-500">Centro Interdisciplinar em Diabetes</p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Criar conta</h2>
              <p className="text-sm sm:text-base text-gray-600">Preencha os dados abaixo para se cadastrar.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seu nome"
                          disabled={isPending}
                          className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="mail@example.com"
                            type="email"
                            className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Crie uma senha"
                            type={showPassword ? "text" : "password"}
                            className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isPending}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                        Confirmar senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Confirme sua senha"
                            type={showPassword ? "text" : "password"}
                            className="h-10 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isPending}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full h-10 sm:h-12 text-sm sm:text-base bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isPending ? "Criando conta..." : "Cadastrar"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Form>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-800">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </main>

        <footer className="p-4 sm:p-6 text-center text-xs sm:text-sm text-gray-500">
          © 2025 CENID - Centro Interdisciplinar em Diabetes. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
