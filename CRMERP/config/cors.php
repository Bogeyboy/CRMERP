<?php

/* return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'auth/*', 'excel/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200', 'http://127.0.0.1:4200'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
]; */

/* return [
    'paths' => ['*'], // Permitir TODAS las rutas
    'allowed_methods' => ['*'], // Permitir TODOS los métodos
    'allowed_origins' => ['*'], // Temporalmente permitir todos (solo desarrollo)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Permitir TODOS los headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
]; */
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200', 'http://127.0.0.1:4200'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
