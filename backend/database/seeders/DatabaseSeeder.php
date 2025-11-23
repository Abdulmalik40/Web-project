<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Itinerary;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("User created/found: {$user->email}");

        // Seed sample itineraries
        $this->call(ItinerarySeeder::class);
    }
}
