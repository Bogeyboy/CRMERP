<?php

namespace App\Http\Controllers\Product;

use App\Exports\Product\DownloadProduct;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Product\ProductResource;
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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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
                // Si la imagen no tiene URL completa, agregar la URL base
                if (!str_starts_with($product->imagen, 'http')) {
                    $product->imagen = asset('storage/' . $product->imagen);
                }
            } else {
                // Imagen por defecto si no tiene
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

    /**
     * Almacenamos los registros de la tabla
     */
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

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::with([
            'product_categorie',
            'umbral_unit',
            'provider',
            'wallets.unit',
            'wallets.sucursale',
            'wallets.client_segment',
            'productWarehouses.unit',
            'productWarehouses.warehouse.sucursale',
        ])->findOrFail($id);

        // Transformar la imagen para que tenga URL completa
        if ($product->imagen) {
            $product->imagen = asset('storage/' . $product->imagen);
        }

        return new ProductResource($product);
    }

    /**
     * Actualización de los registros de la tabla
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();
        try
        {
            $if_exists_product = Product::where('title', $request->title)
                ->where('id', '<>', $id)
                ->first();
            if ($if_exists_product) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe un producto con ese nombre.',
                ]);
            };

            $product = Product::findOrFail($id);

            if ($request->hasFile('product_imagen')) {
                if ($product->imagen) {
                    Storage::disk('public')->delete($product->imagen);
                }
                $path = $request->file('product_imagen')->store('products', 'public');
                $request->merge(['imagen' => $path]);
            }

            $product->update($request->except(['warehouses', 'wallets']));

            // ELIMINAR Y RECREAR WAREHOUSES (o actualizar si prefieres)
            if ($request->has('warehouses'))
            {
                // Eliminar existentes
                ProductWarehouse::where('product_id', $product->id)->delete();

                // Crear nuevos
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

            if ($request->has('wallets'))
            {
                $walletsData = json_decode($request->wallets, true);

                foreach ($walletsData as $wallet) {
                    // Asegúrate de que la clave 'price' exista
                    if (!isset($wallet['price'])) {
                        // Si no existe 'price', intenta con 'price_general' o 'quantity'
                        $wallet['price'] = $wallet['price_general'] ?? $wallet['quantity'] ?? 0;
                    }

                    // Tu lógica para actualizar/crear el wallet
                    ProductWallet::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'unit_id' => $wallet['unit_id'],
                            'sucursal_id' => $wallet['sucursal_id'] ?? null,
                            'client_segment_id' => $wallet['client_segment_id'] ?? null,
                        ],
                        [
                            'price' => $wallet['price'],
                        ]
                    );
                }
            }

            DB::commit();

            return response()->json([
                'message' => 200,
                'message_text' => 'El producto se ha actualizado correctamente.',
            ]);

        }
        catch (\Exception $e)
        {
            DB::rollback();

            return response()->json([
                'message' => 500,
                'message_text' => 'Error al actualizar el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminación de los registros de la tabla
     */
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
