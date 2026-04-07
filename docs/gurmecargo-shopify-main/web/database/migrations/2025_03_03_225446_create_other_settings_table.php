<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('other_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('fulfillment_update')->default(true);
            $table->boolean('barcode_metafield')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('other_settings');
    }
};
