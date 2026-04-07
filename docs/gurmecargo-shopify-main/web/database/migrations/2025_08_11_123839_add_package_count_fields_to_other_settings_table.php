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
            $table->boolean('package_count_enabled')->default(false)->after('barcode_number_format');
            $table->integer('package_count_per_item')->default(1)->after('package_count_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('other_settings', function (Blueprint $table) {
            $table->dropColumn(['package_count_enabled', 'package_count_per_item']);
        });
    }
};
