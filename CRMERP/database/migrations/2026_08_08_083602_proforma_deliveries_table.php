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
            $table->unsignedBigInteger('sucursal_deliverie_id')->comment('ID de la sucursal de entrega para la proforma');
            $table->timestamp('date_envio')->nullable()->comment('Fecha de envío de la proforma');
            $table->timestamp('date_entrega')->nullable()->comment('Fecha de entrega de la proforma');
            $table->string('address')->nullable();
            $table->string('ubigeo_region', 100)->default(null);
            $table->string('ubigeo_provincia', 100)->default(null);
            $table->string('ubigeo_distrito', 100)->default(null);
            $table->string('region', 100)->default(null);
            $table->string('provincia', 100)->default(null);
            $table->string('distrito', 100)->default(null);
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proforma_payments');
    }
};
