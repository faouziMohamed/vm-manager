/* eslint-disable @typescript-eslint/restrict-template-expressions */
// ttyuid@protonmail.com
import { createTransport } from 'nodemailer';

import { createVerificationToken } from '@/lib/db/queries';
import { jwtSignData } from '@/lib/server.utils';
import { AppUser } from '@/lib/types';

const transporter = createTransport(process.env.EMAIL_SERVER);

async function sendVerificationLink(user: AppUser, token: string) {
  const link = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Verify your email address',
    text: `Click on the following link to verify your email address: ${link}`,
    html: ` <p>Click on the following link to verify your email address:</p>
            <p>
              <a href="${link}">${link}</a>
            </p>`,
  });
}

export async function sendVerificationEmail(user: AppUser) {
  const tk = jwtSignData({ email: user.email });
  await createVerificationToken(user.id, tk);
  try {
    const ack = await sendVerificationLink(user, tk);
    // eslint-disable-next-line no-console
    console.log('Email sent', ack.messageId);
  } catch (err) {
    const e = err as Error;
    // eslint-disable-next-line no-console
    console.error('Error sending email', e.message);
  }
}

export async function sendAccountDeletedEmail(email: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your account has been deleted',
    text: `Your account has been deleted because you did not verify your email address within 4 hours`,
    html: `<p>Your account has been deleted because you did not verify your email address within 4 hours</p>`,
  });
}
