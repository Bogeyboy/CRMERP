<?php

namespace App\Models\Client;

use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursale;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name',
        'surname',
        'full_name',
        'client_segment_id',
        'state',
        'phone',
        'email',
        'type',
        'type_document',
        'n_document',
        'birthdate',
        'address',
        'sucursale_id',
        'asesor_id',
        'is_parcial',
        'ubigeo_region',
        'ubigeo_provincia',
        'ubigeo_distrito',
        'region',
        'provincia',
        'distrito'
    ];

    public function client_segment()
    {
        return $this->belongsTo(client_segment::class);
    }

    public function asesor()
    {
        return $this->belongsTo(User::class, 'asesor_id');
    }

    public function sucursale()
    {
        return $this->belongsTo(Sucursale::class, 'sucursale_id');
    }

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
}
