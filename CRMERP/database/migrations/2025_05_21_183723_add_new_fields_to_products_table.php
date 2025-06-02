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
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('is_discount')->unsigned()->default(1)
                ->after('specifications')
                ->comment('1=NO Descuento, 2=Si Descuento');
            $table->tinyInteger('tax_selected')
                ->unsigned()
                ->default(null)
                ->after('is_gift')
                ->comment('0=Libre de impuestos, 1=Bienes Gravables, 2=Producto descargable');
            $table->double('importe_iva')->nullable()->after('tax_selected');
            $table->double('weight')->nullable()->after('provider_id');
            $table->double('width')->nullable()->after('weight');
            $table->double('height')->nullable()->after('width');
            $table->double('length')->nullable()->after('height');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_discount');
            $table->dropColumn('tax_selected');
            $table->dropColumn('importe_iva');
            $table->dropColumn('weight');
            $table->dropColumn('width');
            $table->dropColumn('height');
            $table->dropColumn('length');
        });
    }
};
