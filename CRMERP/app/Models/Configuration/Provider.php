<?php

namespace App\Models\Configuration;

use App\Models\Product\Product;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Provider extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'full_name',
        'comercial_name',
        'nif',
        'email',
        'phone',
        'address',
        'imagen',
        'state',
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
    public function products()
    {
        return $this->hasMany(Product::class, 'id');
    }
}
