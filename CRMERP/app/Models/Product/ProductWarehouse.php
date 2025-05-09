<?php

namespace App\Models\Product;

use Carbon\Carbon;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductWarehouse extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'unit_id',
        'warehouse_id',
        'stock',
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
    //Relación con Almacén
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }
}
