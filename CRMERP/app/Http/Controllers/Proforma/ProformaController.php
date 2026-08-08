<?php

namespace App\Http\Controllers\Proforma;

use App\Http\Controllers\Controller;
use App\Models\Proforma\Proforma;
use Illuminate\Http\Request;

class ProformaController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $proformas = Proforma::orderBy('id', 'desc')->paginate(25);

        return response()->json([
            'total' => $proformas->total(),
            'proformas' => $proformas,
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $proforma = Proforma::create($request->all());
        return response()->json([
            'message' => 200,
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
        //DB::enableQueryLog();
        $proforma = Proforma::findOrFail($id);
        $proforma->update($request->all());

        return response()->json([
            'message' => 200,
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $proforma = Proforma::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $proforma->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Proforma eliminada correctamente.',
        ]);
    }
}
