<?php

namespace App\Models\Proforma;

use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursal_deliverie;
use App\Models\Product\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proforma extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'user_id',
        'client_id',
        'client_segment_id',
        'subtotal',
        'discount',
        'total',
        'iva',
        'state',
        'state_payment',
        'debt',
        'paid_out',
        'date_validation',
        'day_pay_complete',
        'description',
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
    public function asesor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function client_segment()
    {
        return $this->belongsTo(client_segment::class, 'client_segment_id');
    }

    public function details()
    {
        return $this->hasMany(ProformaDetail::class,'proforma_id');
    }

    public function product()
    {
        return $this->hasMany(Product::class,'product_id');
    }

    public function proforma_deliverie ()
    {
        return $this->hasOne(ProformaDeliverie::class,'proforma_id');
    }

    public function proforma_payments()
    {
        return $this->hasMany(ProformaPayment::class,'proforma_id');
    }

    public function scopeFilterAdvance($query, $search, $client_segment_id, $asesor_id, $product_categorie_id, $search_client,
                                        $search_product, $start_date, $end_date, $state_proforma)
    {
        //Búsqueda por id de proforma
        if($search)
        {
            $query->where('id',$search);
        }
        //Búsqueda por segmento de cliente de la proforma
        if($client_segment_id)
        {
            $query->where('client_segment_id',$client_segment_id);
        }
        //Búsqueda por asesor de la proforma
        if($asesor_id)
        {
            $query->where('user_id',$asesor_id);
        }
        //Búsqueda por categoría de productos en la proforma
        if($product_categorie_id)
        {
            $query->whereHas('details', function($sq) use($product_categorie_id)
            {
                $sq->where('product_categorie_id',$product_categorie_id);
            });
        }
        //Búsqueda por nombre de cliente
        if($search_client)
        {
            $query->whereHas('client', function($sq) use($search_client)
            {
                $sq->where('full_name','like','%'.$search_client.'%');
            });
        }
        //Búsqueda por productos en la proforma
        if($search_product)
        {
            $query->whereHas('details', function($sq) use($search_product)
            {
                $sq->whereHas('product',function($ssq) use($search_product)
                {
                    $ssq->where('title','like','%'.$search_product.'%');
                });
            });
        }
        //Búsqueda por rango de fechas
        if($start_date && $end_date)
        {
            $query->whereBetween('created_at',[
                Carbon::parse($start_date)->format('Y-m-d').' 00:00:00',
                Carbon::parse($end_date)->format('Y-m-d').' 23:59:59',
            ]);
        }
        //Búsqueda por estado de la proforma
        if($state_proforma)
        {
            $query->where('state',$state_proforma);
        }
        return $query;
    }

}
