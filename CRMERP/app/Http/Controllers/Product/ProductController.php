<?php

namespace App\Http\Controllers\Product;

use App\Exports\Product\DownloadProduct;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Product\ProductResource;
use App\Imports\ProductsImport;
use App\Models\Configuration\client_segment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Log de todos los parámetros recibidos (opcional, puedes eliminarlo si no lo necesitas)
        Log::info('📥 PARÁMETROS RECIBIDOS:', $request->all());

        // Construir la consulta con todas las relaciones
        $query = Product::with([
            'product_categorie',
            'umbral_unit',
            'provider',
            'wallets.unit',
            'wallets.sucursale',
            'wallets.client_segment',
            'productWarehouses.unit',
            'productWarehouses.warehouse.sucursale',
        ])->orderBy('id','desc');

        // Aplicar filtros si existen
        if ($request->has('provider_id') && !empty($request->provider_id)) {
            $query->where('provider_id', $request->provider_id);
            Log::info('Filtrando por proveedor: ' . $request->provider_id);
        }

        // Solo filtrar por estado si no es 0
        if ($request->has('state') && $request->state !== '' && $request->state != 0) {
            $query->where('state', $request->state);
            Log::info('Filtrando por estado: ' . $request->state);
        }

        if ($request->has('product_categorie_id') && !empty($request->product_categorie_id)) {
            $query->where('product_categorie_id', $request->product_categorie_id);
            Log::info('Filtrando por categoría: ' . $request->product_categorie_id);
        }

        if ($request->has('disponibilidad') && !empty($request->disponibilidad)) {
            $query->where('disponibilidad', $request->disponibilidad);
            Log::info('Filtrando por disponibilidad: ' . $request->disponibilidad);
        }

        if ($request->has('tax_selected') && !empty($request->tax_selected)) {
            $query->where('tax_selected', $request->tax_selected);
            Log::info('Filtrando por impuesto: ' . $request->tax_selected);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where('title', 'like', '%' . $request->search . '%');
            Log::info('Buscando: ' . $request->search);
        }

        // Filtro por sucursal
        if ($request->has('sucursale_price_multiple') && !empty($request->sucursale_price_multiple)) {
            $query->whereHas('wallets', function($q) use ($request) {
                $q->where('sucursal_id', $request->sucursale_price_multiple);
            });
            Log::info('Filtrando por sucursal: ' . $request->sucursale_price_multiple);
        }
        // Filtro por almacén
        if ($request->has('almacen_warehouse') && !empty($request->almacen_warehouse)) {
            $query->whereHas('productWarehouses', function($q) use ($request) {
                $q->where('warehouse_id', $request->almacen_warehouse);
            });
            Log::info('Filtrando por almacén: ' . $request->almacen_warehouse);
        }
        // Filtro por segmento de cliente
        if ($request->has('client_segment_price_multiple') && !empty($request->client_segment_price_multiple)) {
            $query->whereHas('wallets', function($q) use ($request) {
                $q->where('client_segment_id', $request->client_segment_price_multiple);
            });
            Log::info('Filtrando por segmento: ' . $request->client_segment_price_multiple);
        }

        // Filtro por unidad de almacén
        if ($request->has('unit_warehouse') && !empty($request->unit_warehouse)) {
            $query->whereHas('productWarehouses', function($q) use ($request) {
                $q->where('unit_id', $request->unit_warehouse);
            });
            Log::info('Filtrando por unidad: ' . $request->unit_warehouse);
        }

        // Log de la consulta SQL (opcional)
        Log::info('SQL: ' . $query->toSql());
        Log::info('Bindings: ' . json_encode($query->getBindings()));

        // Paginar resultados (25 por página)
        $products = $query->paginate(25);

        Log::info('📊 TOTAL PRODUCTOS ENCONTRADOS: ' . $products->total());

        // Transformar los productos para incluir la URL completa de la imagen
        $products->getCollection()->transform(function ($product) {
        if ($product->imagen) {
            // Si la imagen ya es una URL completa (http:// o https://), no la modifiques
            if (str_starts_with($product->imagen, 'http://') || str_starts_with($product->imagen, 'https://')) {
                // Ya es una URL completa, no hacer nada
                $product->imagen = $product->imagen;
            }
            // Si empieza con 'products/' (ruta local)
            elseif (str_starts_with($product->imagen, 'products/')) {
                $product->imagen = asset('storage/' . $product->imagen);
            }
            // Cualquier otra ruta local
            else {
                $product->imagen = asset('storage/' . $product->imagen);
            }
        } else {
            $product->imagen = asset('assets/media/products/default-product.png');
        }
            return $product;
        });

        // Devolver respuesta en el formato que espera el frontend
        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage()
            ],
            'links' => [
                'next' => $products->nextPageUrl(),
                'prev' => $products->previousPageUrl()
            ]
        ]);
    }
    public function config()
    {
        $almacenes = Warehouse::where('state', 1)->get();
        $sucursales = Sucursale::where('state', 1)->get();
        $units = Unit::where('state', 1)->get();
        $segments_clients = client_segment::where('state', 1)->get();
        $categories = ProductCategorie::where('state', 1)->get();
        $providers = Provider::where('state', 1)->get();

        return response()->json([
            'almacenes' => $almacenes,
            'sucursales' => $sucursales,
            'units' => $units,
            'segments_clients' => $segments_clients,
            'categories' => $categories,
            'providers' => $providers,
        ]);
    }
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $if_exists_product = Product::where('title', $request->title)->first();
            if ($if_exists_product) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'El nombre del producto ya existe.',
                ]);
            }

            // Guardar imagen
            if ($request->hasFile('product_imagen')) {
                $path = $request->file('product_imagen')->store('products', 'public');
                $request->merge(['imagen' => $path]);
            }

            // Crear el producto
            $product = Product::create($request->all());

            // ====== GUARDAR WAREHOUSES ======
            if ($request->has('warehouses')) {
                $warehouses = json_decode($request->warehouses, true);

                if (is_array($warehouses) && count($warehouses) > 0) {
                    foreach ($warehouses as $warehouse) {
                        ProductWarehouse::create([
                            'product_id' => $product->id,
                            'unit_id' => $warehouse['unit_id'],
                            'warehouse_id' => $warehouse['warehouse_id'],
                            'stock' => $warehouse['quantity']
                        ]);
                    }
                }
            }

            // ====== GUARDAR WALLETS ======
            if ($request->has('wallets')) {
                $wallets = json_decode($request->wallets, true);

                if (is_array($wallets) && count($wallets) > 0) {
                    foreach ($wallets as $wallet) {
                        ProductWallet::create([
                            'product_id' => $product->id,
                            'unit_id' => $wallet['unit_id'],
                            'sucursal_id' => $wallet['sucursale_id'],
                            'client_segment_id' => $wallet['client_segment_id'],
                            'price' => $wallet['price']
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 200,
                'message_text' => 'El producto se ha creado correctamente.',
                'product_id' => $product->id
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'message' => 500,
                'message_text' => 'Error al crear el producto: ' . $e->getMessage()
            ], 500);
        }
    }
    public function show($id)
    {
        try {
            $product = Product::with([
                'product_categorie',
                'provider',
                'umbral_unit',
                'productWarehouses.unit',  // ← Cambiado: usar productWarehouses en lugar de warehouses
                'productWarehouses.warehouse.sucursale',  // ← Cambiado
                'wallets.unit',
                'wallets.sucursale',
                'wallets.client_segment'
            ])->findOrFail($id);
            
            // Transformar productWarehouses para el frontend - CORREGIDO
            $product->warehouses = $product->productWarehouses->map(function($productWarehouse) {
                return [
                    'id' => $productWarehouse->warehouse->id,  // ID del almacén
                    'pivot' => [  // ← IMPORTANTE: Incluir el pivot con el ID del product_warehouse
                        'id' => $productWarehouse->id,  // ← ¡ESTE ES EL ID QUE NECESITA EL FRONTEND!
                        'product_id' => $productWarehouse->product_id,
                        'warehouse_id' => $productWarehouse->warehouse_id,
                        'unit_id' => $productWarehouse->unit_id,
                        'stock' => $productWarehouse->stock,
                        'created_at' => $productWarehouse->created_at,
                        'updated_at' => $productWarehouse->updated_at,
                    ],
                    'unit' => $productWarehouse->unit ? [
                        'id' => $productWarehouse->unit->id,
                        'name' => $productWarehouse->unit->name,
                        'description' => $productWarehouse->unit->description,
                        'state' => $productWarehouse->unit->state,
                        'pivot' => [
                            'warehouse_id' => $productWarehouse->warehouse_id,
                            'unit_id' => $productWarehouse->unit_id,
                            'product_id' => $productWarehouse->product_id,
                            'stock' => $productWarehouse->stock,
                            'created_at' => $productWarehouse->created_at,
                            'updated_at' => $productWarehouse->updated_at,
                        ]
                    ] : null,
                    'warehouse' => $productWarehouse->warehouse ? [
                        'id' => $productWarehouse->warehouse->id,
                        'name' => $productWarehouse->warehouse->name,
                        'state' => $productWarehouse->warehouse->state,
                        'address' => $productWarehouse->warehouse->address,
                        'sucursale_id' => $productWarehouse->warehouse->sucursale_id,
                        'sucursale' => $productWarehouse->warehouse->sucursale ? [
                            'id' => $productWarehouse->warehouse->sucursale->id,
                            'name' => $productWarehouse->warehouse->sucursale->name,
                        ] : null,
                    ] : null,
                    'quantity' => $productWarehouse->stock ?? 0,
                    'unit_id' => $productWarehouse->unit_id,
                    'warehouse_id' => $productWarehouse->warehouse_id,
                    'product_id' => $productWarehouse->product_id,
                    'created_at' => $productWarehouse->created_at,
                    'updated_at' => $productWarehouse->updated_at,
                ];
            });
            
            // Las specifications ya están como array gracias al cast
            if (is_string($product->specifications)) {
                $product->specifications = json_decode($product->specifications, true);
            }
            
            return response()->json(['data' => $product]);
            
        } catch (\Exception $e) {
            Log::error('Error en show: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Error al cargar el producto: ' . $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Decodificar JSON
            $warehouses = $request->warehouses;
            if (is_string($warehouses)) {
                $warehouses = json_decode($warehouses, true);
            }
            
            $wallets = $request->wallets;
            if (is_string($wallets)) {
                $wallets = json_decode($wallets, true);
            }
            
            // ========== MANEJO DE IMAGEN ==========
            // Verificar si se debe eliminar la imagen
            $imageRemoved = $request->input('image_removed', false);
            
            if ($imageRemoved === true || $imageRemoved === 'true') {
                // Eliminar la imagen actual si existe
                if ($product->imagen && !filter_var($product->imagen, FILTER_VALIDATE_URL)) {
                    $oldPath = str_replace('storage/', '', $product->imagen);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $product->imagen = null;
            }
            
            // Verificar si se subió una nueva imagen
            if ($request->hasFile('product_imagen')) {
                // Eliminar la imagen anterior si existe y no es URL externa
                if ($product->imagen && !filter_var($product->imagen, FILTER_VALIDATE_URL)) {
                    $oldPath = str_replace('storage/', '', $product->imagen);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                // Guardar la nueva imagen
                $path = $request->file('product_imagen')->store('products', 'public');
                $product->imagen = Storage::url($path);
            }
            
            // Verificar si se envió una URL externa
            if ($request->has('imagen_url') && !$request->hasFile('product_imagen')) {
                $product->imagen = $request->imagen_url;
            }
            
            // Si no hay imagen y no se ha eliminado ni subido nueva, mantener la existente
            // (no hacer nada)
            // ========== FIN MANEJO DE IMAGEN ==========
            
            // Actualizar campos básicos
            $product->title = $request->title;
            $product->sku = $request->sku;
            $product->description = $request->description;
            $product->product_categorie_id = $request->product_categorie_id;
            $product->price_general = $request->price_general;
            $product->provider_id = $request->provider_id;
            $product->disponibilidad = $request->disponibilidad;
            $product->tiempo_de_abastecimiento = $request->tiempo_de_abastecimiento;
            $product->is_discount = $request->is_discount;
            $product->min_discount = $request->min_discount ?? 0;
            $product->max_discount = $request->max_discount ?? 0;
            $product->tax_selected = $request->tax_selected;
            $product->importe_iva = $request->importe_iva;
            $product->is_gift = $request->is_gift;
            $product->weight = $request->weight;
            $product->width = $request->width;
            $product->height = $request->height;
            $product->length = $request->length;
            $product->umbral = $request->umbral;
            $product->umbral_unit_id = $request->umbral_unit_id;
            $product->state = $request->state ?? 1;
            
            // Guardar specifications como JSON
            $specifications = $request->specifications;
            if (is_string($specifications)) {
                $specifications = json_decode($specifications, true);
            }
            $product->specifications = $specifications;
            
            $product->save();
            
            // Procesar warehouses
            if ($warehouses && is_array($warehouses)) {
                $warehouseIds = [];
                foreach ($warehouses as $warehouse) {
                    $existingWarehouse = ProductWarehouse::where('product_id', $product->id)
                        ->where('warehouse_id', $warehouse['warehouse_id'])
                        ->where('unit_id', $warehouse['unit_id'])
                        ->first();
                    
                    if ($existingWarehouse) {
                        $existingWarehouse->update([
                            'stock' => $warehouse['quantity']
                        ]);
                        $warehouseIds[] = $existingWarehouse->id;
                    } else {
                        $newWarehouse = ProductWarehouse::create([
                            'product_id' => $product->id,
                            'unit_id' => $warehouse['unit_id'],
                            'warehouse_id' => $warehouse['warehouse_id'],
                            'stock' => $warehouse['quantity']
                        ]);
                        $warehouseIds[] = $newWarehouse->id;
                    }
                }
                
                ProductWarehouse::where('product_id', $product->id)
                    ->whereNotIn('id', $warehouseIds)
                    ->delete();
            }
            
            // Procesar wallets
            if ($wallets && is_array($wallets)) {
                $product->wallets()->delete();
                foreach ($wallets as $wallet) {
                    $product->wallets()->create([
                        'unit_id' => $wallet['unit_id'],
                        'client_segment_id' => $wallet['client_segment_id'] ?? null,
                        'price' => $wallet['price'],
                        'sucursal_id' => $wallet['sucursale_id'] ?? null,
                    ]);
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente',
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al actualizar producto: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $product->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Producto eliminado correctamente.',
        ]);
    }
    /* public function import_product(Request $request)
    {
        try {
            // Validación del archivo
            if (!$request->hasFile('import_file')) {
                return response()->json([
                    'message' => 400,
                    'message_text' => 'No se ha seleccionado ningún archivo'
                ], 400);
            }

            $file = $request->file('import_file');
            
            // Validar el archivo manualmente
            $validator = Validator::make($request->all(), [
                'import_file' => 'required|file|mimes:xlsx,xls,csv,ods|max:5120'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 422,
                    'message_text' => 'Error en la validación del archivo',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Log para depuración
            Log::info('Iniciando importación de productos', [
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_mime' => $file->getMimeType()
            ]);

            // Verificar que el archivo no esté vacío
            if ($file->getSize() === 0) {
                return response()->json([
                    'message' => 400,
                    'message_text' => 'El archivo está vacío'
                ], 400);
            }

            $import = new ProductsImport();
            Excel::import($import, $file);

            $importedCount = $import->getImportedCount();
            $errors = $import->getImportErrors();

            Log::info('Importación finalizada', [
                'imported_count' => $importedCount,
                'errors_count' => count($errors)
            ]);

            if ($importedCount > 0) {
                $message = "Se importaron {$importedCount} productos correctamente.";
                if (count($errors) > 0) {
                    $errorList = array_slice($errors, 0, 5);
                    $message .= " Advertencias: " . implode(', ', $errorList);
                    if (count($errors) > 5) {
                        $message .= " ... y " . (count($errors) - 5) . " más";
                    }
                }

                return response()->json([
                    'message' => 200,
                    'message_text' => $message,
                    'imported' => $importedCount,
                    'errors' => $errors
                ]);
            } else {
                return response()->json([
                    'message' => 400,
                    'message_text' => 'No se pudo importar ningún producto. ' . (count($errors) > 0 ? implode(', ', array_slice($errors, 0, 3)) : 'Verifica el formato del archivo'),
                    'errors' => $errors
                ], 400);
            }

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];
            foreach ($failures as $failure) {
                $errors[] = "Fila {$failure->row()}: " . implode(', ', $failure->errors());
            }

            Log::error('Errores de validación en importación', ['errors' => $errors]);

            return response()->json([
                'message' => 422,
                'message_text' => 'Error de validación en el archivo.',
                'errors' => $errors
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Error crítico en import_product: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 500,
                'message_text' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    } */
    public function import_product(Request $request)
    {
        // Log de inicio
        Log::info('User authenticated: ' . ($request->user() ? $request->user()->id : 'No user'));
        Log::info('=== INICIO IMPORTACIÓN ===');
        Log::info('=== import_product METHOD CALLED ===');
        Log::info('Request method: ' . $request->method());
        Log::info('Request path: ' . $request->path());
        Log::info('All request data:', $request->all());
        Log::info('Request all:', $request->all());
        Log::info('Has file: ' . $request->hasFile('import_file'));
        
        try {
            if (!$request->hasFile('import_file')) {
                Log::error('No file in request');
                return response()->json([
                    'message' => 400,
                    'message_text' => 'No se ha seleccionado ningún archivo'
                ], 400);
            }

            $file = $request->file('import_file');
            Log::info('File info:', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension()
            ]);

            // Validar extensión manualmente
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['xlsx', 'xls', 'csv', 'ods'];
            
            if (!in_array($extension, $allowedExtensions)) {
                Log::error('Invalid extension: ' . $extension);
                return response()->json([
                    'message' => 400,
                    'message_text' => 'Extensión no válida. Permitidas: ' . implode(', ', $allowedExtensions)
                ], 400);
            }

            // Crear el import y procesar
            $import = new ProductsImport();
            
            Log::info('Starting Excel import');
            Excel::import($import, $file);
            Log::info('Excel import completed');

            $importedCount = $import->getImportedCount();
            $errors = $import->getImportErrors();

            Log::info('Import results:', [
                'imported' => $importedCount,
                'errors' => $errors
            ]);

            if ($importedCount > 0) {
                return response()->json([
                    'message' => 200,
                    'message_text' => "Se importaron {$importedCount} productos correctamente.",
                    'imported' => $importedCount,
                    'errors' => $errors
                ]);
            } else {
                return response()->json([
                    'message' => 400,
                    'message_text' => 'No se importaron productos. Errores: ' . implode(', ', $errors),
                    'errors' => $errors
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('EXCEPTION in import_product: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 500,
                'message_text' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
    public function export_products(Request $request)
    {
        $product_categorie_id= $request->get("product_categorie_id");
        $disponibilidad= $request->get("disponibilidad");
        $tax_selected= $request->get("tax_selected");
        $search= $request->get("search");
        //FILTRADO ESPECIAL
        $provider_id= $request->get("provider_id");
        $sucursale_price_multiple= $request->get("sucursale_price_multiple");
        $almacen_warehouse= $request->get("almacen_warehouse");
        $client_segment_price_multiple= $request->get("client_segment_price_multiple");
        $state= $request->get("state");
        $query = $request->get("query");

        //Ordenamos los productos para la exportación
        //$products = Product::orderBy("id", "asc")->get();
        $products = Product::filterAdvance($product_categorie_id, $disponibilidad, $tax_selected, $search, $provider_id,
                                        $sucursale_price_multiple, $almacen_warehouse, $client_segment_price_multiple, $state, $query)
                                        ->orderBy("id", "asc")
                                        ->get();
        return Excel::download(new DownloadProduct($products),"Productos_descargados.xlsx");
    }
}
