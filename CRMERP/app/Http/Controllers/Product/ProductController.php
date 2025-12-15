<?php

namespace App\Http\Controllers\Product;

use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Models\Configuration\Unit;
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
        /* logger()->info('Request recibido: ', $request->all());
        $provider_id = $request->input('provider_id');

        logger()->info('provider_id recibido:', [
            'valor' => $provider_id,
            'tipo'  => gettype($provider_id)
        ]); */
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

        $products = Product::filterAdvance($search,
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

        /* return response()->json([
            'provider_id' => $provider_id,
            'tipo'        => gettype($provider_id),
        ]); */
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
        $if_exists_product = Product::where('title', $request->title)->first();
        if ($if_exists_product) {
            return response()->json([
                'message' => 403,
                'message_text' => 'El nombre del producto ya existe.',
            ]);
        }

        if ($request->hasFile('product_imagen')) {
            $path = $request->file('product_imagen')
                ->store('products', 'public'); // ✅ DISCO PUBLIC

            $request->merge(['imagen' => $path]);
        }
        $product = Product::create($request->all());
        // (resto de tu código igual)
        return response()->json([
            'message' => 200,
            'message_text' => 'El producto se ha creado correctamente.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            "product" => ProductResource::make($product),
        ]);
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
    }

    /**
     * Actuialización de los registros de la tabla
     */
    public function update(Request $request, string $id)
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
            /* 'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'state' => $product->state,
                'imagen' => $product->imagen ? env('APP_URL') . 'storage/' . $product->imagen : null,
                'created_at' => $product->created_at->format('d-m-Y H:i:s'),
            ], */
            'message_text' => 'La categoría se ha actualizado correctamente.',
        ]);
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
