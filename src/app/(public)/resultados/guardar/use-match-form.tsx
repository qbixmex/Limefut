'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveMatchSchema } from '@/shared/schemas';
import { toast } from 'sonner';
import type z from 'zod';
import { savePublicMatchAction } from '@/app/(public)/resultados/(actions)/savePublicMatchAction';

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
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId);
    formData.append('visitorTeamId', data.visitorTeamId);
    formData.append('localTeamScore', String(data.localTeamScore));
    formData.append('visitorTeamScore', String(data.visitorTeamScore));

    if (data.localPenaltyShoots) {
      formData.append('localPenaltyShoots', String(data.localPenaltyShoots));
    }

    if (data.visitorPenaltyShoots) {
      formData.append('visitorPenaltyShoots', String(data.visitorPenaltyShoots));
    }

    formData.append('category', String(data.category));
    formData.append('field', String(data.field));
    formData.append('matchDate', String(data.matchDate));
    formData.append('referee', String(data.referee));
    formData.append('remarks', String(data.remarks));

    const response = await savePublicMatchAction(formData);

    if (!response.ok) {
      toast.error('Hubo un error', {
        description: response.message,
      });

      form.reset(formDefaultValues);
      return;
    }

    toast.success('Formulario enviado', {
      description: response.message,
      duration: 5000,
    });

    console.clear();
    console.table(data);
  };

  return {
    form,
    onSubmit,
    handleClearForm,
  };
};
