<?php

namespace App\Models\Proforma;

use App\Models\Configuration\ProductCategorie;
use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class ProformaDetail extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'proforma_detalle';

    protected $fillable = [
        'proforma_id',
        'product_id',
        'product_categorie_id',
        'quantity',
        'price',
        'discount',
        'subtotal',
        'total',
        'amount',
        'description',
        'unit_id',
        'impuesto',
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
    //RELACIONES
    public function proforma()
    {
        return $this->belongsTo(Proforma::class, 'proforma_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    
    public function product_categorie()
    {
        return $this->belongsTo(ProductCategorie::class, 'product_categorie_id');
    }
}
