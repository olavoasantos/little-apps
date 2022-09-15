import type {NodeRequestInfo, NodeRequestInit} from '@/types/fetch';
import {
  Headers as WebHeaders,
  Request as WebRequest,
} from '@remix-run/web-fetch';

export class NodeRequest extends WebRequest {
  constructor(info: NodeRequestInfo, init?: NodeRequestInit) {
    super(info, init as RequestInit);
  }

  public get headers(): WebHeaders {
    return super.headers as WebHeaders;
  }

  public clone(): NodeRequest {
    return super.clone() as NodeRequest;
  }
}
