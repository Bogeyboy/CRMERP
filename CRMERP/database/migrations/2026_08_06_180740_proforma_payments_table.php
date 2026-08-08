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
        Schema::create('proforma_deliveries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proforma_id')->comment('ID de la proforma a la que pertenece el detalle');
            $table->unsignedBigInteger('method_payment_id')->comment('ID del método de pago para la proforma');
            $table->double('amount')->comment('Monto del pago para el detalle de la proforma');
            $table->timestamp('date_validation')->nullable()->comment('Fecha de validación de la proforma');
            $table->string('n_transaction',150)->default(null)->comment('Número de transacción del pago');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proforma_deliveries');
    }
};
