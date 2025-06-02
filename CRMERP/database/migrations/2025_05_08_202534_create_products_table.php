<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->unsignedBigInteger('product_categorie_id');
            $table->string('imagen')->nullable()->default(null);
            $table->string('sku');
            $table->double('price_general');
            $table->longText('description')->nullable()->default(null);
            $table->json('specifications')->nullable()->default(null);
            $table->tinyInteger('is_gift')->unsigned()->default(1)->comment('1=NO Gratuito, 2=Si Gratuito');
            $table->double('min_discount')->nullable()->comment('Descuento mínimo de venta');
            $table->double('max_discount')->nullable()->comment('Descuento máximo de venta');
            $table->double('umbral')->nullable()->comment('Umbral de stock mínimo para notificación');
            $table->unsignedBigInteger('umbral_unit_id')->nullable()->comment('Umbral de stock mínimo para notificación por unidad');
            $table->tinyInteger('disponibilidad')->unsigned()->default(1)->comment('1=Es vender los productos sin stock, 2=Es NO vender los productos sin stock, 3=Proyectar con los contratos que se tenga');
            $table->double('tiempo_de_abastecimiento')->nullable()->comment('Tiempo de abastecimiento en días');
            $table->unsignedBigInteger('provider_id')->nullable()->comment('Proveedor principal del producto');
            $table->timestamps();
            $table->string('deleted_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
