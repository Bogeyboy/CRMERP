<?php

namespace App\Models\Product;

use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        'state_stock',
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
    public function productWarehouses()
    {
        return $this->hasMany(ProductWarehouse::class, 'product_id');
    }
    /* public function warehouses()
    {
        // Asegúrate de incluir 'stock' en el pivot
        return $this->belongsToMany(ProductWarehouse::class, 'product_warehouses', 'product_id', 'warehouse_id')
            ->withPivot('id', 'stock', 'unit_id') // IMPORTANTE: incluir 'stock'
            ->withTimestamps();
    } */
    public function warehouses()
    {
        // Cambiado de belongsToMany a hasMany porque es una relación directa
        return $this->hasMany(ProductWarehouse::class, 'product_id');
    }

    public function getImagenAttribute($value)
    {
        Log::info('🔍 Accessor getImagenAttribute llamado');
        Log::info('Valor original en BD:', ['imagen' => $value]);

        if (!$value) {
            Log::info('No hay imagen, retornando null');
            return null;
        }

        // Si ya es una URL completa
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            Log::info('Es URL externa, retornando:', ['url' => $value]);
            return $value;
        }

        // Si es ruta local
        $fullUrl = asset('storage/' . $value);
        Log::info('Es ruta local, retornando:', ['url' => $fullUrl]);
        return $fullUrl;
    }
    public function setImagenAttribute($value)
    {
        if (!$value) {
            $this->attributes['imagen'] = null;
            return;
        }

        // Si es un archivo subido (UploadedFile)
        if ($value instanceof \Illuminate\Http\UploadedFile) {
            $path = $value->store('products', 'public');
            $this->attributes['imagen'] = $path;
            return;
        }

        // Si es una URL externa, guardarla tal cual
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            $this->attributes['imagen'] = $value;
            return;
        }

        // Si es una ruta existente en storage, guardar la ruta relativa
        if (Str::startsWith($value, 'products/')) {
            $this->attributes['imagen'] = $value;
            return;
        }

        // Si ya tiene el dominio del storage, extraer solo la ruta
        if (Str::contains($value, '/storage/')) {
            $path = Str::after($value, '/storage/');
            $this->attributes['imagen'] = $path;
            return;
        }

        // Por defecto, guardar como está
        $this->attributes['imagen'] = $value;
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
        $unit_warehouse)
        {
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
                $query->whereHas('productWarehouses', function ($sub) use ($almacen_warehouse) {
                    $sub->where('warehouse_id', $almacen_warehouse);
                });
            }
            //Variable para el filtrado por unidades de almacén
            if ($unit_warehouse) {
                $query->whereHas('productWarehouses', function ($sub) use ($unit_warehouse) {
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
