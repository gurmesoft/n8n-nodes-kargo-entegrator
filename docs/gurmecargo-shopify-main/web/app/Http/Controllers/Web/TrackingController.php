<?php

namespace App\Http\Controllers\Web;

use App\Services\Shopify;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tracking = $user->tracking()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        return Inertia::render('tracking/index', [
            'user_name' => $user->name,
            'tracking_page' => $tracking->tracking_page,
            'page_id' => $tracking->page_id,
            'published_at' => $tracking->published_at,
            'theme_id' => $tracking->theme_id,
            'id' => $tracking->id,
            'appName' => config('app.toml_name'),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $tracking = $user->tracking;

        $result = $this->createTrackingPageInternal();

        if ($result) {
            $tracking->tracking_page = $result['handle'];
            $tracking->published_at = $result['published_at'];
            $tracking->page_id = $result['id'];
            $tracking->theme_id = $result['theme_id'][0]['id'];
            $tracking->save();

            return response()->json([
                'success' => true,
                'tracking_page' => $tracking->tracking_page,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create tracking page.',
            ], 500);
        }
    }

    private function createTrackingPageInternal()
    {
        $api = new Shopify\Api();
        $themeId = $this->createThemeFiles();

        $mutation = Shopify\GraphQL\Query::createPageMutation();

        $pageInput = [
            'page' => [
                'title' => 'Takip Sayfası',
                'handle' => 'tracking-page',
                'templateSuffix' => 'app-kargoentegrator',
            ],
        ];

        $response = $api::graph($mutation, $pageInput);

        $trackingPageHandle = $response['page']['handle'];
        $publishedAt = $response['page']['publishedAt'];
        $id = $response['page']['id'];

        $publishedAt = Carbon::parse($publishedAt);

        return [
            'handle' => $trackingPageHandle,
            'published_at' => $publishedAt,
            'id' => $id,
            'theme_id' => $themeId,
        ];
    }

    private function createThemeFiles()
    {
        $api = new Shopify\Api();

        $mainThemeResponse = $api::graph(Shopify\GraphQL\Query::getThemes());

        if (! $mainThemeResponse[0]['id']) {
            return ['errors' => 'Main theme not found'];
        }

        $mainThemeId = 'gid://shopify/OnlineStoreTheme/' . $mainThemeResponse[0]['id'];

        $body = '{
            "sections": {
                "17325386100d523c79": {
                    "type": "apps",
                    "blocks": {
                        "kargo-entegrator": {
                            "type": "shopify://apps/%s/blocks/track_extension/%s",
                            "settings": {}
                        }
                    },
                    "block_order": [
                        "kargo-entegrator"
                    ],
                    "settings": {
                        "include_margins": true
                    }
                }
            },
            "order": [
                "17325386100d523c79"
            ]
        }';
        $body = sprintf($body, config('app.toml_name'), config('app.track_extension_id'));

        $files = [
            'files' => [[
                'filename' => 'templates/page.app-kargoentegrator.json',
                'body' => [
                    'type' => 'BASE64',
                    'value' => base64_encode($body),
                ],
            ]],
            'themeId' => $mainThemeId,
        ];

        $mutation = Shopify\GraphQL\Query::themeFilesUpsertMutation();

        $api::graph($mutation, $files);

        return $mainThemeResponse;
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $tracking = $user->tracking;
        $api = new Shopify\Api();

        $dbLine = $tracking->findOrFail($id);

        $dbLine->delete();
        $id = 'gid://shopify/Page/' . $tracking->page_id;

        $variable = [
            'id' => $id,
        ];

        $mutation = Shopify\GraphQL\Query::deletePageMutation();

        $api::graph($mutation, $variable);
    }
}
