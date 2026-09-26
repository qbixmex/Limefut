'use server';

import { getNestAccessToken } from '@/lib/nest-api';
import type { ResponseFetchAction } from '../(services)/fetch-user-cached';
import { fetchUserCached } from '../(services)/fetch-user-cached';

export const fetchUserAction = async (id: string): ResponseFetchAction => {
  const token = await getNestAccessToken();
  const response = await fetchUserCached({ id, token });

  // console.log('RESPONSE:', response); //? Debugging

  return response;
};
