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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('surname')->nullable();
            $table->string('full_name')->nullable();
            $table->unsignedTinyInteger('client_segment_id'); // ← Corregido
            $table->unsignedTinyInteger('state')->default(1)->comment('0=No Activo, 1=Activo'); // ← Corregido
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->unsignedTinyInteger('type')->default(1)->comment('1=Particular, 2=Empresa'); // ← Corregido
            $table->string('type_document', 50)->nullable();
            $table->string('n_document', 50);
            $table->timestamp('birthdate')->nullable()->comment('Fecha de nacimiento del cliente'); // ← Añadido nullable()
            $table->string('address')->nullable();
            $table->unsignedBigInteger('sucursale_id')->nullable(); // ← Corregido
            $table->unsignedBigInteger('asesor_id')->nullable(); // ← Corregido
            $table->unsignedTinyInteger('is_parcial')->comment('1=Parcial, 2=No Parcial'); // ← Corregido
            // ¡OJO! Tenías 'address' duplicado, eliminé la línea repetida
            $table->string('ubigeo_region', 40)->nullable();
            $table->string('ubigeo_provincia', 40)->nullable();
            $table->string('ubigeo_distrito', 40)->nullable();
            $table->string('region', 80)->nullable();
            $table->string('provincia', 80)->nullable();
            $table->string('distrito', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
