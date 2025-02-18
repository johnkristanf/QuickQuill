<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'signout/user', '*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:4000', 'https://quick-quill-alpha.vercel.app/'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

