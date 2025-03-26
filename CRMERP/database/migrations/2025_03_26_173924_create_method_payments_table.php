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
        Schema::create('method_payments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('state')->default(1);
            $table->foreignId('method_payment_id')->nullable()->constrained('method_payments')->nullOnDelete();
            $table->timestamps();
            $table->string('deleted_at')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('method_payments');
    }
};
