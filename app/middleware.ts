// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*'], // Define las rutas protegidas
};

export function middleware(req: NextRequest) {
    // Obtén las cookies de la solicitud (si el token se guarda en una cookie)
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies['auth-token-storage']; // Suponiendo que el token esté en 'auth-token'
  
    // Si no existe un token, redirige al usuario a la página de login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    // Si el token está presente, permite la solicitud
    return NextResponse.next();
  }