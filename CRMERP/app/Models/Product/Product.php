<?php

namespace App\Models\Product;

use App\Models\Configuration\Unit;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'sku',
        'product_categorie_id',
        'imagen',
        'price_general',
        'description',
        'specifications',
        'min_discount',
        'max_discount',
        'is_gift',
        'umbral',
        'umbral_unit_id',
        'disponibilidad',
        'tiempo_de_abastecimiento',
        'provider_id',
        'is_discount',
        'tax_selected',
        'importe_iva',
        'weight',
        'width',
        'height',
        'length'
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set('Europe/Madrid');
        $this->attributes['created_at'] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set('Europe/Madrid');
        /* $this->attributes['deleted_at'] = Carbon::now(); */
        $this->attributes['updated_at'] = Carbon::now();
    }
    //Relaciones con otrafs tablas
    public function umbral_unit()
    {
        return $this->belongsTo(Unit::class, 'umbral_unit_id');
    }
}
