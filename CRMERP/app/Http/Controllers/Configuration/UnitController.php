<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Unit_transform;
class UnitController extends Controller
{
    /* Listado de elementos de la tabla */
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
                    'transforms' => $unit->transforms->map(function($transfor){
                        $transfor->unit_to = $transfor->unit_to;
                        return $transfor;
                    }), //traeamos todas las unidades de transformación relacionadas
                    'created_at' => $unit->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /* Almacenamiento de los registros de la tabla */
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
                'transforms' => $unit->transforms->map(function ($transfor) {
                    $transfor->unit_to = $transfor->unit_to;
                    return $transfor;
                }), //traeamos todas las unidades de transformación relacionadas
                'created_at' => $unit->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La unidad se ha creado correctamente'
        ]);
    }
    /* Actualización de registros de la tabla */
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
                'transforms' => $unit->transforms->map(function ($transfor) {
                    $transfor->unit_to = $transfor->unit_to;
                    return $transfor;
                }), //traeamos todas las unidades de transformación relacionadas
                'created_at' => $unit->created_at->format('Y-m-d H:i:s'),
            ],
            'message_text' => 'La unidad se ha actualizado correctamente',
        ]);
    }
    /* Eliminación de registros de la tabla */
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
    /* Añadir unidades de transformación */
    public function add_transform(Request $request)
    {
        $if_exists_unit = Unit_transform::where('unit_id', $request->unit_id)
                    ->where('unit_to_id', $request->unit_to_id)
                    ->first();
        if ($if_exists_unit) {
            return response()->json([
                'message' => 403,
                'message_text' => 'La unidad seleccionada ya existe.',
            ]);
        }
        $unit = Unit_transform::create([
            'unit_id' => $request->unit_id,
            'unit_to_id' => $request->unit_to_id,
        ]);
        return response()->json([
            'message' => 200,
            'unit' => [
                'id' => $unit->id,
                'unit_id' => $unit->unit_id,
                'unit_to_id' => $unit->unit_to_id,
                'unit_to' => $unit->unit_to,
                'created_at' => $unit->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La unidad se ha creado correctamente'
        ]);
    }
    /* Eliminar unidades de transformación */
    public function delete_transform($id)
    {
        $unit = Unit_transform::findOrFail($id);
        $unit->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Unidad eliminada correctamente',
        ]);
    }
}
