export type RawHttpInput = {
  method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  json?: unknown;
  text?: string;
  base64?: string;
  response?: 'json'|'text'|'bytes';
};
