<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Models\Client\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $clients = Client::where('full_name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $clients->total(),
            'clients' => ClientCollection::make($clients),
            /* $clients->map(function ($client_segment) {
                return [
                    'id' => $client_segment->id,
                    'name' => $client_segment->name,
                    'state' => $client_segment->state,
                    'created_at' => $client_segment->created_at->format('d-m-Y H:i:s'),
                ];
            }) */
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_client = Client::where('full_name', $request->full_name)->first();
        if ($if_exists_client) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un cliente con ese nombre.',
            ]);
        }
        $client = Client::create($request->all());
        return response()->json([
            'message' => 200,
            'client' => ClientResource::make($client),
            /* [
                'id' => $client_segment->id,
                'name' => $client_segment->name,
                'state' => $client_segment->state ?? 1,
                'created_at' => $client_segment->created_at->format('d-m-Y H:i:s'),
            ] */,
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
        $if_exists_client = Client::where('full_name', $request->full_name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_client) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un cliente con ese nombre.',
            ]);
        };
        //DB::enableQueryLog();
        $client = Client::findOrFail($id);
        $client->update($request->all());

        return response()->json([
            'message' => 200,
            'client' => ClientResource::make($client),
            'message_text' => 'Los datos del cliente se han actualizado correctamente',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $client->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Segmento de cliente eliminado correctamente.',
        ]);
    }
}
