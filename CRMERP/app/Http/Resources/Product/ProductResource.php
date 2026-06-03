<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'sku' => $this->resource->sku,
            'product_categorie_id' => $this->resource->product_categorie_id,
            'product_categorie' => [
                'id' => $this->resource->product_categorie->id,
                'name' => $this->resource->product_categorie->name,
            ],
            'imagen' => $this->resource->imagen,
            'price_general' => $this->resource->price_general,
            'description' => $this->resource->description,
            'specifications' => $this->resource->specifications ? json_decode($this->resource->specifications, true) : [],
            'min_discount' => $this->resource->min_discount,
            'max_discount' => $this->resource->max_discount,
            'is_gift' => $this->resource->is_gift,
            'umbral' => $this->resource->umbral,
            'state' => $this->resource->state,
            'umbral_unit_id' => $this->resource->umbral_unit_id,
            'umbral_unit' => $this->resource->umbral_unit ? [
                'id' => $this->resource->umbral_unit->id,
                'name' => $this->resource->umbral_unit->name,
            ] : null,
            'disponibilidad' => $this->resource->disponibilidad,
            'tiempo_de_abastecimiento' => $this->resource->tiempo_de_abastecimiento,
            'provider_id' => $this->resource->provider_id,
            'provider' => $this->resource->provider ? [
                'id' => $this->resource->provider->id,
                'full_name' => $this->resource->provider->full_name,
            ] : null,
            'is_discount' => $this->resource->is_discount,
            'tax_selected' => $this->resource->tax_selected,
            'importe_iva' => $this->resource->importe_iva,
            'weight' => $this->resource->weight,
            'width' => $this->resource->width,
            'height' => $this->resource->height,
            'length' => $this->resource->length,

            //PRECIOS MULTIPLES
            'wallets' => $this->resource->wallets && $this->resource->wallets->count() > 0
                ? $this->resource->wallets->map(function ($wallet) {
                    return [
                        'id' => $wallet->id,
                        'unit' => $wallet->unit ? [
                            'id' => $wallet->unit->id,
                            'name' => $wallet->unit->name,
                        ] : null,
                        'sucursale' => $wallet->sucursale ? [
                            'id' => $wallet->sucursale->id,
                            'name' => $wallet->sucursale->name,
                        ] : null,
                        'client_segment' => $wallet->client_segment ? [
                            'id' => $wallet->client_segment->id,
                            'name' => $wallet->client_segment->name,
                        ] : null,
                        'price_general' => $wallet->price,
                        'sucursale_price_multiple' => $wallet->sucursale ? $wallet->sucursale->id : null,
                        'client_segment_price_multiple' => $wallet->client_segment ? $wallet->client_segment->id : null,
                    ];
                }) : [],

            //ALMACENES - CORREGIDO: Se incluye el pivot.id
            'warehouses' => $this->resource->productWarehouses && $this->resource->productWarehouses->count() > 0
                ? $this->resource->productWarehouses->map(function ($productWarehouse) {
                    // $productWarehouse es una instancia de ProductWarehouse
                    return [
                        'id' => $productWarehouse->id,  // ← ID del warehouse (almacén)
                        'pivot' => [  // ← IMPORTANTE: Incluir el pivot con el ID del product_warehouse
                            'id' => $productWarehouse->id,  // ← ¡ESTE ES EL ID QUE NECESITAS!
                            'product_id' => $productWarehouse->product_id,
                            'warehouse_id' => $productWarehouse->warehouse_id,
                            'unit_id' => $productWarehouse->unit_id,
                            'stock' => $productWarehouse->stock,
                            'created_at' => $productWarehouse->created_at,
                            'updated_at' => $productWarehouse->updated_at,
                        ],
                        'unit' => $productWarehouse->unit ? [
                            'id' => $productWarehouse->unit->id,
                            'name' => $productWarehouse->unit->name,
                            'description' => $productWarehouse->unit->description,
                            'state' => $productWarehouse->unit->state,
                            'pivot' => [  // También incluir pivot para la unidad si es necesario
                                'warehouse_id' => $productWarehouse->warehouse_id,
                                'unit_id' => $productWarehouse->unit_id,
                                'product_id' => $productWarehouse->product_id,
                                'stock' => $productWarehouse->stock,
                                'created_at' => $productWarehouse->created_at,
                                'updated_at' => $productWarehouse->updated_at,
                            ]
                        ] : null,
                        'warehouse' => $productWarehouse->warehouse ? [
                            'id' => $productWarehouse->warehouse->id,
                            'name' => $productWarehouse->warehouse->name,
                            'state' => $productWarehouse->warehouse->state,
                            'address' => $productWarehouse->warehouse->address,
                            'sucursale_id' => $productWarehouse->warehouse->sucursale_id,
                            'sucursale' => $productWarehouse->warehouse->sucursale ? [
                                'id' => $productWarehouse->warehouse->sucursale->id,
                                'name' => $productWarehouse->warehouse->sucursale->name,
                            ] : null,
                        ] : null,
                        'quantity' => $productWarehouse->stock ?? 0,
                        'unit_id' => $productWarehouse->unit_id,
                        'warehouse_id' => $productWarehouse->warehouse_id,
                        'product_id' => $productWarehouse->product_id,
                        'created_at' => $productWarehouse->created_at,
                        'updated_at' => $productWarehouse->updated_at,
                    ];
                }) : [],
        ];
    }
}
