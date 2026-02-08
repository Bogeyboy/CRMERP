<?php

namespace App\Http\Controllers\Product;

use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Models\Configuration\Unit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Product\ProductWallet;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Warehouse;
use Illuminate\Support\Facades\Storage;
use App\Models\Product\ProductWarehouse;
use App\Models\Configuration\client_segment;
use App\Models\Configuration\ProductCategorie;
use App\Http\Resources\Product\ProductResource;
use App\Http\Resources\Product\ProductCollection;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $product_categorie_id = $request->product_categorie_id;
        $disponibilidad = $request->disponibilidad;
        $tax_selected = $request->tax_selected;
        $sucursale_price_multiple = $request->sucursale_price_multiple;
        $almacen_warehouse = $request->almacen_warehouse;
        $client_segment_price_multiple = $request->client_segment_price_multiple;
        $unit_warehouse = $request->unit_warehouse;
        $provider = $request->input('provider_id');
        $state = $request->state;

        /* $products = Product::filterAdvance($search,
            product_categorie_id: $product_categorie_id,
            disponibilidad: $disponibilidad,
            tax_selected: $tax_selected,
            provider_id: $provider,
            sucursale_price_multiple: $sucursale_price_multiple,
            almacen_warehouse: $almacen_warehouse,
            client_segment_price_multiple: $client_segment_price_multiple,
            state: $state,
            unit_warehouse: $unit_warehouse)
            ->orderBy('id', 'desc')
            ->paginate(25); */


        $products = Product::with(['warehouses', 'wallets'])
            ->filterAdvance($search,
                product_categorie_id: $product_categorie_id,
                disponibilidad: $disponibilidad,
                tax_selected: $tax_selected,
                provider_id: $provider,
                sucursale_price_multiple: $sucursale_price_multiple,
                almacen_warehouse: $almacen_warehouse,
                client_segment_price_multiple: $client_segment_price_multiple,
                state: $state,
                unit_warehouse: $unit_warehouse)
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $products->total(),
            'products' => ProductCollection::make($products),
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
    public function show(string $id)
    {
        /* $product = Product::findOrFail($id);
        return response()->json([
            "product" => ProductResource::make($product),
        ]); */
        /* return response()->json([
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'sku' => $product->sku,
                'imagen' => $product->imagen ? env('APP_URL') . 'storage/' . $product->imagen : null,
                'price_general' => $product->price_general,
                'description' => $product->description,
                'specifications' => $product->specifications,
                'min_discount' => $product->min_discount,
                'max_discount' => $product->max_discount,
                'is_gift' => $product->is_gift,
                'umbral' => $product->umbral,
                'umbral_unit_id' => $product->umbral_unit_id,
                'disponibilidad' => $product->disponibilidad,
                'tiempo_de_abastecimiento' => $product->tiempo_de_abastecimiento,
            ]
        ]); */

        $product = Product::with([
            'warehouses.unit',
            'warehouses.warehouse',
            'wallets.unit',
            'wallets.sucursale',
            'wallets.client_Segment'
        ])->findOrFail($id);

        return response()->json([
            "product" => ProductResource::make($product),
            // O si no usas Resource, devuelve directamente:
            /* 'product' => $product,
            'warehouses' => $product->warehouses,
            'wallets' => $product->wallets, */
        ]);
    }

    /**
     * Actuialización de los registros de la tabla
     */
    /* public function update(Request $request, string $id)
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
                Storage::delete($product->imagen);
            }
            $file = $request->file('imagen');
            $path = Storage::putFile("products", $request->file('product_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $product->update($request->all());

        return response()->json([
            'message' => 200,
            'message_text' => 'La categoría se ha actualizado correctamente.',
        ]);
    } */
public function update(Request $request, string $id)
{

    DB::beginTransaction();
        try {
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
            if ($request->has('warehouses')) {
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

            // ELIMINAR Y RECREAR WALLETS
            /* if ($request->has('wallets')) {
                // Eliminar existentes
                ProductWallet::where('product_id', $product->id)->delete();

                // Crear nuevos
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
            } */
            if ($request->has('wallets')) {
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
                            //'sucursale_id' => $wallet['sucursale_id'] ?? null,
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

        } catch (\Exception $e) {
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
}
