<?php

namespace App\Http\Controllers\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Product\ProductWarehouse;

class ProductWarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        Log::info('=== DEBUG PRODUCT WAREHOUSE INDEX ===');
        Log::info('Product ID: ' . $request->product_id);

        $productWarehouses = ProductWarehouse::with(['unit', 'warehouse'])
            ->where('product_id', $request->product_id)
            ->get()
            ->map(function($productWarehouse) {
                Log::info('Processing PW ID: ' . $productWarehouse->id);

                $data = [
                    'id' => $productWarehouse->id, // VERIFICAR QUE ESTÉ AQUÍ
                    'unit' => $productWarehouse->unit,
                    'warehouse' => $productWarehouse->warehouse,
                    'quantity' => $productWarehouse->stock,
                ];

                Log::info('Data to return:', $data);

                return $data;
            });

        Log::info('Final response:', $productWarehouse->toArray());

        return response()->json([
            'message' => 200,
            'product_warehouses' => $productWarehouses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_warehouse = ProductWarehouse::create([
            'product_id' => $request->product_id,      // CORREGIDO: => en lugar de ->
            'unit_id' => $request->unit_id,            // CORREGIDO
            'warehouse_id' => $request->warehouse_id,  // CORREGIDO
            'stock' => $request->quantity,             // CORREGIDO
        ]);
        return response()->json([
            'message' => 200,
            "product_warehouse" => [
                'id' => $product_warehouse->id,        // También corregí 'id,' por 'id'
                'unit' => $product_warehouse->unit,
                'warehouse' => $product_warehouse->warehouse,
                'quantity' => $product_warehouse->stock,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $productWarehouse = ProductWarehouse::findOrFail($id);
            
            // Obtener todos los datos del request, incluyendo FormData
            $data = [
                'product_id' => $request->input('product_id'), // Usar input() en lugar de directo
                'warehouse_id' => $request->input('warehouse_id'),
                'unit_id' => $request->input('unit_id'),
                'stock' => $request->input('stock', $request->input('quantity')),
            ];
            
            // Log para depuración
            Log::info('Datos recibidos en update:', [
                'request_all' => $request->all(),
                'request_input' => $request->input(),
                'data_procesada' => $data
            ]);
            
            $productWarehouse->update($data);
            
            // Recargar las relaciones
            $productWarehouse->load(['unit', 'warehouse']);
            
            return response()->json([
                'message' => 200,
                'product_warehouse' => [
                    'id' => $productWarehouse->id,
                    'unit' => $productWarehouse->unit,
                    'warehouse' => $productWarehouse->warehouse,
                    'quantity' => $productWarehouse->stock,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error en update:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_warehouse = ProductWarehouse::findOrFail($id);
        $product_warehouse->delete();

        return response()->json([
            'message' => 200,
        ]);
    }
}
