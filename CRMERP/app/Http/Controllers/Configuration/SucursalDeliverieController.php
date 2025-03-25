<?php

namespace App\Http\Controllers\Configuration;

use App\Models\Configuration\Sucursal_deliverie;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SucursalDeliverieController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $sucursal_deliverie = Sucursal_deliverie::where('name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $sucursal_deliverie->total(),
            'sucursal_deliveries' => $sucursal_deliverie->map(function ($sucursal) {
                return [
                    'id' => $sucursal->id,
                    'name' => $sucursal->name,
                    'state' => $sucursal->state,
                    'address' => $sucursal->address,
                    'created_at' => $sucursal->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_sucursal = Sucursal_deliverie::where('name', $request->name)->first();
        if ($if_exists_sucursal) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un lugar de entrega con ese nombre.',
            ]);
        }
        $sucursal_deliverie = Sucursal_deliverie::create($request->all());
        return response()->json([
            'message' => 200,
            'sucursal' => [
                'id' => $sucursal_deliverie->id,
                'name' => $sucursal_deliverie->name,
                'state' => $sucursal_deliverie->state ?? 1,
                'address' => $sucursal_deliverie->address,
                'created_at' => $sucursal_deliverie->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El lugar de entrega se ha creado correctamente.'
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
        $if_exists_sucursal = Sucursal_deliverie::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_sucursal) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un lugar de entrega con ese nombre.',
            ]);
        };
        //DB::enableQueryLog();
        $sucursal_deliverie = Sucursal_deliverie::findOrFail($id);
        $sucursal_deliverie->update($request->all());

        return response()->json([
            'message' => 200,
            'sucursal' => [
                'id' => $sucursal_deliverie->id,
                'name' => $sucursal_deliverie->name,
                'state' => $sucursal_deliverie->state,
                'address' => $sucursal_deliverie->address,
                'created_at' => $sucursal_deliverie->created_at->format('Y-m-d H:i:s'),
            ],
            'message_text' => 'El lugar de entrega se ha actualizado correctamente.',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $sucursal_deliverie = Sucursal_deliverie::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $sucursal_deliverie->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Lugar de entrega eliminado correctamente.',
        ]);
    }
}
