import {Headers as WebHeaders} from '@remix-run/web-fetch';
import {NodeRequest} from './data/classes/NodeRequest';
import {NodeResponse} from './data/classes/NodeResponse';
import {fetch} from './data/classes/fetch';

export type {
  NodeHeadersInit as HeadersInit,
  NodeRequestInfo as RequestInfo,
  NodeRequestInit as RequestInit,
  NodeResponseInit as ResponseInit,
} from './types/fetch';
export {FormData} from '@remix-run/web-fetch';
export {Blob, File} from '@remix-run/web-file';
export {
  fetch,
  WebHeaders as Headers,
  NodeRequest as Request,
  NodeResponse as Response,
};

export function registerGlobalFetch() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const self = globalThis as any;
  if (!self.fetch) {
    self.fetch = fetch;
  }
  if (!self.Headers) {
    self.Headers = WebHeaders;
  }
  if (!self.Request) {
    self.Request = NodeRequest;
  }
  if (!self.Response) {
    self.Response = NodeResponse;
  }
  if (!self.AbortController) {
    self.AbortController = AbortController;
  }
}
