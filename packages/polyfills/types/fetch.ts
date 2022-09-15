import type {Readable} from 'stream';
import type {
  Headers as WebHeaders,
  Request as WebRequest,
  Response as WebResponse,
} from '@remix-run/web-fetch';
export type {FormData} from '@remix-run/web-fetch';
export type {File, Blob} from '@remix-run/web-file';

export interface NodeRequest extends WebRequest {
  readonly headers: WebHeaders;
  clone(): NodeRequest;
}

export type NodeHeadersInit = ConstructorParameters<typeof WebHeaders>[0];
export type NodeResponseInit = NonNullable<
  ConstructorParameters<typeof WebResponse>[1]
>;
export type NodeRequestInfo =
  | ConstructorParameters<typeof WebRequest>[0]
  | NodeRequest;
export type NodeRequestInit = Omit<
  NonNullable<ConstructorParameters<typeof WebRequest>[1]>,
  'body'
> & {
  body?:
    | NonNullable<ConstructorParameters<typeof WebRequest>[1]>['body']
    | Readable;
};
