'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EquiposPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    router.replace(`/${params.locale}/equipos/primer-equipo`);
  }, [params.locale, router]);
  return null;
}
