'use client';

import { toast } from 'sonner';

type TOAST_TYPE = 'info' | 'error' | 'warning' | 'success';

export const showToast = ({
  type,
  message,
}: {
  type: TOAST_TYPE,
  message: string,
}) => {
  switch (type) {
    case 'info':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
  }
};
