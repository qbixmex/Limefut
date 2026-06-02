'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveMatchSchema } from '@/shared/schemas';
import type z from 'zod';

export const useMatchForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const date = new Date();
  date.setHours(8, 0, 0, 0);

  const formDefaultValues = {
    localTeamId: '',
    visitorTeamId: '',
    localTeamScore: 0,
    visitorTeamScore: 0,
    localPenaltyShoots: 0,
    visitorPenaltyShoots: 0,
    category: '',
    field: '',
    matchDate: date,
    referee: '',
    remarks: '',
  };

  const form = useForm<z.infer<typeof SaveMatchSchema>>({
    resolver: zodResolver(SaveMatchSchema),
    defaultValues: {
      ...formDefaultValues,
      category: searchParams.get('category') ?? '',
    },
    mode: 'onChange',
  });

  const handleClearForm = () => {
    const params = new URLSearchParams();
    form.reset(formDefaultValues);
    router.push(`${pathname}?${params}`);
  };

  const onSubmit = async (data: z.infer<typeof SaveMatchSchema>) => {
    console.clear();
    console.table(data);
  };

  return {
    form,
    onSubmit,
    handleClearForm,
  };
};
