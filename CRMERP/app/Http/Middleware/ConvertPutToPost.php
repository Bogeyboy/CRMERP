<?php

namespace App\Http\Middleware;

use Closure;

class ConvertPutToPost
{
    public function handle($request, Closure $next)
    {
        if ($request->method() == 'POST' && $request->has('_method')) {
            $method = strtoupper($request->input('_method'));
            if (in_array($method, ['PUT', 'PATCH', 'DELETE']))
            {
                $request->setMethod($method);
            }
        }
        
        return $next($request);
    }
}