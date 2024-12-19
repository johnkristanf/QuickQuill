<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;


class History extends Model
{

    use HasFactory, Notifiable;

    protected $table = 'history';

    protected $fillable = [
        'type',
        'original_text',
        'transformed_text',
        'user_id',
    ];
}
