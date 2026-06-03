<?php

namespace App\Imports;

/* use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation; */
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsOnError
{
    use Importable;
    
    private $importedCount = 0;
    private $importErrors = [];
    private $rowNumber = 0;

    public function model(array $row)
    {
        $this->rowNumber++;
        
        try {
            Log::info('Procesando fila ' . $this->rowNumber . ':', $row);
            
            // Validar datos requeridos
            if (empty($row['title']) || empty($row['categorie']) || empty($row['price']) || empty($row['sku'])) {
                $this->importErrors[] = "Fila {$this->rowNumber}: Faltan datos requeridos (title, categorie, price, sku)";
                return null;
            }

            // Buscar categoría
            $categorie = ProductCategorie::where('name', 'like', '%' . trim($row['categorie']) . '%')->first();
            if (!$categorie) {
                $this->importErrors[] = "Fila {$this->rowNumber}: Categoria no encontrada: " . $row['categorie'];
                return null;
            }

            // Buscar unidad de umbral (opcional)
            $umbral_unit = null;
            if (!empty($row['umbral_unit'])) {
                $umbral_unit = Unit::where('name', 'like', '%' . trim($row['umbral_unit']) . '%')->first();
            }

            // Mapear disponibilidad
            $disponibilidad = $this->mapDisponibilidad($row['disponibilidad'] ?? 'Vender los productos sin stock');
            
            // Mapear impuesto
            $tax_selected = $this->mapTaxSelected($row['tax_selected'] ?? 'Libre de impuestos');

            // Convertir SKU a string
            $sku = (string) trim($row['sku']);

            // Verificar si el producto ya existe por SKU
            $existingProduct = Product::where('sku', $sku/* trim($row['sku']) */)->first();
            if ($existingProduct) {
                $this->importErrors[] = "Fila {$this->rowNumber}: Producto con SKU '{$sku}' ya existe";
                return null;
            }

            // Crear producto
            $product = Product::create([
                'title' => trim($row['title']),
                'sku' => $sku/* trim($row['sku']) */,
                'product_categorie_id' => $categorie->id,
                'imagen' => $row['imagen'] ?? null,
                'price_general' => floatval($row['price']),
                'description' => $row['description'] ?? null,
                'is_gift' => isset($row['is_gift']) ? intval($row['is_gift']) : 0,
                'umbral' => $row['umbral'] ?? 0,
                'umbral_unit_id' => $umbral_unit ? $umbral_unit->id : null,
                'disponibilidad' => $disponibilidad,
                'state' => trim($row['state'] ?? 'ACTIVO') == 'ACTIVO' ? 1 : 2,
                'tax_selected' => $tax_selected,
                'importe_iva' => floatval($row['importe_iva'] ?? 0),
                'weight' => $row['peso'] ?? null,
                'width' => $row['ancho'] ?? null,
                'height' => $row['altura'] ?? null,
                'length' => $row['largo'] ?? null,
            ]);

            Log::info('Producto creado: ID ' . $product->id . ' - ' . $product->title);

            // Crear existencia en almacén (opcional)
            if (!empty($row['unidad_warehouse']) && !empty($row['almacen_warehouse'])) {
                $unit = Unit::where('name', 'like', '%' . trim($row['unidad_warehouse']) . '%')->first();
                $warehouse = Warehouse::where('name', 'like', '%' . trim($row['almacen_warehouse']) . '%')->first();

                if ($unit && $warehouse) {
                    ProductWarehouse::create([
                        'product_id' => $product->id,
                        'warehouse_id' => $warehouse->id,
                        'unit_id' => $unit->id,
                        'stock' => floatval($row['stock_warehouse'] ?? 0)
                    ]);
                    Log::info('ProductWarehouse creado para producto ' . $product->id);
                }
            }

            // Crear precio múltiple (opcional)
            if (!empty($row['unidad_price_multitple']) && isset($row['price_multiple'])) {
                $unit = Unit::where('name', 'like', '%' . trim($row['unidad_price_multitple']) . '%')->first();
                $sucursale = null;

                if (!empty($row['sucursal_price_multiple'])) {
                    $sucursale = Sucursale::where('name', 'like', '%' . trim($row['sucursal_price_multiple']) . '%')->first();
                }

                if ($unit) {
                    ProductWallet::create([
                        'product_id' => $product->id,
                        'unit_id' => $unit->id,
                        'sucursal_id' => $sucursale ? $sucursale->id : null,
                        'price' => floatval($row['price_multiple']),
                        'client_segment_id' => null,
                    ]);
                    Log::info('ProductWallet creado para producto ' . $product->id);
                }
            }

            $this->importedCount++;
            return $product;

        } catch (\Exception $e) {
            Log::error('Error en fila ' . $this->rowNumber . ': ' . $e->getMessage());
            $this->importErrors[] = "Fila {$this->rowNumber}: " . $e->getMessage();
            return null;
        }
    }

    private function mapDisponibilidad($value)
    {
        $value = trim($value);
        switch ($value) {
            case 'Vender los productos sin stock':
                return 1;
            case 'No Vender los productos sin stock':
                return 2;
            case 'Proyectar con los contratos que se tenga':
                return 3;
            default:
                return 1;
        }
    }

    private function mapTaxSelected($value)
    {
        $value = trim($value);
        switch ($value) {
            case 'Libre de impuestos':
                return 1;
            case 'Bienes gravables':
                return 2;
            case 'Producto descargable':
                return 3;
            default:
                return 1;
        }
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'categorie' => 'required|string',
            'price' => 'required|numeric',
            'sku' => 'required|max:100',
            'disponibilidad' => 'nullable|string',
            'state' => 'nullable|string',
            'tax_selected' => 'nullable|string',
            'importe_iva' => 'nullable|numeric',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'title.required' => 'El título es requerido',
            'categorie.required' => 'La categoría es requerida',
            'price.required' => 'El precio es requerido',
            'price.numeric' => 'El precio debe ser numérico',
            'sku.required' => 'El SKU es requerido',
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
}
