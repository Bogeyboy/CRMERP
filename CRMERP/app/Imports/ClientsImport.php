<?php

namespace App\Imports;

use App\Models\Client\Client;
use App\Models\Configuration\client_segment;
use App\Models\Configuration\Sucursale;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class ClientsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsOnError, SkipsEmptyRows
{

    use Importable;

    private $importedCount = 0;
    private $importErrors = [];
    private $rowNumber = 0;
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    /* public function model(array $row)
    {
        if ($this->isEmpty($row))
        {
            return null;
        }

        $name = $row['nombre'];
        $surname = $row['apellido'];
        $full_name = $row['nombre'] || $row['apellido'] ? $row['nombre'] . ' ' . $row['apellido'] : $row['razon_social'];
        $phone = $row['telefono'];
        $email = $row['correo'];
        $type_document = $row['tipo_documento'];
        $n_document = $row['numero_documento'];
        $address = $row['direccion'];
        $origen = $row['origen'];

        $client_segment = client_segment::where('name', 'like', '%' . trim($row['tipo_de_cliente']) . '%')->first();
        $sucursale = Sucursale::where('name', 'like', '%' . trim($row['sucursal']) . '%')->first();
        $asesor = User::where('email',trim($row['asesor']))->first();

        Log::info($asesor ? "Asesor encontrado: {$asesor->name} ({$asesor->email})" : "Asesor no encontrado: {$row['asesor']}");

        //LLAMAMOS A LOS ARCHIVOS PARA LA CONFIGURACIÓN DE LAS REGIONES DE LOS CLIENTES
        $REGIONES = File::json(base_path('public/JSON/regiones.json'));
        $PROVINCIAS = File::json(base_path('public/JSON/provincias.json'));
        $DISTRITOS = File::json(base_path('public/JSON/distritos.json'));

        $REGION_SELECTED = null;
        $PROVINCIA_SELECTED = null;
        $DISTRITO_SELECTED = null;

        //COMENZAMOS LAS BUSQUEDAS DE LOS DATOS DE UBIGEO PARA LOS CLIENTES
        //BUSCAMOS LA REGION
        foreach ($REGIONES as $key => $REGION)
        {
            if (Str::transliterate(Str::upper($REGION['name'])) === Str::transliterate(Str::upper(trim($row['region']))))
            {
                $REGION_SELECTED = $REGION;
                break;
            }
        }
        //BUSCAMOS LA PROVINCIA
        foreach ($PROVINCIAS as $key => $PROVINCIA)
        {
            if ($REGION_SELECTED && $PROVINCIA['department_id'] == $REGION_SELECTED['id'] &&
                Str::transliterate(Str::upper($PROVINCIA['name'])) === Str::transliterate(Str::upper(trim($row['provincia']))))
            {
                $PROVINCIA_SELECTED = $PROVINCIA;
                break;
            }

        }
        //BUSCAMOS EL DISTRITO
        foreach ($DISTRITOS as $key => $DISTRITO)
        {
            if ($REGION_SELECTED && $DISTRITO['department_id'] == $REGION_SELECTED['id'] &&
                $PROVINCIA_SELECTED && $DISTRITO['province_id'] == $PROVINCIA_SELECTED['id'] &&
                Str::transliterate(Str::upper($DISTRITO['name'])) === Str::transliterate(Str::upper(trim($row['distrito']))))
            {
                $DISTRITO_SELECTED = $DISTRITO;
                break;
            }
        }

        error_log("REGION_SELECTED: " . json_encode($REGION_SELECTED));
        error_log("PROVINCIA_SELECTED: " . json_encode($PROVINCIA_SELECTED));
        error_log("DISTRITO_SELECTED: " . json_encode($DISTRITO_SELECTED));

        $client = new Client([
            'name' => $name,
            'surname' => $surname,
            'full_name' => $full_name,
            'client_segment_id' => $client_segment ? $client_segment->id : 1, // Asignar un valor predeterminado si no se encuentra el segmento
            'origen' => $origen,

            'state' => 1, // Estado activo por defecto
            'phone' => $phone,
            'email' => $email,
            'type' => $row['nombre'] || $row['apellido'] ? 1 : 2, // 1: Persona, 2: Empresa
            'type_document' => $type_document,
            'n_document' => $n_document,
            'address' => $address,
            'sucursale_id' => $sucursale ? $sucursale->id : 1,
            'asesor_id' => $asesor ? $asesor->id : null,

            'ubigeo_region' => $REGION_SELECTED ? $REGION_SELECTED['id'] : null,
            'ubigeo_provincia' => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED['id'] : null,
            'ubigeo_distrito' => $DISTRITO_SELECTED ? $DISTRITO_SELECTED['id'] : null,

            'region' => $row['region'] ?? null,
            'provincia' => $row['provincia'] ?? null,
            'distrito' => $row['distrito'] ?? null
        ]);

        if ($client->save())
        {
            Log::info('Cliente importado: ' . $client);
            $this->importedCount++;
        }

        return $client;

    } */
    public function model(array $row)
    {
        if ($this->isEmpty($row))
        {
            return null;
        }

        $name = $row['nombre'];
        $surname = $row['apellido'];
        $full_name = $row['nombre'] || $row['apellido'] ? $row['nombre'] . ' ' . $row['apellido'] : $row['razon_social'];
        $phone = $row['telefono'];
        $email = $row['correo'];
        $type_document = $row['tipo_documento'];
        $n_document = $row['numero_documento'];
        $address = $row['direccion'];
        $origen = $row['origen'];

        $client_segment = client_segment::where('name', 'like', '%' . trim($row['tipo_de_cliente']) . '%')->first();
        $sucursale = Sucursale::where('name', 'like', '%' . trim($row['sucursal']) . '%')->first();
        $asesor = User::where('email', trim($row['asesor']))->first();

        Log::info($asesor ? "Asesor encontrado: {$asesor->name} ({$asesor->email})" : "Asesor no encontrado: {$row['asesor']}");

        // FUNCIÓN DE NORMALIZACIÓN CON Str::transliterate
        $normalizeString = function ($str)
        {
            if (empty($str)) return '';

            // Convertir a mayúsculas y transliterar (elimina tildes y caracteres especiales)
            $str = Str::transliterate(Str::upper($str));

            // Eliminar espacios múltiples y trim
            $str = preg_replace('/\s+/', ' ', trim($str));

            return $str;
        };

        // Cargar los JSON
        $REGIONES = File::json(base_path('public/JSON/regiones.json'));
        $PROVINCIAS = File::json(base_path('public/JSON/provincias.json'));
        $DISTRITOS = File::json(base_path('public/JSON/distritos.json'));

        $REGION_SELECTED = null;
        $PROVINCIA_SELECTED = null;
        $DISTRITO_SELECTED = null;

        // 1. BUSCAR REGIÓN - Con búsqueda exacta y parcial
        $regionNormalized = $normalizeString(trim($row['region']));

        // Búsqueda exacta primero
        foreach ($REGIONES as $REGION)
        {
            if ($normalizeString($REGION['name']) === $regionNormalized)
            {
                $REGION_SELECTED = $REGION;
                break;
            }
        }

        // Si no se encuentra, búsqueda parcial
        if (!$REGION_SELECTED)
        {
            foreach ($REGIONES as $REGION)
            {
                $regName = $normalizeString($REGION['name']);
                if (str_contains($regName, $regionNormalized) ||
                    str_contains($regionNormalized, $regName))
                {
                    $REGION_SELECTED = $REGION;
                    break;
                }
            }
        }

        // 2. BUSCAR PROVINCIA - Mejorada con múltiples estrategias
        $provinciaNormalized = $normalizeString(trim($row['provincia']));

        if ($REGION_SELECTED)
        {
            // Estrategia 1: Coincidencia exacta con la región
            foreach ($PROVINCIAS as $PROVINCIA)
            {
                if ($PROVINCIA['department_id'] == $REGION_SELECTED['id'])
                {
                    if ($normalizeString($PROVINCIA['name']) === $provinciaNormalized)
                    {
                        $PROVINCIA_SELECTED = $PROVINCIA;
                        break;
                    }
                }
            }

            // Estrategia 2: Coincidencia parcial (para casos como "JUNIN" vs "Junín")
            if (!$PROVINCIA_SELECTED)
            {
                foreach ($PROVINCIAS as $PROVINCIA)
                {
                    if ($PROVINCIA['department_id'] == $REGION_SELECTED['id'])
                    {
                        $provName = $normalizeString($PROVINCIA['name']);
                        if (str_contains($provName, $provinciaNormalized) ||
                            str_contains($provinciaNormalized, $provName))
                        {
                            $PROVINCIA_SELECTED = $PROVINCIA;
                            break;
                        }
                    }
                }
            }

            // Estrategia 3: Si la provincia es igual al nombre de la región (caso especial)
            // Ejemplo: Región "JUNIN", Provincia "JUNIN"
            if (!$PROVINCIA_SELECTED)
            {
                foreach ($PROVINCIAS as $PROVINCIA)
                {
                    if ($PROVINCIA['department_id'] == $REGION_SELECTED['id'])
                    {
                        $provName = $normalizeString($PROVINCIA['name']);
                        $regName = $normalizeString($REGION_SELECTED['name']);
                        // Si la provincia se llama igual que la región (caso PASCO, JUNIN, etc.)
                        if ($provName === $regName) {
                            $PROVINCIA_SELECTED = $PROVINCIA;
                            break;
                        }
                    }
                }
            }
        }

        // 3. BUSCAR DISTRITO - Usando la provincia encontrada
        $distritoNormalized = $normalizeString(trim($row['distrito']));

        if ($REGION_SELECTED && $PROVINCIA_SELECTED)
        {
            // Búsqueda exacta
            foreach ($DISTRITOS as $DISTRITO)
            {
                if ($DISTRITO['department_id'] == $REGION_SELECTED['id'] &&
                    $DISTRITO['province_id'] == $PROVINCIA_SELECTED['id'])
                {
                    if ($normalizeString($DISTRITO['name']) === $distritoNormalized)
                    {
                        $DISTRITO_SELECTED = $DISTRITO;
                        break;
                    }
                }
            }

            // Búsqueda parcial
            if (!$DISTRITO_SELECTED)
            {
                foreach ($DISTRITOS as $DISTRITO)
                {
                    if ($DISTRITO['department_id'] == $REGION_SELECTED['id'] &&
                        $DISTRITO['province_id'] == $PROVINCIA_SELECTED['id'])
                    {
                        $distName = $normalizeString($DISTRITO['name']);
                        if (str_contains($distName, $distritoNormalized) ||
                            str_contains($distritoNormalized, $distName))
                        {
                            $DISTRITO_SELECTED = $DISTRITO;
                            break;
                        }
                    }
                }
            }
        }

        // Log para debugging con los valores normalizados
        /* Log::info('Ubigeo encontrado:', [
            'region_buscada' => $row['region'],
            'region_normalizada' => $regionNormalized,
            'region_encontrada' => $REGION_SELECTED ? $REGION_SELECTED['name'] : 'No encontrada',
            'provincia_buscada' => $row['provincia'],
            'provincia_normalizada' => $provinciaNormalized,
            'provincia_encontrada' => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED['name'] : 'No encontrada',
            'distrito_buscado' => $row['distrito'],
            'distrito_normalizado' => $distritoNormalized,
            'distrito_encontrado' => $DISTRITO_SELECTED ? $DISTRITO_SELECTED['name'] : 'No encontrado'
        ]); */

        $client = new Client([
            'name' => $name,
            'surname' => $surname,
            'full_name' => $full_name,
            'client_segment_id' => $client_segment ? $client_segment->id : 1,
            'origen' => $origen,
            'state' => 1,
            'phone' => $phone,
            'email' => $email,
            'type' => $row['nombre'] || $row['apellido'] ? 1 : 2,
            'type_document' => $type_document,
            'n_document' => $n_document,
            'address' => $address,
            'sucursale_id' => $sucursale ? $sucursale->id : 1,
            'asesor_id' => $asesor ? $asesor->id : null,
            'ubigeo_region' => $REGION_SELECTED ? $REGION_SELECTED['id'] : null,
            'ubigeo_provincia' => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED['id'] : null,
            'ubigeo_distrito' => $DISTRITO_SELECTED ? $DISTRITO_SELECTED['id'] : null,
            'region' => $row['region'] ?? null,
            'provincia' => $row['provincia'] ?? null,
            'distrito' => $row['distrito'] ?? null
        ]);

        if ($client->save())
        {
            $this->importedCount++;
        }

        return $client;
    }

    public function rules(): array
    {
        return [
            'telefono' => 'required',
            'tipo_de_cliente' => 'required',
            'origen' => 'required',
            'tipo_documento' => 'required',
            'numero_documento' => 'required',
            'region' => 'required',
            'provincia' => 'required',
            'distrito' => 'required',
            'direccion' => 'required',
            'sucursal' => 'required'
        ];
    }

    public function customValidationMessages()
    {
        return [
            '*.telefono.required' => 'El teléfono es requerido',
            '*.tipo_de_cliente.required' => 'El tipo de cliente es requerido',
            '*.origen.required' => 'El origen es requerido',
            '*.tipo_documento.required' => 'El tipo de documento es requerido',
            '*.numero_documento.required' => 'El número de documento es requerido',
            '*.region.required' => 'La región es requerida',
            '*.provincia.required' => 'La provincia es requerida',
            '*.distrito.required' => 'El distrito es requerido',
            '*.sucursal.required' => 'La sucursal es requerida',
            '*.direccion.required' => 'La dirección es requerida',
        ];
    }

    // Manejador de errores de validación
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->importErrors[] = "Fila {$failure->row()}: " . implode(', ', $failure->errors());
        }
    }

    // Manejador de errores generales
    public function onError(Throwable $e)
    {
        Log::error('Error en importación: ' . $e->getMessage());
        $this->importErrors[] = 'Error general: ' . $e->getMessage();
    }

    public function getImportErrors()
    {
        return $this->importErrors;
    }

    public function getImportedCount()
    {
        return $this->importedCount;
    }
    public function isEmpty(array $row): bool
    {
        // Verificar si todas las columnas principales están vacías
        $isEmpty = empty($row['nombre']) &&
            empty($row['apellido']) &&
            empty($row['razon_social']) &&
            empty($row['telefono']) &&
            empty($row['numero_documento']) &&
            empty($row['tipo_documento']) &&
            empty($row['direccion']) &&
            empty($row['region']) &&
            empty($row['provincia']) &&
            empty($row['distrito']) &&
            empty($row['tipo_de_cliente']) &&
            empty($row['origen']) &&
            empty($row['sucursal']) &&
            empty($row['correo']) &&
            empty($row['asesor']);

        return $isEmpty;
    }
}
