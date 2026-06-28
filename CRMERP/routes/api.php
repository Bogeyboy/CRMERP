<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\Configuration\ClientSegmentController;
use App\Http\Controllers\Configuration\MethodPaymentController;
use App\Http\Controllers\Configuration\ProductCategorieController;
use App\Http\Controllers\Configuration\ProviderController;
use App\Http\Controllers\Configuration\SucursalDeliverieController;
use App\Http\Controllers\Configuration\SucursaleController;
use App\Http\Controllers\Configuration\UnitController;
use App\Http\Controllers\Configuration\WarehouseController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductWalletController;
use App\Http\Controllers\Product\ProductWarehouseController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserAccessController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::post('/products/import', [ProductController::class, 'import_product']);

// ---------- AUTH (CON TOKEN JWT) ----------
Route::middleware('auth:api')->prefix('auth')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/me',      [AuthController::class, 'me']);
});
Route::get('/test-products', function() {
    return response()->json(['message' => 'Test route works']);
});
// Rutas accesibles para cualquier usuario autenticado (con permisos específicos)
Route::middleware('auth:api')->group(function () {
    // Ruta para obtener roles (accesible para cualquier usuario autenticado)
    Route::get('/roles/list', [UserAccessController::class, 'listRoles']);

    // Productos - rutas con permisos
    Route::post('/products/index', [ProductController::class, 'index'])
        ->middleware('permission:list_product');

    Route::get('/products/config', [ProductController::class, 'config'])
        ->middleware('permission:list_product');

    Route::get('/products/{id}', [ProductController::class, 'show'])
        ->middleware('permission:list_product');

    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:register_product');

    // Para actualizar - acepta PUT explícitamente
    Route::put('/products/{id}', [ProductController::class, 'update'])
        ->middleware('permission:edit_product');

    // También acepta POST con _method=PUT para formularios
    Route::post('/products/{id}', [ProductController::class, 'update'])
        ->middleware('permission:edit_product');

    Route::delete('/products/{id}', [ProductController::class, 'destroy'])
        ->middleware('permission:delete_product');
    
    // Clientes - rutas con permisos
    Route::get('/clients/config', [ClientController::class, 'config']);
    
    // CRUD de clientes con permisos específicos
    Route::get('/clients', [ClientController::class, 'index'])
        ->middleware('permission:list_clients');
    
    Route::get('/clients/{id}', [ClientController::class, 'show'])
        ->middleware('permission:list_clients');
    
    Route::post('/clients', [ClientController::class, 'store'])
        ->middleware('permission:register_client');
    
    Route::put('/clients/{id}', [ClientController::class, 'update'])
        ->middleware('permission:edit_client');
    
    Route::delete('/clients/{id}', [ClientController::class, 'destroy'])
        ->middleware('permission:delete_client');


});

// ---------- SOLO SUPER-ADMIN ----------
Route::middleware(['auth:api', 'role:Super-Admin'])->group(function () {

    Route::resource('roles', RolePermissionController::class);

    Route::get('/permissions', function() {
        return response()->json([
            'permissions' => \Spatie\Permission\Models\Permission::all()
        ]);
    });

    Route::resource('users', UserAccessController::class)->except(['config']);
    Route::post('/users/{id}', [UserAccessController::class, 'update']);
    Route::put('/users/{id}', [UserAccessController::class, 'update']);
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

    // Productos - Solo lo que realmente requiere Super-Admin
    // NOTA: products/index, products/config y products/{id} ya están definidos fuera

    //Route::post('/products/import', [ProductController::class, 'import_product']);
    //Route::post('/products/import', [ProductController::class, 'import_product']);
        //->middleware('permission:register_product');

    // Si necesitas store, update, delete solo para Super-Admin, descomenta:
    // Route::post('/products', [ProductController::class, 'store']);
    // Route::put('/products/{id}', [ProductController::class, 'update']);
    // Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::resource('product_wallets', ProductWalletController::class);
    Route::resource('product_warehouses', ProductWarehouseController::class);

    Route::get('/clients/config', [ClientController::class, 'config']);
    Route::resource('clients', ClientController::class);

});

// Exportación de excel (accesible para todos los autenticados con permiso)
Route::middleware('auth:api')->group(function() {
    Route::get("excel/export-products", [ProductController::class,"export_products"])
        ->middleware('permission:list_product');
});
