<?php

namespace App\Models\Client;

use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursale;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Client extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name',
        'surname',
        'full_name',
        'client_segment_id',
        'origen',
        'sexo',
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

    public function scopeFilterAdvance($query, $search, $client_segment_id, $type, $asesor_id)
    {
        if ($search)
        {
            $query->where(DB::raw("CONCAT(clients.full_name, ' ', clients.phone, ' ', clients.n_document)"), 'like', "%" . $search . "%");
            /* 'full_name', 'like', "%" . $search . "%")
                ->orWhere('phone', 'like', "%" . $search . "%")
                ->orWhere('n_document', 'like', "%" . $search . "%"); */
        }

        if ($client_segment_id)
        {
            $query->where('client_segment_id', $client_segment_id);
        }

        if ($type)
        {
            $query->where('type', $type);
        }

        if ($asesor_id)
        {
            $query->where('asesor_id', $asesor_id);
        }

        return $query;
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

    public function setBirthdateAttribute($value)
    {
        // Si la fecha viene en formato DD-MM-YYYY, convertir a YYYY-MM-DD
        if ($value && preg_match('/^\d{2}-\d{2}-\d{4}$/', $value))
        {
            $date = \Carbon\Carbon::createFromFormat('d-m-Y', $value);
            $this->attributes['birthdate'] = $date->format('Y-m-d');
        }
        else
        {
            $this->attributes['birthdate'] = $value;
        }
    }
}
