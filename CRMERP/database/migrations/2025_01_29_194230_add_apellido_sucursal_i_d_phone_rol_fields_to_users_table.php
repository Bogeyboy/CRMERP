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
        Schema::table('users', function (Blueprint $table) {
            $table->string('surname')->nullable()->after('name');
            $table->string('document',20)->nullable()->after('surname');
            $table->string('type_document',35)->nullable()->after('document');
            $table->string('phone',20)->nullable()->after('email');
            $table->string('address',255)->nullable()->after('phone');
            $table->string('avatar',255)->nullable()->after('address');
            $table->string('gender',20)->nullable()->after('avatar');
            $table->unsignedBigInteger('rol_id')->nullable()->after('phone');
            $table->unsignedBigInteger('sucursal_id')->nullable()->after('rol_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('surname');
            $table->dropColumn('document');
            $table->dropColumn('type_document');
            $table->dropColumn('phone');
            $table->dropColumn('address');
            $table->dropColumn('avatar');
            $table->dropColumn('avatar');
            $table->dropColumn('rol_id');
            $table->dropColumn('sucursal_id');
        });
    }
};
