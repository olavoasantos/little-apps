import type {Headers as WebHeaders} from '@remix-run/web-fetch';
import {Response as WebResponse} from '@remix-run/web-fetch';

export class NodeResponse extends WebResponse {
  public get headers(): WebHeaders {
    return super.headers as WebHeaders;
  }

  public clone(): NodeResponse {
    return super.clone() as NodeResponse;
  }
}
