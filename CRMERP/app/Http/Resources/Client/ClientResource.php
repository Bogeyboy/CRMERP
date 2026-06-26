<?php

namespace App\Http\Resources\Client;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'name' => $this->resource->name,
            'surname' => $this->resource->surname,
            'full_name' => $this->resource->full_name,
            'client_segment_id' => $this->resource->client_segment_id,

            //RELACIÓN CON CLIENT_SEGMENT
            'client_segment' => $this->resource->client_segment ? [
                'id' => $this->resource->client_segment->id,
                'name' => $this->resource->client_segment->name,
            ] : null,

            'state' => $this->resource->state,
            'phone' => $this->resource->phone,
            'email' => $this->resource->email,
            'type' => $this->resource->type,
            'type_document' => $this->resource->type_document,
            'n_document' => $this->resource->n_document,
            'birthdate' => $this->resource->birthdate ? Carbon::parse($this->resource->birthdate)->format('d-m-Y') : null,
            'address' => $this->resource->address,
            'sucursale_id' => $this->resource->sucursale_id,

            //RELACIÓN CON SUCURSALE
            'sucursale' => $this->resource->sucursale ? [
                'id' => $this->resource->sucursale->id,
                'name' => $this->resource->sucursale->name,
            ] : null,

            //RELACIÓN CON USER (ASESOR)
            'asesor' => $this->resource->asesor ? [
                'id' => $this->resource->asesor->id,
                'full_name' => $this->resource->asesor->name . ' ' . $this->resource->asesor->surname,
                //'surname' => $this->resource->asesor->surname,
            ] : null,
            'asesor_id' => $this->resource->asesor_id,
            'is_parcial' => $this->resource->is_parcial,
            'ubigeo_region' => $this->resource->ubigeo_region,
            'ubigeo_provincia' => $this->resource->ubigeo_provincia,
            'ubigeo_distrito' => $this->resource->ubigeo_distrito,
            'region' => $this->resource->region,
            'provincia' => $this->resource->provincia,
            'distrito' => $this->resource->distrito,
            'created_at' => $this->resource->created_at->format('d-m-Y H:i:s'),
        ];
    }
}
