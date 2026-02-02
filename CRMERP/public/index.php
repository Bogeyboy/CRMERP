<?php

if (isset($_SERVER['REQUEST_URI'])) {
    $uri = $_SERVER['REQUEST_URI'];

    if (str_starts_with($uri, '/storage/')) {
        $filePath = __DIR__.'/../storage/app/public/'.substr($uri, 8);

        if (file_exists($filePath)) {
            $mimeTypes = [
                'png' => 'image/png',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif' => 'image/gif',
                'ico' => 'image/x-icon',
                'css' => 'text/css',
                'js' => 'application/javascript',
                'svg' => 'image/svg+xml',
                'pdf' => 'application/pdf',
            ];

            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $contentType = $mimeTypes[$ext] ?? mime_content_type($filePath);

            header("Content-Type: $contentType");
            header("Content-Length: " . filesize($filePath));
            readfile($filePath);
            exit;
        }
    }
}

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
