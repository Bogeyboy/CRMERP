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
        Schema::create('proformas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->comment('ID del asesor que creó la proforma');
            $table->unsignedBigInteger('client_id')->comment('ID del cliente al que pertenece la proforma');
            $table->unsignedBigInteger('client_segment_id')->comment('ID del segmento del cliente al que pertenece la proforma');
            $table->double('subtotal')->default(0)->comment('Subtotal de la proforma');
            $table->double('discount')->default(0)->comment('Descuento aplicado a la proforma');
            $table->double('total')->comment('Total de la proforma');
            $table->double('iva')->comment('IVA de la proforma');
            $table->unsignedTinyInteger('state')->default(1)->comment('Estado de la proforma: 1=cotización, 2=contrato');
            $table->unsignedTinyInteger('state_payment')->comment('Estado del pago: 1=pendiente, 2=parcial, 3=completo');
            $table->double('debt')->unsigned()->default(0)->comment('Cantidad pendiente de la proforma');
            $table->double('paid_out')->unsigned()->default(0)->comment('Cantidad pagada de la proforma');
            $table->timestamp('date_validation')->nullable()->comment('Fecha de validación de la proforma');
            $table->timestamp('day_pay_complete')->nullable()->comment('Fecha de pago completo de la proforma');
            $table->string('description')->nullable()->comment('Descripción de la proforma');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proformas');
    }
};
