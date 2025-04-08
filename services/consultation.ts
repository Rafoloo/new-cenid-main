import { db } from "@/lib/db";
import { Consultation } from "@/types/consultation";

export async function createConsultation(data: Consultation) {
  try {
    // First, find or create the patient
    const patient = await db.patient.upsert({
      where: {
        cpf: data.cpf.replace(/\D/g, '')
      },
      update: {
        nome: data.nomePaciente,
        // Add other fields you want to update if patient exists
      },
      create: {
        nome: data.nomePaciente,
        cpf: data.cpf.replace(/\D/g, ''),
        email: '', // Required field, you might want to add this to your form
        // Add other required patient fields
      }
    });

    // Then create the consultation with the patient connection
    const consultation = await db.consultation.create({
      data: {
        patient: {
          connect: {
            id: patient.id
          }
        },
        nomePaciente: data.nomePaciente,
        cpf: data.cpf.replace(/\D/g, ''),
        dataConsulta: new Date(data.dataConsulta),
        horaConsulta: data.horaConsulta,
        duracaoConsulta: data.duracaoConsulta,
        tipoConsulta: data.tipoConsulta,
        especialidade: data.especialidade,
        profissional: data.profissional,
        motivoConsulta: data.motivoConsulta,
        sintomasRelatados: data.sintomasRelatados || null,
        statusConsulta: data.statusConsulta,
        prioridade: data.prioridade,
        ultimaGlicemia: data.ultimaGlicemia || null,
        ultimaHemoglobina: data.ultimaHemoglobina || null,
        medicamentos: data.medicamentos || null,
        alergias: data.alergias || null,
        precisaAcompanhante: data.precisaAcompanhante,
        nomeAcompanhante: data.nomeAcompanhante || null,
        telefoneAcompanhante: data.telefoneAcompanhante || null,
        salaAtendimento: data.salaAtendimento || null,
        consultaRemota: data.consultaRemota,
        linkConsultaRemota: data.linkConsultaRemota || null,
        enviarLembreteEmail: data.enviarLembreteEmail,
        enviarLembreteSMS: data.enviarLembreteSMS,
        observacoes: data.observacoes || null
      }
    });

    return { success: true, data: consultation };
  } catch (error) {
    console.error('Error creating consultation:', error);
    return { success: false, error: 'Failed to create consultation' };
  }
}