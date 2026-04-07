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
        Schema::table('other_settings', function (Blueprint $table) {
            $table->boolean('barcode_number')->default(0)->after('barcode_metafield');
            $table->string('barcode_number_format')->nullable()->after('barcode_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('other_settings', function (Blueprint $table) {
            $table->dropColumn('barcode_number');
            $table->dropColumn('barcode_number_format');
        });
    }
};
