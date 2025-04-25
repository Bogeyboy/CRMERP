<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Provider;
use Illuminate\Support\Facades\Storage;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $providers = Provider::where('full_name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $providers->total(),
            'providers' => $providers->map(function ($provider) {
                return [
                    'id' => $provider->id,
                    'full_name' => $provider->full_name,
                    'comercial_name' => $provider->comercial_name,
                    'nif' => $provider->nif,
                    'email' => $provider->email,
                    'phone' => $provider->phone,
                    'address' => $provider->address,
                    'state' => $provider->state,
                    'imagen' => $provider->imagen ? env('APP_URL') . 'storage/' . $provider->imagen : null,
                    'created_at' => $provider->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_provider = Provider::where('full_name', $request->full_name)->first();
        if ($if_exists_provider) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un proveedor con ese nombre.',
            ]);
        }
        
        $if_exists_provider = Provider::where('nif', $request->nif)->first();
        if ($if_exists_provider) {
            return response()->json([
                'message' => 403,
                'message_text' => 'El NIF del proveedor ya existe.',
            ]);
        }

        if ($request->hasFile('provider_imagen')) {
            $file = $request->file('imagen');
            $path = Storage::putFile("providers", $request->file('provider_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $provider = Provider::create($request->all());
        return response()->json([
            'message' => 200,
            'provider' => [
                'id' => $provider->id,
                'full_name' => $provider->full_name,
                'comercial_name' => $provider->comercial_name,
                'nif' => $provider->nif,
                'email' => $provider->email,
                'phone' => $provider->phone,
                'address' => $provider->address,
                'state' => $provider->state ?? 1,
                'imagen' => $provider->imagen ? env('APP_URL') . 'storage/' . $provider->imagen : null,
                'created_at' => $provider->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El proveedor se ha creado correctamente.'
        ]);
    }

    /**
     * Actuialización de los registros de la tabla
     */
    public function update(Request $request, string $id)
    {
        $if_exists_provider = Provider::where('full_name', $request->full_name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_provider) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un proveedor con esa razón social.',
            ]);
        };

        $if_exists_provider = Provider::where('nif', $request->nif)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_provider) {
            return response()->json([
                'message' => 403,
                'message_text' => 'El NIF del proveedor ya existe.',
            ]);
        };

        $provider = Provider::findOrFail($id);

        if ($request->hasFile('provider_imagen')) {
            if ($provider->imagen) {
                Storage::delete($provider->imagen);
            }
            $file = $request->file('imagen');
            $path = Storage::putFile("providers", $request->file('provider_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $provider->update($request->all());

        return response()->json([
            'message' => 200,
            'provider' => [
                'id' => $provider->id,
                'full_name' => $provider->full_name,
                'comercial_name' => $provider->comercial_name,
                'nif' => $provider->nif,
                'email' => $provider->email,
                'phone' => $provider->phone,
                'address' => $provider->address,
                'state' => $provider->state,
                'imagen' => $provider->imagen ? env('APP_URL') . 'storage/' . $provider->imagen : null,
                'created_at' => $provider->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El proveedor se ha actualizado correctamente.',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $provider = Provider::findOrFail($id);
        //VALIDACIÓN PRO PRODUCTO
        $provider->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Proveedor eliminado correctamente.',
        ]);
    }
}
