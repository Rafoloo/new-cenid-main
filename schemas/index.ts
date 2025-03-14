import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string())
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6,{
        message: "Mínimo de 6 caracteres"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Credenciais Inválidas!"
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Credenciais Inválidas!"
    }),
    password: z.string().min(1, {
        message: "Credenciais Inválidas!"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email é obrigatório"
    }),
    password: z.string().min(6, {
        message: "Mínimo de 6 caracteres"
    }),
    name: z.string().min(1, {
        message: "Nome é obrigatório",
    })

});