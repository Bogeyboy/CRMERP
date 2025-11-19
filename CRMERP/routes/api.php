<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccessController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Configuration\UnitController;
use App\Http\Controllers\Product\ProductWalletController;
use App\Http\Controllers\Configuration\ProviderController;
use App\Http\Controllers\Configuration\SucursaleController;
use App\Http\Controllers\Configuration\WarehouseController;
use App\Http\Controllers\Product\ProductWarehouseController;
use App\Http\Controllers\Configuration\ClientSegmentController;
use App\Http\Controllers\Configuration\MethodPaymentController;
use App\Http\Controllers\Configuration\ProductCategorieController;
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

    //Rutas para sucursales
    Route::resource("sucursales", SucursaleController::class);

    //Rutas para almacenes
    Route::resource("warehouses", WarehouseController::class);

    //Rutas para sucursales de entrega
    Route::resource("sucursal_deliveries", SucursalDeliverieController::class);

    //Rutas para métodos de pago
    Route::resource("method_payments", MethodPaymentController::class);

    //Rutas para segmentos de clientes
    Route::resource("client_segments", ClientSegmentController::class);

    //Rutas para categorias de productos
    Route::post('/product_categories/{id}', [ProductCategorieController::class, 'update']);
    Route::resource("product_categories", ProductCategorieController::class);

    //Rutas para proveedores
    Route::post('/providers/{id}', [ProviderController::class, 'update']);
    Route::resource("providers", ProviderController::class);

    //Rutas para unidades de transformación
    Route::post('/units/add-transform', [UnitController::class,'add_transform']);
    Route::delete('/units/delete-transform/{id}', [UnitController::class, 'delete_transform']);
    Route::resource("units", UnitController::class);

    //Rutas para productos
    Route::post('/products/index', [ProductController::class, 'index']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::get('/products/config', [ProductController::class, 'config']);

    Route::resource("products", ProductController::class);

    Route::resource("product_wallets", ProductWalletController::class);
    Route::resource("product_warehouses", ProductWarehouseController::class);
});
