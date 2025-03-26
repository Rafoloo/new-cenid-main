"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Não autorizado!" };
    }

    // Se houver uma senha atual, verificar se está correta
    if (values.password && values.newPassword) {
      const currentPassword = await db.user.findUnique({
        where: { id: user.id },
        select: { password: true }
      });

      if (!currentPassword?.password) {
        return { error: "Senha atual não encontrada!" };
      }

      const passwordsMatch = await bcrypt.compare(
        values.password,
        currentPassword.password
      );

      if (!passwordsMatch) {
        return { error: "Senha atual incorreta!" };
      }
    }

    // Preparar os dados para atualização
    const updateData: any = {};

    if (values.name) {
      updateData.name = values.name;
    }

    if (values.email && values.email !== user.email) {
      const existingUser = await db.user.findUnique({
        where: { email: values.email }
      });

      if (existingUser) {
        return { error: "E-mail já está em uso!" };
      }

      updateData.email = values.email;
      updateData.emailVerified = null;
    }

    if (values.newPassword) {
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      updateData.password = hashedPassword;
    }

    if (values.role) {
      const currentUserRole = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true }
      });

      if (currentUserRole?.role !== "ADMIN") {
        return { error: "Não autorizado a alterar função!" };
      }

      updateData.role = values.role;
    }

    if (typeof values.isTwoFactorAuthEnabled !== "undefined") {
      updateData.isTwoFactorEnabled = values.isTwoFactorAuthEnabled;
    }

    // Atualizar usuário
    await db.user.update({
      where: { id: user.id },
      data: updateData
    });

    return { success: "Configurações atualizadas!" };
  } catch (error) {
    console.error("[SETTINGS_ERROR]", error);
    return { error: "Algo deu errado!" };
  }
};