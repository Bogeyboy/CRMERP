<?php

namespace App\Http\Resources\Proforma;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProformaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
        [
            'id' => $this->resource->id,
            'user_id' => $this->resource->user_id,

            /* 'asesor' => $this->resource->asesor ?
            [
                'id' => $this->resource->user->id,
                'full_name' => $this->resource->user->name.' '.$this->resource->user->surname,
            ] : null, */
            'asesor' => $this->resource->asesor ?
            [
                'id' => $this->resource->asesor->id,
                'full_name' => $this->resource->asesor->name.' '.$this->resource->asesor->surname,
            ] : null,

            'client_id' => $this->resource->client_id,
            //CLIENTE
            'client' => $this->resource->client ?
            [
                'id' => $this->resource->client->id,
                'full_name' => $this->resource->client->full_name,
                'client_segment' => $this->resource->client_segment ?
                [
                    'id' => $this->resource->client_segment->id,
                    'name' => $this->resource->client_segment->name,
                ] : null,
            ] : null,

            'client_segment_id' => $this->resource->client_segment_id,
            'client_segment' => $this->resource->client_segment ?
                [
                    'id' => $this->resource->client_segment->id,
                    'name' => $this->resource->client_segment->name,
                ] : null,

            'sucursale_id' => $this->resource->sucursale_id,
            'sucursale' => $this->resource->sucursale ?
            [
                'id' => $this->resource->sucursale->id,
                'name' => $this->resource->sucursale->name,
            ] : null,

            'subtotal' => $this->resource->subtotal,
            'discount' => $this->resource->discount,
            'total' => $this->resource->total,
            'iva' => $this->resource->iva,
            'state' => $this->resource->state,
            'state_payment' => $this->resource->state_payment,
            'debt' => $this->resource->debt,
            'paid_out' => $this->resource->paid_out,
            'date_validation' => $this->resource->date_validation,
            'day_pay_complete' => $this->resource->day_pay_complete,
            'description' => $this->resource->description,
            'created_at' => $this->resource->created_at->format('Y-m-d h:i:A'),

            //DETALLES DE LA PROFORMA
            'details' => $this->resource->details->map(function($detail)
            {
                return
                [
                    'id' => $detail->id,
                    'product_id' => $detail->product_id,
                    'product' => $detail->product ?
                    [
                        'id' => $detail->product->id,
                        'title' => $detail->product->title,
                        //'imagen' => env('APP_URL').'storage/'.$detail->product->imagen, //RUTA COMPLETA DE LA IMAGEN DENTRO DE LA APLICACIÓN
                        'imagen' => $detail->product->imagen, //RUTA COMPLETA DE LA IMAGEN DENTRO DE LA APLICACIÓN
                    ] : null,

                    'product_categorie_id' =>$detail->product_categorie_id,

                    'product_categorie' => $detail->product_categorie ?
                    [
                        'id' => $detail->product_categorie->id,
                        'name' => $detail->product_categorie->name,
                    ] : null,

                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                    'discount' => $detail->discount,
                    'subtotal' => $detail->subtotal,
                    'total' => $detail->total,
                    'amount' => $detail->amount,
                    'description' => $detail->description,
                    'unit_id' => $detail->unit_id,
                    'unit' => $detail->unit ?
                    [
                        'id' => $detail->unit->id,
                        'name' => $detail->unit->name,
                    ] : null,

                    'impuesto' => $detail->impuesto,
                ];
            }),

            //ENTREGA DE LA PROFORMA
            'proforma_deliverie' => $this->resource->proforma_deliverie ?
            [
                'id' => $this->resource->proforma_deliverie->id,
                
                'sucursal_deliverie_id' => $this->resource->proforma_deliverie->sucursal_deliverie_id,
                'sucursal_deliverie' => $this->resource->proforma_deliverie->sucursal_deliverie ?
                [
                    'id' => $this->resource->proforma_deliverie->sucursal_deliverie->id,
                    'name' => $this->resource->proforma_deliverie->sucursal_deliverie->name,
                ] : null,   
                
                'date_envio' => Carbon::parse($this->resource->proforma_deliverie->date_envio)->format('d/m/Y'),
                'date_entrega' => Carbon::parse($this->resource->proforma_deliverie->date_entrega)->format('d/m/Y'),
                'address' => $this->resource->proforma_deliverie->address,
                'ubigeo_region' => $this->resource->proforma_deliverie->ubigeo_region,
                'ubigeo_provincia' => $this->resource->proforma_deliverie->ubigeo_provincia,
                'ubigeo_distrito' => $this->resource->proforma_deliverie->ubigeo_distrito,
                'region' => $this->resource->proforma_deliverie->region,
                'provincia' => $this->resource->proforma_deliverie->provincia,
                'distrito' => $this->resource->proforma_deliverie->distrito,
                'agencia' => $this->resource->proforma_deliverie->agencia,
                'full_name_encargado' => $this->resource->proforma_deliverie->full_name_encargado,
                'documento_encargado' => $this->resource->proforma_deliverie->documento_encargado,
                'telefono_encargado' => $this->resource->proforma_deliverie->telefono_encargado,
            ] : null,

            //PAGOS DE LA PROFORMA
            'payments' => $this->resource->proforma_payments->map(function($payments)
            {
                return
                [
                    'method_payment_id' => $payments->method_payment_id,
                    'method_payment' => $payments->method_payment ?
                    [
                        'id' => $payments->method_payment->id,
                        'name' => $payments->method_payment->name,
                    ] : null,

                    'amount' => $payments->amount,
                    'date_validation' => $payments->date_validation,
                    'n_transaction' => $payments->n_transaction,
                    'comprobante' => env('APP_URL').'storage/'.$payments->comprobante,
                    'banco_id' => $payments->banco_id,
                ];
            }),
        ];
    }
}
