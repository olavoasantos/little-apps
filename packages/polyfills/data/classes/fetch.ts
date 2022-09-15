import type {NodeRequestInfo, NodeRequestInit} from '@/types/fetch';
import {fetch as webFetch} from '@remix-run/web-fetch';

export const fetch: typeof webFetch = (
  info: NodeRequestInfo,
  init?: NodeRequestInit,
) => {
  init = {
    compress: false,
    ...init,
  };

  return webFetch(info, init as RequestInit);
};
