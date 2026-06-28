<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClientController extends Controller
{
    /**
     * Obtener configuración para el formulario de clientes
     */
    public function config()
    {
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener configuración',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar clientes con paginación
     */
    public function index(Request $request)
    {
        try {
            $search = $request->get('search', '');

            $clients = Client::where('full_name', 'like', "%" . $search . "%")
                ->orderBy('id', 'desc')
                ->paginate(25);

            $clientsData = ClientResource::collection($clients);
            return response()->json([
                'total' => $clients->total(),
                'clients' => ClientCollection::make($clientsData),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al listar clientes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo cliente
     */
    public function store(Request $request)
    {
        try {
            // Validación de datos
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'name' => 'nullable|string|max:255',
                'surname' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'type_document' => 'nullable|string|max:50',
                'n_document' => 'nullable|string|max:50',
                'client_segment_id' => 'nullable|exists:client_segments,id',
                'asesor_id' => 'nullable|exists:users,id',
                'sucursale_id' => 'nullable|exists:sucursales,id',
            ]);

            // Verificar si ya existe
            $if_exists_client = Client::where('full_name', $request->full_name)->first();
            if ($if_exists_client) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe un cliente con ese nombre.',
                ], 403);
            }

            // Crear cliente
            $client = Client::create($request->all());
            
            return response()->json([
                'message' => 200,
                'client' => ClientResource::make($client),
                'message_text' => 'El cliente se ha creado correctamente.'
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 422,
                'message_text' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al crear el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un cliente específico
     */
    public function show(string $id)
    {
        try {
            $client = Client::findOrFail($id);
            return response()->json([
                'client' => ClientResource::make($client)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cliente no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Actualizar un cliente
     */
    public function update(Request $request, string $id)
    {
        try {
            // Validación de datos
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'name' => 'nullable|string|max:255',
                'surname' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'type_document' => 'nullable|string|max:50',
                'n_document' => 'nullable|string|max:50',
                'client_segment_id' => 'nullable|exists:client_segments,id',
                'asesor_id' => 'nullable|exists:users,id',
                'sucursale_id' => 'nullable|exists:sucursales,id',
            ]);

            // Verificar duplicado
            $if_exists_client = Client::where('full_name', $request->full_name)
                ->where('id', '<>', $id)
                ->first();
                
            if ($if_exists_client) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe un cliente con ese nombre.',
                ], 403);
            }

            // Actualizar cliente
            $client = Client::findOrFail($id);
            $client->update($request->all());

            return response()->json([
                'message' => 200,
                'client' => ClientResource::make($client),
                'message_text' => 'Los datos del cliente se han actualizado correctamente',
            ], 200);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 422,
                'message_text' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al actualizar el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un cliente
     */
    public function destroy(string $id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();
            
            return response()->json([
                'message' => 200,
                'message_text' => 'Cliente eliminado correctamente.',
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al eliminar el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}