/*
  Warnings:

  - You are about to drop the `consultations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_patientId_fkey";

-- DropTable
DROP TABLE "consultations";

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "dataConsulta" TEXT NOT NULL,
    "horaConsulta" TEXT NOT NULL,
    "duracaoConsulta" INTEGER NOT NULL,
    "tipoConsulta" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "profissional" TEXT NOT NULL,
    "motivoConsulta" TEXT NOT NULL,
    "sintomasRelatados" TEXT,
    "statusConsulta" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "ultimaGlicemia" TEXT,
    "ultimaHemoglobina" TEXT,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "precisaAcompanhante" BOOLEAN NOT NULL,
    "nomeAcompanhante" TEXT,
    "telefoneAcompanhante" TEXT,
    "salaAtendimento" TEXT,
    "consultaRemota" BOOLEAN NOT NULL,
    "linkConsultaRemota" TEXT,
    "enviarLembreteEmail" BOOLEAN NOT NULL,
    "enviarLembreteSMS" BOOLEAN NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
