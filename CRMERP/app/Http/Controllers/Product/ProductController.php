<?php

namespace App\Http\Controllers\Product;

use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursale;
use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $products = Product::where('title', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $products->total(),
            'products' => $products
        ]);
    }

    public function config()
    {
        $almacenes = Warehouse::where('state', 1)->get();
        $sucursales = Sucursale::where('state', 1)->get();
        $units = Unit::where('state', 1)->get();
        $segments_clients = client_segment::where('state', 1)->get();

        return response()->json([
            'almacenes' => $almacenes,
            'sucursales' => $sucursales,
            'units' => $units,
            'segments_clients' => $segments_clients,
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
            $file = $request->file('imagen');
            $path = Storage::putFile("products", $request->file('product_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $product = Product::create($request->all());
        return response()->json([
            'message' => 200,
            /* 'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'state' => $product->state ?? 1,
                'imagen' => $product->imagen ? env('APP_URL') . 'storage/' . $product->imagen : null,
                'created_at' => $product->created_at->format('d-m-Y H:i:s'),
            ], */
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
            "product" => $product,
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
