<?php

use App\Http\Controllers\Configuration\ProductCategorieController;
use App\Http\Controllers\Configuration\ProviderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccessController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\Configuration\SucursaleController;
use App\Http\Controllers\Configuration\WarehouseController;
use App\Http\Controllers\Configuration\ClientSegmentController;
use App\Http\Controllers\Configuration\MethodPaymentController;
use App\Http\Controllers\Configuration\SucursalDeliverieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */

Route::middleware('auth:sanctum')->get('/user', function (Request $request){
    return $request->user();
});

Route::group([
    //'middleware' => 'auth:api',
    'prefix' => 'auth',
    //'middleware' => ['auth:api']//, 'permission:publish articles|edit articles'],
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

Route::group([
    'middleware' => 'auth:api',
    //'prefix' => 'auth',
], function ($router) {
    Route::resource("roles", RolePermissionController::class);
    Route::post('/login/{id}', [UserAccessController::class, 'update']);
    Route::get('/users/config', [UserAccessController::class, 'config']);
    Route::resource("users", UserAccessController::class);
    //Route::post('/users/{user}', [UserAccessController::class, 'update']);

    Route::resource("sucursales", SucursaleController::class);

    Route::resource("warehouses", WarehouseController::class);

    Route::resource("sucursal_deliveries", SucursalDeliverieController::class);

    Route::resource("method_payments", MethodPaymentController::class);

    Route::resource("client_segments", ClientSegmentController::class);

    Route::post('/product_categories/{id}', [ProductCategorieController::class, 'update']);
    Route::resource("product_categories", ProductCategorieController::class);

    Route::post('/providers/{id}', [ProviderController::class, 'update']);
    Route::resource("providers", ProviderController::class);
});