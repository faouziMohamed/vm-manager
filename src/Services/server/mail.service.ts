/* eslint-disable @typescript-eslint/restrict-template-expressions */
// ttyuid@protonmail.com
import nodemailer from 'nodemailer';

import { VERIFY_EMAIL_PAGE } from '@/lib/client-route';
import { createVerificationToken } from '@/lib/db/queries';
import { AuthError } from '@/lib/Exceptions/auth.exceptions';
import { jwtSignData } from '@/lib/server.utils';
import { AppUser } from '@/lib/types';

function createMailTransporter() {
  const host = process.env.EMAIL_SERVER_HOST!;
  const port = Number(process.env.EMAIL_SERVER_PORT!);
  const user = process.env.EMAIL_SERVER_USER!;
  const pass = process.env.EMAIL_SERVER_PASSWORD!;
  const secure = true;

  return nodemailer.createTransport({
    port,
    host,
    secure,
    auth: { user, pass },
    connectionTimeout: 25000,
  });
}

const transporter = createMailTransporter();

async function sendVerificationLink(user: AppUser, token: string) {
  // eslint-disable-next-line no-console
  console.log('Sending email to', user.email, 'using ', process.env.EMAIL_FROM);
  const link = `${process.env.NEXTAUTH_URL}${VERIFY_EMAIL_PAGE}?token=${token}`;
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
  let tk: string;
  try {
    tk = jwtSignData({ email: user.email });
    await createVerificationToken(user.id, tk);
  } catch (err) {
    const e = err as Error;
    // eslint-disable-next-line no-console
    console.error('Error creating verification token', e.message);
    throw new AuthError(e.message);
  }
  try {
    const ack = await sendVerificationLink(user, tk);
    // eslint-disable-next-line no-console
    console.log('Email sent', ack);
  } catch (err) {
    const e = err as Error;
    // eslint-disable-next-line no-console
    console.error('Error sending email');
    throw new AuthError(e.message);
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
