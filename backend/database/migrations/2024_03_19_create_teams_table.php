<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('members')->nullable();
            $table->json('projects')->nullable();
            $table->foreignId('lead_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Create pivot table for team members
        Schema::create('team_member', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('team_member');
        Schema::dropIfExists('teams');
    }
}; 