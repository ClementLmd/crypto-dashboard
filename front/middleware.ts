import { NextRequest } from 'next/server';
import { luciaMiddleware } from './utils/auth/middlewareLucia';

export async function middleware(request: NextRequest) {
  const response = await luciaMiddleware(request);

  return response;
}
