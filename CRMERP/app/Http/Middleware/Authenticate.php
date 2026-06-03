<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Para peticiones API, NO redirigir, solo retornar null
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // Solo para peticiones web normales
        return route('login');
    }
}