<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Warehouse;

class WarehouseController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $warehouses = Warehouse::where('name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);
        $sucursales = Sucursale::where('state', 1)->orderBy('id', 'desc')->get();

        return response()->json([
            'total' => $warehouses->total(),
            'warehouses' => $warehouses->map(function ($warehouse) {
                return [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'state' => $warehouse->state,
                    'address' => $warehouse->address,
                    'sucursale_id' => $warehouse->sucursale_id,
                    'sucursale' => $warehouse->sucursale,
                    'created_at' => $warehouse->created_at->format('d-m-Y H:i:s'),
                ];
            }),
            "sucursales" => $sucursales->map(function ($sucursal) {
                return [
                    'id' => $sucursal->id,
                    'name' => $sucursal->name,
                ];
            }),
        ]);
    }

    public function config()
    {
        $sucursales = Sucursale::where('state', 1)->orderBy('id', 'desc')->get();
        return response()->json([
            "sucursales" => $sucursales->map(function ($sucursal){
                return [
                    'id' => $sucursal->id,
                    'name' => $sucursal->name,
                ];
            }),
            //'warehouses' => Warehouse::where('state', 1)->get(),
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_warehouse = Warehouse::where('name', $request->name)->first();
        if ($if_exists_warehouse) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un almacén con ese nombre.',
            ]);
        }
        $warehouse = Warehouse::create($request->all());
        return response()->json([
            'message' => 200,
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'state' => $warehouse->state ?? 1,
                'address' => $warehouse->address,
                'sucursale_id' => $warehouse->sucursale_id,
                'sucursale' => $warehouse->sucursale,
                'created_at' => $warehouse->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El almacén se ha creado correctamente'
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
     * Actuialización de los registros de la tabla
     */
    public function update(Request $request, string $id)
    {
        $if_exists_warehouse = Warehouse::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_warehouse) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una sucursal con ese nombre',
            ]);
        };
        //DB::enableQueryLog();
        $warehouse = Warehouse::findOrFail($id);
        $warehouse->update($request->all());

        return response()->json([
            'message' => 200,
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'state' => $warehouse->state ?? 1,
                'address' => $warehouse->address,
                'sucursale_id' => $warehouse->sucursale_id,
                'sucursale' => $warehouse->sucursale,
                'created_at' => $warehouse->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La sucursal se ha actualizado correctamente',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        //VALIDACIÓN POR COMPRA y STOCK DE PRODUCTOS
        $warehouse->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Sucursal eliminada correctamente',
        ]);
    }
}
