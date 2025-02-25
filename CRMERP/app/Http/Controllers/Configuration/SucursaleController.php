<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Sucursale;

class SucursaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $sucursales = Sucursale::where('name', 'like', "%$search%")
            ->orWhere('address', 'like', "%$search%")
            ->orderBy('id', 'desc')
            ->paginate(25);
        
        return response()->json([
            'total' => $sucursales->total(),
            'sucursales' => $sucursales->map(function($sucursal){
                return [
                    'id' => $sucursal->id,
                    'name' => $sucursal->name,
                    'state' => $sucursal->state,
                    'address' => $sucursal->address,
                    'created_at' => $sucursal->created_at->format('Y-m-d H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $if_exists_sucursal = Sucursale::where('name', $request->name)->first();
        if($if_exists_sucursal){
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una sucursal con ese nombre',
            ]);
        }
        $sucursal = Sucursale::create($request->all());
        return response()->json([
            'message' => 200,
            'sucursal' => [
                'id' => $sucursal->id,
                'name' => $sucursal->name,
                'state' => $sucursal->state,
                'address' => $sucursal->address,
                'created_at' => $sucursal->created_at->format('Y-m-d H:i:s'),
            ],
            'message_text' => 'La sucursal se ha creado correctamente'
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $if_exists_sucursal = Sucursale::where('name', $request->name)
                                        ->where('id','<>',$id)
                                        ->first();
        if ($if_exists_sucursal) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una sucursal con ese nombre',
            ]);
        }
        $sucursal = Sucursale::findOrFail('id');
        $sucursal->update($request->all());

        return response()->json([
            'message' => 200,
            'sucursal' => [
                'id' => $sucursal->id,
                'name' => $sucursal->name,
                'state' => $sucursal->state,
                'address' => $sucursal->address,
                'created_at' => $sucursal->created_at->format('Y-m-d H:i:s'),
            ],
            'message_text' => 'La sucursal se ha actualizado correctamente',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sucursal = Sucursale::findOrFail('id');
        //VALIDACIÓN POR PROFORMA
        $sucursal->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Sucursal eliminada correctamente',
        ]);
    }
}
