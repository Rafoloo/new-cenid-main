import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {

  const htmlContent = `<div style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 20px; display: flex; justify-content: center;">
  <div style="max-width: 600px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: #15c; color: white; text-align: center; padding: 16px; font-size: 20px; font-weight: bold;">
      Código de Verificação
    </div>
    <div style="padding: 20px; color: #374151;">
      <p style="font-size: 16px; line-height: 1.5;">Olá,</p>
      <p style="font-size: 16px; line-height: 1.5;">
        Use o código abaixo para concluir seu processo de autenticação:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; padding: 12px 24px; background: #15c; color: white; font-weight: bold; border-radius: 6px; font-size: 24px; letter-spacing: 2px;">
          ${token}
        </span>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
        Se você não solicitou este código, ignore este e-mail.
      </p>
    </div>
    <div style="background-color: #f3f4f6; text-align: center; padding: 16px; font-size: 14px; color: #9ca3af;">
      &copy; 2025 CENID. Todos os direitos reservados.
    </div>
  </div>
</div>
`
  await resend.emails.send({
    from: "cenid@resend.dev",
    to: email,
    subject: "[CENID] Autenticação de dois Fatores",
    html: htmlContent,
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 20px; display: flex; justify-content: center;">
      <div style="max-width: 600px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #15c; color: white; text-align: center; padding: 16px; font-size: 20px; font-weight: bold;">
          Redefinição de Senha
        </div>
        <div style="padding: 20px; color: #374151;">
          <p style="font-size: 16px; line-height: 1.5;">Olá,</p>
          <p style="font-size: 16px; line-height: 1.5;">
            Você solicitou a redefinição da sua senha. Clique no botão abaixo para continuar:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #15c; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;">
              Redefinir Senha
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
            Caso não tenha solicitado essa redefinição, ignore este e-mail.
          </p>
        </div>
        <div style="background-color: #f3f4f6; text-align: center; padding: 16px; font-size: 14px; color: #9ca3af;">
          &copy; 2025 CENID. Todos os direitos reservados.
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "cenid@resend.dev",
    to: email,
    subject: "[CENID] Redefinição de senha",
    html: htmlContent,
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 20px; display: flex; justify-content: center;">
      <div style="max-width: 600px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #15c; color: white; text-align: center; padding: 16px; font-size: 20px; font-weight: bold;">
          Confirme Seu Email
        </div>
        <div style="padding: 20px; color: #374151;">
          <p style="font-size: 16px; line-height: 1.5;">Olá,</p>
          <p style="font-size: 16px; line-height: 1.5;">
            Clique no botão abaixo para confirmar seu endereço de e-mail e ativar sua conta:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background: #15c; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;">
              Confirmar Email
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
            Se você não solicitou este e-mail, ignore esta mensagem.
          </p>
        </div>
        <div style="background-color: #f3f4f6; text-align: center; padding: 16px; font-size: 14px; color: #9ca3af;">
          &copy; 2025 CENID. Todos os direitos reservados.
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "cenid@resend.dev",
    to: email,
    subject: "[CENID] Confirme Seu Email",
    html: htmlContent,
  });
};