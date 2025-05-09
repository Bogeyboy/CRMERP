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
        Schema::create('product_warehouses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->comment('ID del producto');
            $table->unsignedBigInteger('unit_id')->comment('ID de la unidad de medida del producto');
            $table->unsignedBigInteger('warehouse_id')->comment('ID del almacén al que pertenece el producto');
            $table->double('stock')->comment('Stock del producto en la sucursal');
            $table->timestamps();
            $table->string('deleted_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_warehouses');
    }
};
