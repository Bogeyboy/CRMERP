<?php

namespace App\Http\Controllers\Configuration;

use App\Models\Configuration\client_segment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ClientSegmentController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $client_segments = client_segment::where('name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $client_segments->total(),
            'client_segments' => $client_segments->map(function ($client_segment) {
                return [
                    'id' => $client_segment->id,
                    'name' => $client_segment->name,
                    'state' => $client_segment->state,
                    'created_at' => $client_segment->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_client_segment = client_segment::where('name', $request->name)->first();
        if ($if_exists_client_segment) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un segmento de cliente con ese nombre.',
            ]);
        }
        $client_segment = client_segment::create($request->all());
        return response()->json([
            'message' => 200,
            'client_segment' => [
                'id' => $client_segment->id,
                'name' => $client_segment->name,
                'state' => $client_segment->state ?? 1,
                'created_at' => $client_segment->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El segmento de cliente se ha creado correctamente.'
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
        $if_exists_client_segment = client_segment::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_client_segment) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un segmento de cliente con ese nombre.',
            ]);
        };
        //DB::enableQueryLog();
        $client_segment = client_segment::findOrFail($id);
        $client_segment->update($request->all());

        return response()->json([
            'message' => 200,
            'client_segment' => [
                'id' => $client_segment->id,
                'name' => $client_segment->name,
                'state' => $client_segment->state ?? 1,
                'created_at' => $client_segment->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La sucursal se ha actualizado correctamente.',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $client_segment = client_segment::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $client_segment->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Segmento de cliente eliminado correctamente.',
        ]);
    }
}
