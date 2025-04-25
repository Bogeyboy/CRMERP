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
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('comercial_name')->nullable()->default(null);
            $table->string('nif',15)->unique();
            $table->string('email');
            $table->string('phone',20)->nullable()->default(null);
            $table->string('address')->nullable()->default(null);
            $table->boolean('state')->default(1);
            $table->string('imagen')->nullable()->default(null);
            $table->timestamps();
            $table->string('deleted_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
