import { baseQuery } from '@drivebase/web/lib/redux/base.query';
import { User } from '@prisma/client';
import { createApi } from '@reduxjs/toolkit/query/react';

import { ApiResponse } from './api.type';

const profileApi = createApi({
  baseQuery,
  reducerPath: 'profileApi',
  endpoints: (build) => ({
    getProfile: build.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/auth/profile',
      }),
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
export default profileApi;
