<?php

namespace App\Http\Controllers\Proforma;

use App\Exports\Proforma\ProformaDetailExport;
use App\Exports\Proforma\ProformaGeneralExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Proforma\ProformaCollection;
use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\configuration\MethodPayment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Sucursal_deliverie;
use App\Models\Product\Product;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDeliverie;
use App\Models\Proforma\ProformaDetail;
use App\Models\Proforma\ProformaPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use NunoMaduro\Collision\Adapters\Phpunit\State;
use Symfony\Component\HttpKernel\Exception\HttpException;

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
            $product_categories = ProductCategorie::where('state',1)->get();
            $today = now()->format('d/m/Y');

            return response()->json([
                'client_segments' => $client_segment,
                'product_categories' => $product_categories,
                'asesores' => $asesores->map(function ($user)
                {
                    return [
                        'id' => $user->id,
                        'full_name' => $user->name . ' ' . $user->surname,
                    ];
                }),
                'sucursal_deliverie' => $sucursal_deliverie->map(function ($sucursale_del)
                {
                    return [
                        'id' => $sucursale_del->id,
                        'name' => $sucursale_del->name,
                    ];
                }),
                'method_payments' => $method_payments->map(function($method_payment)
                {
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
        //$search = $request->get('search');
        $search = $request->search;
        $client_segment_id = $request->client_segment_id;
        $asesor_id = $request->asesor_id;
        $product_categorie_id = $request->product_categorie_id;
        $search_client = $request->search_client;
        $search_product = $request->search_product;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $state_proforma = $request->state_proforma;

        //$proformas = Proforma::orderBy('id', 'desc')->paginate(25);

        /* $proformas = Proforma::filterAdvance(
            $search, $client_segment_id, $asesor_id, $product_categorie_id, $search_client,
            $search_product, $start_date, $end_date, $state_proforma
        )->orderBy('id', 'desc')->paginate(25); */
        $proformas = Proforma::with(['client', 'client_segment', 'asesor'])
            ->filterAdvance(
                $search, $client_segment_id, $asesor_id, $product_categorie_id, $search_client,
                $search_product, $start_date, $end_date, $state_proforma
            )
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $proformas->total(),
            'proformas' => ProformaCollection::make($proformas),
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
        try
        {
            DB::beginTransaction();
            //VARIABLES PARA LA CREACIÓN DE LA PROFORMA
            $proforma = Proforma::create([
                'user_id' => $request->user_id,
                'client_id' => $request->client_id,
                'client_segment_id' => $request->client_segment_id,
                'sucursale_id' => auth('api')->user()->sucursale_id,
                'subtotal' => $request->subtotal,
                'discount' => $request->discount, // DESCUENTO TOTAL EN EUROS DE LA PROFORMA viene de PROFORMA_TOTAL_DISCOUNT
                'total' => $request->total,
                'iva' => $request->iva,
                'debt' => $request->debt,
                'paid_out' => $request->paid_out,
                'description' => $request->description,
            ]);

            $DETAIL_PROFORMAS = json_decode($request->DETAIL_PROFORMAS, true);

            //VARIABLES PARA EL DETALLADO DE LA PROFORMA
            foreach ($DETAIL_PROFORMAS as $DETAIL)
            {
                ProformaDetail::create([
                    'proforma_id' => $proforma->id,
                    'product_id' => $DETAIL['product']['id'],
                    'product_categorie_id' => $DETAIL['product']['product_categorie_id'],
                    'description' => $DETAIL['description'],
                    'unit_id' => $DETAIL['unidad_product'],
                    'quantity' => $DETAIL['quantity'],
                    //'price_unit' => $DETAIL['price_unit'],
                    'price' => $DETAIL['price_unit'],
                    //'discount' => $DETAIL['discount'], // DESCUENTO DEL PRODUCTO EN EL DETALLE DE LA PROFORMA
                    'discount' => $DETAIL['product_discount'], // DESCUENTO DEL PRODUCTO EN EL DETALLE DE LA PROFORMA
                    'subtotal' => $DETAIL['subtotal'], // SUBTOTAL DEL PRODUCTO SIN IIMPUESTO EN LA PROFORMA
                    'impuesto' => $DETAIL['impuesto'], // IMPUESTO DEL PRODUCTO EN LA PROFORMA
                    'total' => $DETAIL['total'], // TOTAL DEL PRODUCTO CON IMPUESTO EN LA PROFORMA
                    'amount' => $DETAIL['amount'], // CANTIDAD PAGADA DEL PRODUCTO EN LA PROFORMA
                ]);
            }

            //VARIABLES PARA EL ENVIO DE LA PROFORMA
            ProformaDeliverie::create([
                'proforma_id' => $proforma->id,
                'sucursal_deliverie_id' => $request->sucursal_deliverie_id,
                'date_entrega' => $request->date_entrega,
                // 'date_envio' => Carbon::parse($request->date_entrega)->subDays(2)->format('Y-m-d'),
                'date_envio' => Carbon::parse($request->date_entrega)->subDays(2),
                'address' => $request->address,
                'ubigeo_region' => $request->ubigeo_region,
                'ubigeo_provincia' => $request->ubigeo_provincia,
                'ubigeo_distrito' => $request->ubigeo_distrito,
                'region' => $request->region,
                'provincia' => $request->provincia,
                'distrito' => $request->distrito,
                'agencia' => $request->agencia,
                'full_name_encargado' => $request->full_name_encargado,
                'documento_encargado' => $request->documento_encargado,
                'telefono_encargado' => $request->telefono_encargado,
            ]);

            $comprobante = '';

            if ($request->hasFile('payment_file'))
            {
                $comprobante = $request->file('payment_file')->store('payments', 'public');
                $request->merge(['imagen' => $comprobante]);
            }

            if($request->method_payment_id)
            {
                ProformaPayment::create([
                    'proforma_id' => $proforma->id,
                    'method_payment_id' => $request->method_payment_id,
                    'amount' => $request->amount_payment,
                    'comprobante' => $comprobante,
                    'banco_id' => $request->banco_id,
                ]);
            }

            DB::commit();
        }
        catch (\Throwable $th)
        {
            DB::rollBack();
            throw new HttpException(500,$th->getMessage());
        }

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

    public function export_proforma_general(Request $request)
    {
        return Excel::download(new ProformaGeneralExport($request),'Proformas'.uniqid().'.xlsx');
        //return Excel::download(new ProformaGeneralExport($request),'Proformas'.uniqid().'.ods');
    }

    public function export_proforma_detail(Request $request)
    {
        return Excel::download(new ProformaDetailExport($request),'ProformasDetail'.uniqid().'.xlsx');
    }

}
