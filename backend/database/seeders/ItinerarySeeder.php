<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Itinerary;
use Illuminate\Database\Seeder;

class ItinerarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        
        if (!$user) {
            $this->command->warn('Test user not found. Please run DatabaseSeeder first.');
            return;
        }

        // Sample itinerary 1: 3 days in Riyadh
        Itinerary::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'خطة 3 أيام في الرياض',
                'main_destination' => 'Riyadh',
            ],
            [
                'start_date' => now()->addDays(7)->format('Y-m-d'),
                'end_date' => now()->addDays(9)->format('Y-m-d'),
                'total_budget' => 1500,
                'plan_details' => json_encode([
                    [
                        'day' => 1,
                        'totalHours' => 6.0,
                        'places' => [
                            [
                                'visit_start' => '09:00',
                                'visit_end' => '10:30',
                                'name' => 'King Khalid Grand Mosque',
                                'region' => 'Riyadh',
                                'category' => 'Mosque',
                                'estimated_duration' => 1.5,
                            ],
                            [
                                'visit_start' => '10:30',
                                'visit_end' => '12:00',
                                'name' => 'Nomas Restaurant',
                                'region' => 'Riyadh',
                                'category' => 'Restaurant',
                                'estimated_duration' => 1.5,
                                'price_level' => 'medium',
                            ],
                            [
                                'visit_start' => '12:00',
                                'visit_end' => '13:30',
                                'name' => 'Prince Sultan bin Fahd Mosque',
                                'region' => 'Riyadh',
                                'category' => 'Mosque',
                                'estimated_duration' => 1.5,
                            ],
                        ],
                    ],
                    [
                        'day' => 2,
                        'totalHours' => 6.0,
                        'places' => [
                            [
                                'visit_start' => '09:00',
                                'visit_end' => '10:30',
                                'name' => 'Al Qhadi Grand Mosque',
                                'region' => 'Riyadh',
                                'category' => 'Mosque',
                                'estimated_duration' => 1.5,
                            ],
                            [
                                'visit_start' => '10:30',
                                'visit_end' => '12:00',
                                'name' => 'ENCORE Restaurant',
                                'region' => 'Riyadh',
                                'category' => 'Restaurant',
                                'estimated_duration' => 1.5,
                                'price_level' => 'economical',
                            ],
                        ],
                    ],
                    [
                        'day' => 3,
                        'totalHours' => 6.0,
                        'places' => [
                            [
                                'visit_start' => '09:00',
                                'visit_end' => '10:30',
                                'name' => 'Al Nasser Grand Mosque',
                                'region' => 'Riyadh',
                                'category' => 'Mosque',
                                'estimated_duration' => 1.5,
                            ],
                            [
                                'visit_start' => '10:30',
                                'visit_end' => '12:00',
                                'name' => 'The Carnivore Restaurant',
                                'region' => 'Riyadh',
                                'category' => 'Restaurant',
                                'estimated_duration' => 1.5,
                                'price_level' => 'medium',
                            ],
                        ],
                    ],
                ]),
            ]
        );

        // Sample itinerary 2: 5 days in Makkah
        Itinerary::firstOrCreate(
            [
                'user_id' => $user->id,
                'title' => 'خطة 5 أيام في مكة المكرمة',
                'main_destination' => 'Makkah',
            ],
            [
                'start_date' => now()->addDays(14)->format('Y-m-d'),
                'end_date' => now()->addDays(18)->format('Y-m-d'),
                'total_budget' => 2500,
                'plan_details' => json_encode([
                    [
                        'day' => 1,
                        'totalHours' => 8.0,
                        'places' => [
                            [
                                'visit_start' => '08:00',
                                'visit_end' => '12:00',
                                'name' => 'Masjid al-Haram',
                                'region' => 'Makkah',
                                'category' => 'Mosque',
                                'estimated_duration' => 4.0,
                            ],
                            [
                                'visit_start' => '12:00',
                                'visit_end' => '13:30',
                                'name' => 'مطعم أبو أسيد',
                                'region' => 'Makkah',
                                'category' => 'Restaurant',
                                'estimated_duration' => 1.5,
                                'price_level' => 'economical',
                            ],
                        ],
                    ],
                    [
                        'day' => 2,
                        'totalHours' => 6.0,
                        'places' => [
                            [
                                'visit_start' => '09:00',
                                'visit_end' => '10:30',
                                'name' => 'Mohammed Almuaiyther Mosque',
                                'region' => 'Makkah',
                                'category' => 'Mosque',
                                'estimated_duration' => 1.5,
                            ],
                        ],
                    ],
                ]),
            ]
        );

        $this->command->info('Sample itineraries seeded successfully!');
        $this->command->info('Total itineraries: ' . Itinerary::count());
    }
}

