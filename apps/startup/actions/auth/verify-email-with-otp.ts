'use server';

import { redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import {
  findVerificationTokenFromOtp,
  verifyEmail
} from '@workspace/auth/verification';
import { APP_NAME } from '@workspace/common/app';
import { NotFoundError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';
import { sendWelcomeEmail } from '@workspace/email/send-welcome-email';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { verifyEmailWithOtpSchema } from '~/schemas/auth/verify-email-with-otp-schema';

export const verifyEmailWithOtp = actionClient
  .metadata({ actionName: 'verifyEmailWithOtp' })
  .schema(verifyEmailWithOtpSchema)
  .action(async ({ parsedInput }) => {
    const verificationToken = await findVerificationTokenFromOtp(
      parsedInput.otp
    );
    if (!verificationToken) {
      throw new NotFoundError('Verificaton token not found.');
    }
    const user = await prisma.user.findFirst({
      where: { email: verificationToken.identifier },
      select: {
        email: true,
        name: true,
        emailVerified: true
      }
    });
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    if (user.emailVerified) {
      return redirect(routes.dashboard.auth.verifyEmail.Success);
    }

    if (isAfter(new Date(), verificationToken.expires)) {
      return redirect(
        `${routes.dashboard.auth.verifyEmail.Expired}?email=${verificationToken.identifier}`
      );
    }

    await verifyEmail(verificationToken.identifier);

    await sendWelcomeEmail({
      recipient: user.email!,
      appName: APP_NAME,
      name: user.name,
      getStartedLink: routes.dashboard.organizations.Index
    });

    return redirect(routes.dashboard.auth.verifyEmail.Success);
  });
