<?php

namespace App\Models\Product;

use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursale;
use Carbon\Carbon;
use App\Models\Configuration\Unit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductWallet extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable =[
        'product_id',
        'unit_id',
        'client_segment_id',
        'sucursal_id',
        'price',
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

    //Relaciones con otras tablas
    //Relación con Producto
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    //Relación con Unidad
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
    //Relación con Segmento de Cliente
    public function client_segment()
    {
        return $this->belongsTo(client_segment::class, 'client_segment_id');
    }
    //Relación con Sucursal
    public function sucursale()
    {
        return $this->belongsTo(Sucursale::class, 'sucursal_id');
    }
}
