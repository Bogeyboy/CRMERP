<?php

namespace App\Http\Controllers\Proforma;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\configuration\MethodPayment;
use App\Models\Configuration\Sucursal_deliverie;
use App\Models\Product\Product;
use App\Models\Proforma\Proforma;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use NunoMaduro\Collision\Adapters\Phpunit\State;

class ProformaController extends Controller
{
    public function config()
    {
        date_default_timezone_set('Europe/Madrid');
        try
        {
            $client_segment = client_segment::where('state', 1)->get();
            $asesores = User::whereHas('roles', function ($q) {
                $q->where('name', 'like', '%Asesor%');
            })->get();
            
            $sucursal_deliverie = Sucursal_deliverie::where('state',1)->get();
            $method_payments = MethodPayment::where('state',1)->whereNull('method_payment_id')->get();
            $today = now()->format('d/m/Y');

            return response()->json([
                'client_segments' => $client_segment,
                'asesores' => $asesores->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'full_name' => $user->name . ' ' . $user->surname,
                    ];
                }),
                'sucursal_deliverie' => $sucursal_deliverie->map(function ($sucursale_del){
                    return [
                        'id' => $sucursale_del->id,
                        'name' => $sucursale_del->name,
                    ];
                }),
                'method_payments' => $method_payments->map(function($method_payment) {
                    return [
                        'id' => $method_payment->id,
                        'name' => $method_payment->name,
                        'bancos' =>$method_payment->method_payments->map(function($children){
                            return [
                                'id' => $children->id,
                                'name' => $children->name,
                            ];
                        }),
                        'state' => $method_payment->state,
                    ];
                }),
                'today' => $today,
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

    //FUNCIÓN PARA BUSCAR PRODUCTOS PARA AÑADIR A LA PROFORMA
    public function search_products(Request $request)
    {
        $search = $request->get('search');
        $products = Product::where(DB::raw("CONCAT(products.title,' ',products.sku)"),"like","%".$search."%")
                    ->orderBy('id','desc')
                    ->get();
        
        return response()->json([
            'products' => ProductCollection::make($products),
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

    //MOSTRAR ELEMENTO ESPECÍFICO
    public function show(string $id)
    {
        //
    }

    //ACTUALIZACIÓN DE REGISTROS DE LA PROFORMA
    public function update(Request $request, string $id)
    {
        //DB::enableQueryLog();
        $proforma = Proforma::findOrFail($id);
        $proforma->update($request->all());

        return response()->json([
            'message' => 200,
        ]);
    }

    //ELIMINACIÓN DE REGISTROS
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
