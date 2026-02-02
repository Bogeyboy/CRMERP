<?php


namespace App\Http\Middleware;

use Closure;

class ImageCors
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // Solo aplicar a imágenes
        if ($request->is('storage/*') &&
            in_array($request->getMethod(), ['GET', 'HEAD'])) {

            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
            $response->headers->set('Access-Control-Expose-Headers', 'Content-Length');
            $response->headers->set('Access-Control-Max-Age', '86400');

            // Headers específicos para evitar bloqueo ORB
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('Content-Type', $this->getMimeType($request));
        }

        return $response;
    }

    private function getMimeType($request): string
    {
        $path = $request->path();
        if (str_ends_with($path, '.png')) return 'image/png';
        if (str_ends_with($path, '.jpg') || str_ends_with($path, '.jpeg')) return 'image/jpeg';
        if (str_ends_with($path, '.gif')) return 'image/gif';
        if (str_ends_with($path, '.svg')) return 'image/svg+xml';
        return 'application/octet-stream';
    }
}
