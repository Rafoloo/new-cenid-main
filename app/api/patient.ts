import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }

  try {
    const { search, diagnostico, page = "1", limit = "10" } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Filtros dinâmicos
    const where: any = {};
    if (search) {
      where.OR = [
        { nome: { contains: search as string, mode: "insensitive" } },
        { cpf: { contains: search as string } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (diagnostico && diagnostico !== "todos") {
      where.diagnostico = diagnostico as string;
    }


    const patients = await prisma.patient.findMany({
      where,
      skip,
      take,
      orderBy: { dateCadastro: "desc" }, // Ordenar por data de cadastro
    });

    const total = await prisma.patient.count({ where });

    res.status(200).json({
      patients,
      total,
      pages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pacientes" });
  } finally {
    await prisma.$disconnect();
  }
}