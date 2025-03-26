<?php

namespace App\Models\configuration;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class MethodPayment extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name',
        'method_payment_id',
        'address',
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

    //PADRE
    public function method_payment()
    {
        return $this->belongsTo(MethodPayment::class, 'method_payment_id');
    }

    //HIJOS
    public function method_payments()
    {
        return $this->hasMany(MethodPayment::class, 'method_payment_id');
    }
}
