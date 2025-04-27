<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Unit;
class UnitController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $units = Unit::where('name', 'like', "%" . $search . "%")
            //->orWhere('description', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $units->total(),
            'units' => $units->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->name,
                    'state' => $unit->state,
                    'description' => $unit->description,
                    'transforms' => $unit->transforms, //traeamos todas las unidades de transformación relacionadas
                    'created_at' => $unit->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_unit = Unit::where('name', $request->name)->first();
        if ($if_exists_unit) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una unidad con ese nombre.',
            ]);
        }
        $unit = Unit::create($request->all());
        return response()->json([
            'message' => 200,
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'state' => $unit->state ?? 1,
                'description' => $unit->description,
                'transforms' => $unit->transforms, //traeamos todas las unidades de transformación relacionadas
                'created_at' => $unit->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La unidad se ha creado correctamente'
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
        $if_exists_unit = Unit::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_unit) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una unidad con ese nombre',
            ]);
        };
        //DB::enableQueryLog();
        $unit = Unit::findOrFail($id);
        $unit->update($request->all());

        return response()->json([
            'message' => 200,
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'state' => $unit->state,
                'description' => $unit->description,
                'transforms' => $unit->transforms, //traeamos todas las unidades de transformación relacionadas
                'created_at' => $unit->created_at->format('Y-m-d H:i:s'),
            ],
            'message_text' => 'La unidad se ha actualizado correctamente',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $unit = Unit::findOrFail($id);
        //VALIDACIÓN POR PRODDUCTO
        //VALIDACIÓN POR COMPRAS E INVENTARIO
        $unit->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Unidad eliminada correctamente',
        ]);
    }
}
