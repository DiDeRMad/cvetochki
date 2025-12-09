import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true';

const hasSmtpCreds = Boolean(smtpHost && smtpUser && smtpPass);

const transporter = hasSmtpCreds
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : nodemailer.createTransport({
      jsonTransport: true,
    });

export const sendPasswordResetEmail = async (to: string, link: string) => {
  const from = process.env.MAIL_FROM || smtpUser || 'no-reply@example.com';
  await transporter.sendMail({
    to,
    from,
    subject: 'Восстановление пароля',
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
        <p>Вы запросили сброс пароля. Перейдите по ссылке ниже, она действует 1 час:</p>
        <p><a href="${link}" style="color:#6b21a8;">Сбросить пароль</a></p>
        <p>Если вы не запрашивали сброс, просто проигнорируйте это письмо.</p>
      </div>
    `,
  });
};

