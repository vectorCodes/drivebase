import { UploadFileDto } from '@drivebase/files/dtos/upload.file.dto';
import type {
  FindWorkspaceFilesQuery,
  PaginatedResult,
} from '@drivebase/files/files.service';
import { baseQuery } from '@drivebase/web/lib/redux/base.query';
import { File as DrivebaseFile, Provider } from '@prisma/client';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from './api.type';

// Extended query interface to add search param
export interface FilesQueryParams extends FindWorkspaceFilesQuery {
  search?: string;
}

type FileWithProvider = DrivebaseFile & {
  fileProvider: Provider;
};

const filesApi = createApi({
  baseQuery,
  reducerPath: 'filesApi',
  tagTypes: ['files'],
  endpoints: (builder) => ({
    getFiles: builder.query<
      ApiResponse<PaginatedResult<FileWithProvider>>,
      FilesQueryParams
    >({
      query: (query) => ({
        url: '/files',
        params: query,
      }),
      providesTags: ['files'],
    }),
    createFolder: builder.mutation<
      ApiResponse<DrivebaseFile>,
      {
        name: string;
        parentPath: string;
      }
    >({
      query: ({ name, parentPath }) => ({
        url: '/files',
        method: 'POST',
        body: { name, parentPath, isFolder: true },
      }),
      invalidatesTags: ['files'],
    }),
    uploadFile: builder.mutation<
      ApiResponse<DrivebaseFile>,
      UploadFileDto & {
        files: File[];
      }
    >({
      query: ({ files, providerId, path }) => {
        const formData = new FormData();

        formData.append('providerId', providerId);
        formData.append('path', path);

        files.forEach((file) => {
          formData.append('files', file);
        });

        return {
          url: '/files/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['files'],
    }),
    starFile: builder.mutation<ApiResponse<DrivebaseFile>, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'PUT',
        body: { isStarred: true },
      }),
      invalidatesTags: ['files'],
    }),
    unstarFile: builder.mutation<ApiResponse<DrivebaseFile>, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'PUT',
        body: { isStarred: false },
      }),
      invalidatesTags: ['files'],
    }),
    renameFile: builder.mutation<
      ApiResponse<DrivebaseFile>,
      { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/files/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['files'],
    }),
    deleteFile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['files'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useCreateFolderMutation,
  useUploadFileMutation,
  useStarFileMutation,
  useUnstarFileMutation,
  useRenameFileMutation,
  useDeleteFileMutation,
} = filesApi;
export default filesApi;
