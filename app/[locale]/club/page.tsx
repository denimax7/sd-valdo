'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClubPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    router.replace(`/${params.locale}/club/historia`);
  }, [params.locale, router]);
  return null;
}
