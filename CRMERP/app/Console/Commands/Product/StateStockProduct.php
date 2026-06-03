<?php

namespace App\Console\Commands\Product;

use App\Models\Product\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // <-- Agrega esta línea

class StateStockProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:state-stocks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asignamos al producto 4 estados (1.- Disponible, 2.- Proximo a agotarse, 3.- Agotado)';

    /**
     * Execute the console command.
     */
    /* public function handle()
    {
        $products = Product::where('state', 1)->get();

        foreach ($products as $key => $product)
        {
            if($product->umbral_unit_id)
            {
                $umbral = $product->umbral;//CANTIDAD
                $umbral_unit_id = $product->umbral_unit_id;//UNIDAD
                $stock_total = 0;
                $is_umbral = false;
                //LISTA DE EXISTENCIAS
                foreach ($product->warehouses as $warehouse)
                {
                    //CALCULAR LA SUMA TOTAL DEL STOCK
                    $stock_total+=$warehouse->stock;
                    //COMPARAR LA UNIDAD DEL UMBRAL
                    if($warehouse->unit_id == $umbral_unit_id)
                    {
                        //SABER SI EL UMBRAL ES MENOR O IGUal QUE EL STOCK DISPONIBLE
                        if($warehouse->stock <= $umbral)
                        {
                            //Asignamos estado 2, proximo a agotarse
                            $product->update([
                                'state_stock' => 2,
                            ]);
                            $is_umbral = true;
                        }
                    }
                }
                if($stock_total == 0)
                {
                    //Asignamos estado 3, agotado
                    $product->update([
                        'state_stock' => 3,
                    ]);
                }
                else
                {
                    //Asignamos el estado 1, Disponible
                    if(!$is_umbral)
                    {
                        $product->update([
                            'state_stock' => 1,
                        ]);
                    }
                }
            }

        }
    } */
    /* public function handle()
    {
        $this->info('Iniciando proceso...');

        $products = Product::where('state', 1)->get();
        $contador = 0;

        foreach ($products as $product) {
            if($product->umbral_unit_id) {
                $umbral = $product->umbral;
                $umbral_unit_id = $product->umbral_unit_id;
                $stock_total = 0;
                $is_umbral = false;

                foreach ($product->warehouses as $warehouse) {
                    $stock_total += $warehouse->stock;

                    if($warehouse->unit_id == $umbral_unit_id) {
                        if($warehouse->stock <= $umbral) {
                            $product->update(['state_stock' => 2]);
                            $is_umbral = true;
                            $this->line("Producto {$product->id}: Estado 2 (Próximo a agotarse)");
                        }
                    }
                }

                if($stock_total == 0) {
                    $product->update(['state_stock' => 3]);
                    $this->line("Producto {$product->id}: Estado 3 (Agotado)");
                    $contador++;
                } else {
                    if(!$is_umbral) {
                        $product->update(['state_stock' => 1]);
                        $this->line("Producto {$product->id}: Estado 1 (Disponible)");
                        $contador++;
                    }
                }
            }
        }

        $this->info("Proceso completado. {$contador} productos actualizados.");
    } */
    public function handle()
    {
        $this->info('Iniciando proceso...');

        $products = Product::where('state', 1)->get();
        $stats = [
            'disponible' => 0,
            'proximo_agotarse' => 0,
            'agotado' => 0,
            'sin_cambio' => 0
        ];

        foreach ($products as $product)
        {
            dump([
                'product_id' => $product->id,
                'product_title' => $product->title,
                'relations' => get_class_methods($product),
                'warehouses_exists' => method_exists($product, 'warehouses'),
                'warehouses_count' => $product->warehouses->count(),
                'raw_warehouses' => DB::table('productwarehouses')->where('product_id', $product->id)->get()
            ]);
            // Log para debug
            $this->line("Procesando producto ID: {$product->id} - Título: {$product->title}");

            // Si no tiene umbral configurado, lo saltamos o lo marcamos como disponible
            if(!$product->umbral_unit_id)
            {
                $this->warn("  → Producto {$product->id} no tiene umbral configurado, se omite");
                $stats['sin_cambio']++;
                continue;
            }

            $umbral = (float)$product->umbral; // CANTIDAD
            $umbral_unit_id = $product->umbral_unit_id; // UNIDAD

            $this->line("  → Umbral: {$umbral} (Unit ID: {$umbral_unit_id})");

            $stock_total = 0;
            $stock_en_umbral = 0;
            $found_umbral_unit = false;

            // Verificar si tiene warehouses
            if($product->warehouses->isEmpty())
            {
                $this->warn("  → Producto {$product->id} no tiene warehouses");
                if($product->state_stock != 3)
                {
                    $product->update(['state_stock' => 3]);
                    $this->line("  → Actualizado a AGOTADO (sin warehouses)");
                    $stats['agotado']++;
                }
                else
                {
                    $stats['sin_cambio']++;
                }
                continue;
            }

            // Calcular stock total y verificar umbral
            foreach ($product->warehouses as $warehouse)
            {
                $stock_warehouse = (float)$warehouse->stock;
                $stock_total += $stock_warehouse;

                $this->line("    → Warehouse ID: {$warehouse->id}, Unit ID: {$warehouse->unit_id}, Stock: {$stock_warehouse}");

                // Buscar el warehouse que tenga la misma unidad que el umbral
                if($warehouse->unit_id == $umbral_unit_id)
                {
                    $found_umbral_unit = true;
                    $stock_en_umbral = $stock_warehouse;
                    $this->line("      ✓ Encontrada unidad de umbral, stock en esta unidad: {$stock_warehouse}");
                }
            }

            $this->line("  → Stock total: {$stock_total}");

            // Determinar el nuevo estado
            $new_state = null;
            $reason = "";

            if($stock_total == 0)
            {
                $new_state = 3;
                $reason = "Stock total es 0";
            }
            elseif(!$found_umbral_unit)
            {
                // Si no encuentra la unidad del umbral en ningún warehouse
                $new_state = 1;
                $reason = "No se encontró warehouse con la unidad del umbral";
            }
            elseif($stock_en_umbral <= $umbral && $stock_en_umbral > 0)
            {
                $new_state = 2;
                $reason = "Stock en unidad umbral ({$stock_en_umbral}) es <= umbral ({$umbral})";
            }
            else
            {
                $new_state = 1;
                $reason = "Stock suficiente";
            }

            // Actualizar solo si el estado es diferente
            if($product->state_stock != $new_state)
            {
                $product->update(['state_stock' => $new_state]);
                $this->info("  → {$reason}: Estado {$product->state_stock} → {$new_state}");

                if($new_state == 1) $stats['disponible']++;
                elseif($new_state == 2) $stats['proximo_agotarse']++;
                elseif($new_state == 3) $stats['agotado']++;
            }
            else
            {
                $this->line("  → Sin cambios, estado actual: {$product->state_stock}");
                $stats['sin_cambio']++;
            }

            $this->line("---");
        }

        // Resumen final
        $this->newLine();
        $this->info("========== RESUMEN FINAL ==========");
        $this->info("Total productos procesados: " . ($stats['disponible'] + $stats['proximo_agotarse'] + $stats['agotado'] + $stats['sin_cambio']));
        $this->info("✅ Disponibles (1): {$stats['disponible']}");
        $this->info("⚠️  Próximo a agotarse (2): {$stats['proximo_agotarse']}");
        $this->info("❌ Agotados (3): {$stats['agotado']}");
        $this->info("⏸️  Sin cambios: {$stats['sin_cambio']}");
        $this->info("==================================");

        return Command::SUCCESS;
    }
}
