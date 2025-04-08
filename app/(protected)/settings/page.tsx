"use client";

import { useState, useTransition, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/actions/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const SettingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  isTwoFactorAuthEnabled: z.boolean().optional(),
  role: z.enum(["ADMIN", "USER"]),
}).refine(
  (data) => {
    return (
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.newPassword !== undefined ||
      data.isTwoFactorAuthEnabled !== undefined ||
      data.role !== undefined
    );
  },
  {
    message: "Pelo menos um campo deve ser preenchido para atualizar as configurações.",
    path: [],
  }
);

const SettingsPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const { data: session, status, update } = useSession();
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: undefined,
      newPassword: undefined,
      isTwoFactorAuthEnabled: false,
      role: "USER",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        password: undefined,
        newPassword: undefined,
        isTwoFactorAuthEnabled: (session.user as any)?.isTwoFactorEnabled || false,
        role: (session.user as any)?.role || "USER",
      });
    }
  }, [session, form]);

  useEffect(() => {
    if (status === "loading") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [status]);

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    
    startTransition(async () => {
      try {
        const data = await settings(values);

        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.success) {
          setSuccess(data.success);
          await update();
        }
      } catch (error) {
        console.error("[SETTINGS_ERROR]:", error);
        setError("Algo deu errado!");
      }
    });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-4">
        <Progress value={progress} className="w-[60%]" />
        <p className="text-teal-800">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen">Você precisa estar autenticado para acessar esta página.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-2xl font-bold text-teal-800 text-center">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mx-auto max-w-md">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Nome</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="João da Silva"
                              className="border-teal-300 focus:ring-teal-500"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="joao.silva@exemplo.com"
                              type="email"
                              className="border-teal-300 focus:ring-teal-500"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Senha Atual</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="********"
                              type="password"
                              className="border-teal-300 focus:ring-teal-500"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="********"
                              type="password"
                              className="border-teal-300 focus:ring-teal-500"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isTwoFactorAuthEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Autenticação de Dois Fatores</FormLabel>
                          <Select
                            disabled={isPending}
                            onValueChange={(value) => {
                              const boolValue = value === "true";
                              field.onChange(boolValue);
                            }}
                            value={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                                <SelectValue placeholder="Selecione uma opção" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Ativada</SelectItem>
                              <SelectItem value="false">Desativada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex justify-center space-x-4">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isPending}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;