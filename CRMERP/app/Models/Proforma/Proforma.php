<?php

namespace App\Models\Proforma;

use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
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

}
