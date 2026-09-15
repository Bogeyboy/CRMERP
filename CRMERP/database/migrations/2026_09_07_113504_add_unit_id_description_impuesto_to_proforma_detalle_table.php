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
        Schema::table('proforma_detalle', function (Blueprint $table) {
            $table->unsignedBigInteger('unit_id')->after('product_categorie_id')->comment('Id de la unidad introducida');
            $table->longText('description')->after('unit_id')->nullable()->comment('Descripción del detalle de la proforma');
            $table->double('impuesto')->after('discount')->nullable()->comment('Impuesto del detalle de la proforma');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proforma_detalle', function (Blueprint $table) {
            $table->dropColumn('unit_id');
            $table->dropColumn('description');
            $table->dropColumn('impuesto');
        });
    }
};
