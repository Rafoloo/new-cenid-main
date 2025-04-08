/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "cartao_sus" TEXT,
    "rg" TEXT,
    "telefone" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "ocupacao" TEXT,
    "sexo" TEXT,
    "endereco" TEXT,
    "municipio" TEXT,
    "numero" TEXT,
    "tipo_atendimento" TEXT,
    "diagnostico" TEXT,
    "outras_formas_dm" TEXT,
    "data_diagnostico" TIMESTAMP(3),
    "gestante" TEXT,
    "semanas_gestacao" INTEGER,
    "amamentando" TEXT,
    "tempo_pos_parto" TEXT,
    "deficiencia" TEXT,
    "tipo_deficiencia" TEXT,
    "historico_dm1" TEXT,
    "parentesco_dm1" TEXT,
    "historico_dm2" TEXT,
    "parentesco_dm2" TEXT,
    "historico_outras_formas_dm" TEXT,
    "parentesco_outras_formas_dm" TEXT,
    "metodo_insulina" TEXT,
    "marca_modelo_bomba" TEXT,
    "metodo_monitoramento_glicemia" TEXT,
    "marca_modelo_glicometro_sensor" TEXT,
    "uso_app_glicemia" TEXT,
    "outros_apps" TEXT,
    "nome_responsavel" TEXT,
    "cpf_responsavel" TEXT,
    "rg_responsavel" TEXT,
    "parentesco_responsavel" TEXT,
    "telefone_responsavel" TEXT,
    "ocupacao_responsavel" TEXT,
    "data_nascimento_responsavel" TIMESTAMP(3),
    "anexar" BYTEA,
    "auxilio" TEXT,
    "outros_auxilios" TEXT,
    "possui_celular_com_acesso_a_internet" TEXT,
    "datecadastro" TIMESTAMP(3),

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "_id" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "nomePaciente" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataConsulta" TIMESTAMP(3) NOT NULL,
    "horaConsulta" TEXT NOT NULL,
    "duracao_consulta" INTEGER NOT NULL,
    "tipo_consulta" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "profissional" TEXT NOT NULL,
    "motivo_consulta" TEXT NOT NULL,
    "sintomas_relatados" TEXT,
    "status_consulta" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "ultima_glicemia" TEXT,
    "ultima_hemoglobina" TEXT,
    "medicamentos" TEXT,
    "alergias" TEXT,
    "precisa_acompanhante" BOOLEAN NOT NULL DEFAULT false,
    "nome_acompanhante" TEXT,
    "telefone_acompanhante" TEXT,
    "sala_atendimento" TEXT,
    "consulta_remota" BOOLEAN NOT NULL DEFAULT false,
    "link_consulta_remota" TEXT,
    "enviar_lembrete_email" BOOLEAN NOT NULL DEFAULT true,
    "enviar_lembrete_sms" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
