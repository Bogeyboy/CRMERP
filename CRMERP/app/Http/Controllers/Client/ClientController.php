<?php

namespace App\Http\Controllers\Client;

use App\Exports\Client\ExportClient;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Imports\ClientsImport;
use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
//use Maatwebsite\Excel\Excel;

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
     * Mostrar un cliente específico
     */
    public function show(string $id)
    {
        Log::info($id);
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
     * Listar clientes con paginación
    */
    public function index(Request $request)
    {
        Log::info($request);
        try
        {
            $search = $request->search;
            $client_segment_id = $request->client_segment_id;
            $type = $request->type;
            $asesor_id = $request->asesor_id;

            Log::info($search);
            //where('full_name', 'like', "%" . $search . "%")
            $clients = Client::filterAdvance($search, $client_segment_id, $type, $asesor_id)
                ->orderBy('id', 'desc')->paginate(25);

            $clientsData = ClientResource::collection($clients);
            return response()->json([
                'total' => $clients->total(),
                'clients' => ClientCollection::make($clientsData),
            ]);
        }
        catch (\Exception $e)
        {
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
        try
        {
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
                'origen' => 'nullable|string|max:255',
                'asesor_id' => 'nullable|exists:users,id',
                'sucursale_id' => 'nullable|exists:sucursales,id',
            ]);

            // Verificar si ya existe
            $if_exists_client = Client::where('full_name', $request->full_name)->first();
            if ($if_exists_client)
            {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe un cliente con ese nombre.',
                ], 403);
            }

            $user = Auth::user();

            if (!$user)
            {
                return response()->json([
                    'message' => 401,
                    'message_text' => 'Usuario no autenticado.'
                ], 401);
            }

            if (empty($request->asesor_id))
            {
                //$request->request->add(['asesor_id' => $user->id]);
                $request->merge(['asesor_id' => $user->id]);
            }
            // Crear cliente
            //$request->request->add(['sucursale_id' => $user->sucursale_id]);
            $request->merge(['sucursale_id' => $user->sucursale_id]);
            $client = Client::create($request->all());

            return response()->json([
                'message' => 200,
                'client' => ClientResource::make($client),
                'message_text' => 'El cliente se ha creado correctamente.'
            ], 200);

        }
        catch (ValidationException $e)
        {
            return response()->json([
                'message' => 422,
                'message_text' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al crear el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un cliente
     */
    public function update(Request $request, string $id)
    {
        try
        {
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
                'origen' => 'nullable|string|max:255',
                'asesor_id' => 'nullable|exists:users,id',
                'sucursale_id' => 'nullable|exists:sucursales,id',
            ]);

            // Verificar duplicado
            $if_exists_client = Client::where('full_name', $request->full_name)
                ->where('id', '<>', $id)
                ->first();

            if ($if_exists_client)
            {
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

        }
        catch (ValidationException $e)
        {
            return response()->json([
                'message' => 422,
                'message_text' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al actualizar el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function import_clients(Request $request)
    {
        // Log de inicio
        Log::info('User authenticated: ' . ($request->user() ? $request->user()->id : 'No user'));
        Log::info('=== INICIO IMPORTACIÓN ===');
        Log::info('=== import_clients METHOD CALLED ===');
        Log::info('Request method: ' . $request->method());
        Log::info('Request path: ' . $request->path());
        Log::info('All request data:', $request->all());
        Log::info('Request all:', $request->all());
        Log::info('Has file: ' . $request->hasFile('import_file'));

        try
        {
            if (!$request->hasFile('import_file'))
            {
                Log::error('No file in request');
                return response()->json([
                    'message' => 400,
                    'message_text' => 'No se ha seleccionado ningún archivo'
                ], 400);
            }

            $file = $request->file('import_file');
            Log::info('File info:', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension()
            ]);

            // Validar extensión manualmente
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['xlsx', 'xls', 'csv', 'ods'];

            if (!in_array($extension, $allowedExtensions))
            {
                Log::error('Invalid extension: ' . $extension);
                return response()->json([
                    'message' => 400,
                    'message_text' => 'Extensión no válida. Permitidas: ' . implode(', ', $allowedExtensions)
                ], 400);
            }

            // Crear el import y procesar
            $import = new ClientsImport();

            Log::info('Starting Excel import');
            Excel::import($import, $file);
            Log::info('Excel import completed');

            $importedCount = $import->getImportedCount();
            $errors = $import->getImportErrors();

            Log::info('Import results:', [
                'imported' => $importedCount,
                'errors' => $errors
            ]);

            if ($importedCount > 0)
            {
                return response()->json([
                    'message' => 200,
                    'message_text' => "Se importaron {$importedCount} clientes correctamente.",
                    'imported' => $importedCount,
                    'errors' => $errors
                ]);
            }
            else
            {
                if (empty($errors)) {
                    return response()->json([
                        'message' => 200,
                        'message_text' => "El archivo no contiene datos para importar.",
                        'imported' => 0,
                        'errors' => []
                    ]);
                }
                else
                {
                    return response()->json([
                        'message' => 400,
                        'message_text' => 'No se importaron clientes. Errores: ' . implode(', ', $errors),
                        'errors' => $errors
                    ], 400);
                }
            }

        }
        catch (\Exception $e)
        {
            Log::error('EXCEPTION in import_clients: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 500,
                'message_text' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function export_clients(Request $request)
    {
        $search = $request->get('search');
        $client_segment_id = $request->get('client_segment_id');
        $type = $request->get('type');
        $asesor_id = $request->get('asesor_id');

        $clients = Client::filterAdvance($search, $client_segment_id, $type, $asesor_id)->orderBy('id', 'asc')->get();
        return Excel::download(new ExportClient($clients),"Clientes_descargados.xlsx");
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

        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al eliminar el cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
