import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Tournament } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '../../../../lib/prisma';
import { Button } from '@/components/ui/button';
import SignInOutButton from './SignInOutButton';
import TournamentList from '@/components/TournamentList';

export default async function Dashboard() {
  const t = await getTranslations('Dashboard');
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-5">{t('login_prompt')}</h1>
        <SignInOutButton isSignedIn={false} />
      </main>
    );
  }

  const { user } = session;
  const tournaments = await prisma.tournament.findMany({
    where: { organizerId: user.id },
    select: {
      id: true,
      name: true,
      startTime: true,
      locationName: true,
      street: true,
      city: true,
      zipCode: true,
      numberOfCourts: true,
      matchDuration: true,
      breakDuration: true,
      organizerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Transform the data to match the Tournament type
  const transformedTournaments: Tournament[] = tournaments.map(
    (tournament) => ({
      id: tournament.id,
      name: tournament.name,
      startTime: new Date(tournament.startTime),
      locationName: tournament.locationName,
      street: tournament.street,
      city: tournament.city,
      zipCode: tournament.zipCode,
      numberOfCourts: tournament.numberOfCourts,
      matchDuration: tournament.matchDuration,
      breakDuration: tournament.breakDuration,
      organizerId: tournament.organizerId,
      createdAt: new Date(tournament.createdAt),
      updatedAt: new Date(tournament.updatedAt),
    }),
  );

  return (
    <main className="flex flex-col items-center justify-start p-4 min-h-screen mt-24">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            {t('dashboard_welcome')} {user.name} 👋
          </h1>
          <Link href="/create-tournament">
            <Button>{t('button_create_tournament')}</Button>{' '}
          </Link>
        </div>
        <div className="border-b-2 border-tertiary my-4 mb-10" />
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-white mb-5">
            {t('your_tournaments')}
          </h2>
          <TournamentList tournaments={transformedTournaments} />
        </div>
      </div>
    </main>
  );
}
