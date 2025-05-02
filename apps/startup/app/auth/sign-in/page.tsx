import * as React from 'react';
import { type Metadata } from 'next';
import Image from 'next/image';

import { SignInCard } from '~/components/auth/sign-in/sign-in-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Sign in')
};

export default async function SignInPage(): Promise<React.JSX.Element> {
  return (
    <div className="flex w-full h-full">
      <div className="w-[45%] h-full p-[60px] flex items-center justify-center">
        <SignInCard />
      </div>

      <div className="bg-primary bg-linear-gradient relative w-full max-w-[55%] h-screen flex items-center justify-center overflow-hidden rounded-l-[30px]">
        <div className="w-full h-auto px-10 py-16 space-y-8 relative z-10">
          <div className="w-full max-w-[76%] space-y-3 pl-4">
            <h1 className="text-white text-4xl font-bold leading-[150%]">
              Empowering Startups with Data-Driven Insights
            </h1>
            <p className="text-white text-sm font-bold">
              Gain real-time analytics and track key metrics to accelerate
              growth and innovation.
            </p>
          </div>

          <Image
            src="/assets/login/login-hero.png"
            layout="responsive"
            width={624}
            height={380}
            priority
            quality={100}
            alt="Login - app screenshot"
            className="w-full h-auto p-0"
          />
        </div>

        {/* <div className="bg-linear-gradient absolute top-[-20%] left-[-60%] z-0 h-[calc(100vh+200px)] w-[calc(100vw+200px)] rotate-[88.75deg]" /> */}
      </div>
    </div>
  );
}
