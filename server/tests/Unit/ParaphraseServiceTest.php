<?php

use App\Models\History;
use App\Models\User;
use App\Services\ParaphraseService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// RefreshDatabase IS USED FOR CLEARING THE DATABASE(NOT THE REAL DB) BEFORE TESTING
uses(TestCase::class, RefreshDatabase::class);


// ALWAYS INCLUDE THIS IF NAA KAY DB COLUMNS NEED OG USER DATA
beforeEach(function () {
    $this->user = User::factory()->create();

    Auth::shouldReceive('id')->andReturn($this->user->id);
});

it('paraprahase text successfully', function () {

    Session::shouldReceive('get')
            ->once()
            ->with('jwt_token')
            ->andReturn('fake-jwt-token');
    
    Http::fake([
        env('PARAPHRASE_REQUEST_URL') => Http::response([
            'paraphrased_text' => 'This is the paraphrased text.',
        ], 200),
    ]);

    $originalText = 'This is the original text.';
    $paraphraseMode = 'standard';

    $service = new ParaphraseService();

    $response = $service->paraphraseText($originalText, $paraphraseMode);
    
    $this->assertNotEmpty($response);
    $this->assertIsString($response);

});

it('saves history successfully', function () {

    $type = 'paraphrase';
    $originalText = 'This is the original text.';
    $transformedText = 'This is the transformed text.';

    $service = new ParaphraseService();
    $history = $service->saveHistory($type, $originalText, $transformedText);

    expect($history)->toBeInstanceOf(History::class);
    expect($history->type)->toBe($type);
    expect($history->original_text)->toBe($originalText);
    expect($history->transformed_text)->toBe($transformedText);
    expect($history->user_id)->toBe($this->user->id);

    $this->assertDatabaseHas('history', [
        'type' => $type,
        'original_text' => $originalText,
        'transformed_text' => $transformedText,
        'user_id' => $this->user->id,
    ]);

});


it('retrieves history for the authenticated user', function () {
    $currentUserHistory = History::factory()->create([
        'user_id' => $this->user->id,
        'original_text' => 'Original text for current user.',
        'transformed_text' => 'Transformed text for current user.',
    ]);

    $otherUserHistory = History::factory()->create([
        'user_id' => User::factory()->create()->id, 
        'original_text' => 'Original text for another user.',
        'transformed_text' => 'Transformed text for another user.',
    ]);

    $this->assertDatabaseHas('history', ['id' => $otherUserHistory->id]);


    $history = (new ParaphraseService)->getHistory();

    expect($history)->toHaveCount(1);
    expect($history[0]['id'])->toBe($currentUserHistory->id);
    expect($history[0]['original_text'])->toBe($currentUserHistory->original_text);
    expect($history[0]['transformed_text'])->toBe($currentUserHistory->transformed_text);
    expect($currentUserHistory->created_at->toIso8601ZuluString())->toBe(Carbon::parse($history[0]['created_at'])->toIso8601ZuluString());



});