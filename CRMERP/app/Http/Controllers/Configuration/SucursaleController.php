<?php

namespace App\Http\Controllers\Configuration;

//use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Sucursale;

class SucursaleController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $sucursales = Sucursale::where('name', 'like', "%".$search."%")
            //->orWhere('address', 'like', "%" . $search . "%")
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
                    'created_at' => $sucursal->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_sucursal = Sucursale::where('name', $request->name)->first();
        if($if_exists_sucursal){
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una sucursal con ese nombre.',
            ]);
        }
        $sucursal = Sucursale::create($request->all());
        return response()->json([
            'message' => 200,
            'sucursal' => [
                'id' => $sucursal->id,
                'name' => $sucursal->name,
                'state' => $sucursal->state ?? 1,
                'address' => $sucursal->address,
                'created_at' => $sucursal->created_at->format('d-m-Y H:i:s'),
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
     * Actuialización de los registros de la tabla
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
        };
        //DB::enableQueryLog();
        $sucursal = Sucursale::findOrFail('id');
        //dd(DB::getQueryLog());
        //$sucursal = Sucursale::find('id');
        /* if (!$sucursal) {
            return response()->json([
                'message' => 404,
                'message_text' => 'La sucursal no existe',
            ]);
        }; */

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
     * Eliminación de los registros de la tabla
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
