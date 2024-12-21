<?php

namespace Database\Factories;

use App\Models\History;
use Illuminate\Database\Eloquent\Factories\Factory;

class HistoryFactory extends Factory
{
    protected $model = History::class;

    public function definition()
    {
        return [
            'type' => $this->faker->randomElement(['paraphrase']),
            'original_text' => $this->faker->sentence,
            'transformed_text' => $this->faker->sentence,
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
