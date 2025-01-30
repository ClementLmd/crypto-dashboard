import { Response } from 'superagent';

declare module 'supertest' {
  interface Test extends Promise<Response> {
    send(data: unknown): this;
    set(key: string, value: string | string[]): this;
    expect(status: number): this;
    end(): Promise<Response>;
  }
}
