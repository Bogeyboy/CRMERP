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
        Schema::create('product_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->comment('ID del producto');
            $table->unsignedBigInteger('unit_id')->comment('ID de la unidad de medida del producto');
            $table->unsignedBigInteger('client_segment_id')->nullable()->comment('ID del segmento de cliente al que pertenece el producto');
            $table->unsignedBigInteger('sucursal_id')->nullable()->comment('ID de la sucursal a la que pertenece el producto');
            $table->double('price')->comment('Precio del producto en la sucursal');
            $table->timestamps();
            $table->string('deleted_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_wallets');
    }
};
