<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Web Development Team',
                'members' => json_encode([]),
                'projects' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mobile Development Team',
                'members' => json_encode([]),
                'projects' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Database Team',
                'members' => json_encode([]),
                'projects' => json_encode([]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('teams')->insert($teams);
    }
} 