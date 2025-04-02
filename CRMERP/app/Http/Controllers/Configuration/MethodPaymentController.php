<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\configuration\MethodPayment;
use Illuminate\Support\Facades\Log;

class MethodPaymentController extends Controller
{
    /**
     * Aquí mostramos todos los registros de la tabla
     */

    public function index(Request $request)
    {
        $search = $request->get('search');

        $method_payments = MethodPayment::where('name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $method_payments->total(),
            'method_payments' => $method_payments->map(function ($method_pay) {
                return [
                    'id' => $method_pay->id,
                    'name' => $method_pay->name,
                    'state' => $method_pay->state,
                    'method_payment_id' => $method_pay->method_payment_id,
                    "method_payment" => $method_pay->method_payment, //Relación existente en el modelo
                    "method_payments" => $method_pay->method_payments, //Relación existente en el modelo
                    'created_at' => $method_pay->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_method_payment = MethodPayment::where('name', $request->name)->first();
        if ($if_exists_method_payment) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un método de pago con ese nombre.',
            ]);
        }
        $method_pay = MethodPayment::create($request->all());
        return response()->json([
            'message' => 200,
            'method_payment' => [
                    'id' => $method_pay->id,
                    'name' => $method_pay->name,
                    'state' => $method_pay->state ?? 1,
                    'method_payment_id' => $method_pay->method_payment_id,
                    "method_payment" => $method_pay->method_payment, //Relación existente en el modelo
                    "method_payments" => $method_pay->method_payments, //Relación existente en el modelo
                    'created_at' => $method_pay->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El método de pago se ha creado correctamente.'
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
    /* public function update(Request $request, string $id)
    {
        $if_exists_method_payment = MethodPayment::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_method_payment) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe un método de pago con ese nombre.',
            ]);
        };
        $method_pay = MethodPayment::findOrFail($id);
        $method_pay->update($request->all());

        return response()->json([
            'message' => 200,
            'method_payment' => [
                'id' => $method_pay->id,
                'name' => $method_pay->name,
                'state' => $method_pay->state,
                'method_payment_id' => $method_pay->method_payment_id,
                "method_payment" => $method_pay->method_payment, //Relación existente en el modelo
                "method_payments" => $method_pay->method_payments, //Relación existente en el modelo
                'created_at' => $method_pay->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'El método de pago se ha actualizado correctamente.',
        ]);
    } */
    public function update(Request $request, string $id)
    {
        Log::info('Datos recibidos para actualizar:', $request->all());
        $is_exits_method_payment = MethodPayment::where("name", $request->name)
            ->where("id", "<>", $id)->first();
        if ($is_exits_method_payment) {
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del metodo de pago ya existe"
            ]);
        }
        $method_pay = MethodPayment::findOrFail($id);
        $method_pay->update($request->all());
        return response()->json([
            "message" => 200,
            "method_payment" => [
                "id" => $method_pay->id,
                "name" => $method_pay->name,
                "method_payment_id" => $method_pay->method_payment_id,
                "method_payment" => $method_pay->method_payment,
                "state" => $method_pay->state,
                "created_at" => $method_pay->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $method_pay = MethodPayment::findOrFail($id);
        //VALIDACIÓN POR PROFORMA
        $method_pay->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Sucursal eliminada correctamente',
        ]);
    }
}
