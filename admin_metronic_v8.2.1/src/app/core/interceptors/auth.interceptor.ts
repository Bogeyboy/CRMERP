import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Verificar si la petición es FormData
    const isFormData = req.body instanceof FormData;
    
    console.log('🔍 Interceptor - Es FormData:', isFormData);
    console.log('🔍 Interceptor - URL:', req.url);
    console.log('🔍 Interceptor - Método:', req.method);
    
    // Si hay token, clonar la request y agregar el header
    if (token) {
      if (isFormData) {
        // Para FormData, NO establecer Content-Type (el navegador lo hace automáticamente con el boundary)
        const cloned = req.clone({
          headers: req.headers
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            // NO establecer Content-Type para FormData
        });
        
        console.log('🔑 Token agregado al interceptor (FormData - sin Content-Type)');
        return next.handle(cloned);
      } else {
        // Para JSON, establecer Content-Type
        const cloned = req.clone({
          headers: req.headers
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        });
        
        console.log('🔑 Token agregado al interceptor (JSON)');
        return next.handle(cloned);
      }
    }
    
    // Si no hay token, enviar la request original
    console.log('⚠️ Sin token en interceptor');
    return next.handle(req);
  }
}