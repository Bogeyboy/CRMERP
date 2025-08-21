<?php

namespace App\Models\Product;

use Carbon\Carbon;
use App\Models\Configuration\Unit;
use Illuminate\Support\Facades\DB;
use App\Models\Product\ProductWallet;
use App\Models\Configuration\Provider;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product\ProductWarehouse;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Configuration\ProductCategorie;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'state',
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
    //Relaciones con otras tablas
    public function umbral_unit()
    {
        return $this->belongsTo(Unit::class, 'umbral_unit_id');
    }
    public function product_categorie()
    {
        return $this->belongsTo(ProductCategorie::class, 'product_categorie_id');
    }
    //Relación con la tabla providers
    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
    public function wallets()
    {
        return $this->hasMany(ProductWallet::class);
    }
    public function warehouses()
    {
        return $this->hasMany(ProductWarehouse::class);
    }
    public function scopeFilterAdvance (
        $query,
        $search,
        $product_categorie_id,
        $disponibilidad,
        $tax_selected,
        $provider_id,
        $sucursale_price_multiple,
        $almacen_warehouse,
        $client_segment_price_multiple,
        $state,
        $unit_warehouse) {
        if(!empty($search))
        {
            /* $query->where('title', 'LIKE', "%{$search}%"); */
            $query->where(DB::raw("CONCAT(products.title,' ',products.sku)"), 'LIKE', "%{$search}%");
        }
        //Variable para el filtrado por categoria de producto
        if (!empty($product_categorie_id)) {
            $query->where('product_categorie_id',$product_categorie_id);
        }
        //Variable para el filtrado por disponibilidad
        if (!is_null($disponibilidad)) {
            $query->where('disponibilidad', $disponibilidad);
        }
        //Variable para el filtrado por impuesto seleccionado
        if (!is_null($tax_selected)) {
            $query->where('tax_selected', $tax_selected);
        }
        //Variable para el filtrado por proveedor
            if (!is_null($provider_id) && $provider_id !== '') {
                $query->where('products.provider_id', (int)$provider_id);
            }
        /* if (!is_null($provider_id) && $provider_id !== '') {
            // Si viene como string "5,7,9" lo convertimos en array
            if (is_string($provider_id) && str_contains($provider_id, ',')) {
                $provider_id = explode(',', $provider_id);
            }
            // Si viene como único valor → lo casteamos a int
            if (is_numeric($provider_id)) {
                $query->where('products.provider_id', (int) $provider_id);
            }
            // Si viene como array → aplicamos whereIn
            if (is_array($provider_id)) {
                $ids = array_filter(array_map('intval', $provider_id), fn($v) => $v === 0 || $v > 0);
                if (count($ids) === 1) {
                    $query->where('products.provider_id', $ids[0]);
                } elseif (count($ids) > 1) {
                    $query->whereIn('products.provider_id', $ids);
                }
            }
        } */

        //Variable para el filtrado por sucursal de precio
        if($sucursale_price_multiple){
            $query->whereHas('wallets',function($sub) use ($sucursale_price_multiple) {
                $sub->where('sucursal_id', $sucursale_price_multiple);
            });
        }
        //Variable para el filtrado por segmento de cliente
        if ($client_segment_price_multiple) {
            $query->whereHas('wallets', function ($sub) use ($client_segment_price_multiple) {
                $sub->where('client_segment_id', $client_segment_price_multiple);
            });
        }
        //Variable para el filtrado por almacén
        if ($almacen_warehouse) {
            $query->whereHas('warehouses', function ($sub) use ($almacen_warehouse) {
                $sub->where('warehouse_id', $almacen_warehouse);
            });
        }
        //Variable para el filtrado por unidades de almacén
        if ($unit_warehouse) {
            $query->whereHas('warehouses', function ($sub) use ($unit_warehouse) {
                $sub->where('unit_id', $unit_warehouse);
            });
        }
        //Variable para el filtrado por estado
        if ($state) {
            $query->where('state', $state);
        }
        return $query;
    }
}
