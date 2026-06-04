'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MATCH_STATUS } from '@/shared/enums';

export const StatusField = () => (
  <FormField
    name="status"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Estado</FormLabel>
        <FormControl>
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MATCH_STATUS.IN_REVIEW}>En revisión</SelectItem>
              <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
              <SelectItem value={MATCH_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
              <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
              <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
