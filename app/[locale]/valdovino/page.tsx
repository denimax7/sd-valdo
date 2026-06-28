'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ValdovinoPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    router.replace(`/${params.locale}/valdovino/concello`);
  }, [params.locale, router]);
  return null;
}
