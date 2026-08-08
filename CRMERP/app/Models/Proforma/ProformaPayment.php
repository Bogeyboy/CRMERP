<?php

namespace App\Models\Proforma;

use App\Models\configuration\MethodPayment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaPayment extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'proforma_id',
        'method_payment_id',
        'amount',
        'date_validation',
        'n_transaction'
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

    public function method_payment()
    {
        return $this->belongsTo(MethodPayment::class, 'method_payment_id');
    }
}

