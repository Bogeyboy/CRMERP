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
| API Routes (JWT + Spatie)
|--------------------------------------------------------------------------
*/

// ---------- AUTH (SIN TOKEN) ----------
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// ---------- AUTH (CON TOKEN JWT) ----------
Route::middleware('auth:api')->prefix('auth')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/me',      [AuthController::class, 'me']);
});

Route::middleware('auth:api')->group(function () {
    // Ruta para obtener roles (accesible para cualquier usuario autenticado)
    Route::get('/roles/list', [UserAccessController::class, 'listRoles']);
});

// ---------- SOLO SUPER-ADMIN ----------
Route::middleware(['auth:api', 'role:Super-Admin'])->group(function () {

    Route::resource('roles', RolePermissionController::class);

    Route::resource('users', UserAccessController::class)->except(['config']);
    Route::get('/users/config', [UserAccessController::class, 'config']);
    Route::post('/login/{id}', [UserAccessController::class, 'update']);

    // Configuración
    Route::resource('sucursales', SucursaleController::class);
    Route::resource('warehouses', WarehouseController::class);
    Route::resource('sucursal_deliveries', SucursalDeliverieController::class);
    Route::resource('method_payments', MethodPaymentController::class);
    Route::resource('client_segments', ClientSegmentController::class);

    // Categorías
    Route::post('/product_categories/{id}', [ProductCategorieController::class, 'update']);
    Route::resource('product_categories', ProductCategorieController::class);

    // Proveedores
    Route::post('/providers/{id}', [ProviderController::class, 'update']);
    Route::resource('providers', ProviderController::class);

    // Unidades
    Route::post('/units/add-transform', [UnitController::class,'add_transform']);
    Route::delete('/units/delete-transform/{id}', [UnitController::class, 'delete_transform']);
    Route::resource('units', UnitController::class);

    // Productos
    Route::post('/products/index', [ProductController::class, 'index']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::get('/products/config', [ProductController::class, 'config']);
    Route::resource('products', ProductController::class);

    Route::resource('product_wallets', ProductWalletController::class);
    //Route::put('/product_warehouses/{id}', [ProductWarehouseController::class, 'update']);
    Route::resource('product_warehouses', ProductWarehouseController::class);
});

Route::get("excel/export-products", [ProductController::class,"export_products"]);
