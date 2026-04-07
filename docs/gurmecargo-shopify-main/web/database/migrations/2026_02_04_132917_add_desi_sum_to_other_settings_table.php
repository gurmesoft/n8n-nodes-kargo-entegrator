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
            $table->boolean('desi_sum_enabled')->default(false)->after('package_count_per_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('other_settings', function (Blueprint $table) {
            $table->dropColumn('desi_sum_enabled');
        });
    }
};
