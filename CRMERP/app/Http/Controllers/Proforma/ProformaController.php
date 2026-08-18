<?php

namespace App\Http\Controllers\Proforma;

use App\Http\Controllers\Controller;
use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\Proforma\Proforma;
use App\Models\User;
use Illuminate\Http\Request;
use NunoMaduro\Collision\Adapters\Phpunit\State;

class ProformaController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function config()
    {
        try
        {
            $client_segment = client_segment::where('state', 1)->get();
            $asesores = User::whereHas('roles', function ($q) {
                $q->where('name', 'like', '%Asesor%');
            })->get();

            return response()->json([
                'client_segments' => $client_segment,
                'asesores' => $asesores->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'full_name' => $user->name . ' ' . $user->surname,
                    ];
                })
            ]);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Error al obtener configuración',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function index(Request $request)
    {
        $search = $request->get('search');

        $proformas = Proforma::orderBy('id', 'desc')->paginate(25);

        return response()->json([
            'total' => $proformas->total(),
            'proformas' => $proformas,
        ]);
    }
    
    //FUNCIÓN PARA BUSCAR CLIENTES EN LA TABLA CLIENTS
    public function search_clients(Request $request)
    {
        $n_document = $request->get('n_document');
        $full_name = $request->get('full_name');
        $phone = $request->get('phone');

        $clients = Client::filterProforma($n_document, $full_name, $phone)
            ->where('state', 1)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'clients' => $clients->map(function ($client)
            {
                return [
                    'id' => $client->id,
                    'full_name' => $client->full_name,
                    'client_segment' => $client->client_segment,
                    'phone' => $client->phone,
                    'type' => $client->type,
                    'n_document' => $client->n_document,
                    'is_parcial' => $client->is_parcial,
                ];
            }),
        ]);
    }

    //FUNCIÓN PARA CREAR UN NUEVO REGISTRO EN LA TABLA
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
