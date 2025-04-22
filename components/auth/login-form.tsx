// components/auth/login-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Key, ArrowRight, ChevronLeft } from "lucide-react";

import { LoginSchema } from "@/schemas";
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

import { login } from "@/actions/login";

export default function LoginForm() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Algo deu errado. Tente novamente."));
    });
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left sidebar */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-2/5 bg-gradient-to-br from-teal-600 to-teal-800 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm z-0"></div>

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
      <div className="w-full lg:w-2/3 xl:w-3/5 flex flex-col">
        <header className="p-6 md:p-8 flex justify-between items-center">
          <div className="lg:hidden flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-teal-800">CENID</h1>
            <p className="text-sm text-gray-500">Centro Interdisciplinar em Diabetes</p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {showTwoFactor ? "Verificação em duas etapas" : "Bem-vindo de volta"}
              </h2>
              <p className="text-gray-600">
                {showTwoFactor
                  ? "Digite o código de verificação que enviamos ao seu email"
                  : "Faça login para acessar sua conta"}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  {showTwoFactor ? (
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Código de verificação
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="123456"
                                className="h-12 rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                              />
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="mail@example.com"
                                  type="email"
                                  className="h-12 rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Senha
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="Sua senha"
                                  type={showPassword ? "text" : "password"}
                                  className="h-12 rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 pl-10"
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
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <div className="flex justify-end mt-1">
                              <Button
                                size="sm"
                                variant="link"
                                asChild
                                className="px-0 font-normal text-teal-600 hover:text-teal-800"
                              >
                                <Link href="/auth/reset">Esqueceu sua senha?</Link>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isPending ? "Processando..." : showTwoFactor ? "Verificar" : "Entrar"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Form>

            {!showTwoFactor && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Ainda não tem uma conta?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-teal-600 hover:text-teal-800"
                  >
                    Criar conta
                  </Link>
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-gray-500">
          © 2025 CENID - Centro Interdisciplinar em Diabetes. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
