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
        Schema::create('proforma_detalle', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proforma_id')->comment('ID de la proforma a la que pertenece el detalle');
            $table->unsignedBigInteger('product_id')->comment('ID del producto asociado al detalle de la proforma');
            $table->unsignedBigInteger('product_categorie_id')->comment('ID de la categoría del producto asociado al detalle de la proforma');
            $table->double('quantity')->unsigned()->comment('Cantidad del producto en el detalle de la proforma');
            $table->double('price')->unsigned()->comment('Precio unitario del producto en el detalle de la proforma');
            $table->double('discount')->unsigned()->default(0)->comment('Descuento del detalle de la proforma');
            $table->double('subtotal')->unsigned()->comment('Subtotal del detalle de la proforma');
            $table->double('total')->unsigned()->comment('Total del detalle de la proforma (subtotal * cantidad)');
            $table->double('amount')->comment('Monto del pago para el detalle de la proforma');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proforma_detalle');
    }
};
