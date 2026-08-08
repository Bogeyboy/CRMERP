<?php

namespace App\Models\Proforma;

use App\Models\Configuration\Sucursal_deliverie;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaDeliverie extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'proforma_id',
        'sucursal_deliverie_id',
        'date_envio',
        'date_entrega',
        'address',
        'ubigeo_region',
        'ubigeo_provincia',
        'ubigeo_distrito',
        'region',
        'provincia',
        'distrito'
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

    public function sucursal_deliverie()
    {
        return $this->belongsTo(Sucursal_deliverie::class, 'sucursal_deliverie_id');
    }
    
}

