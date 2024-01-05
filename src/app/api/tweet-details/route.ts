import { NextResponse, type NextRequest } from 'next/server';

import { getTweetToken } from '@/utils/utils';

const SYNDICATION_URL = 'https://cdn.syndication.twimg.com';

const API_FEATURES = [
  'tfw_timeline_list:',
  'tfw_follower_count_sunset:true',
  'tfw_tweet_edit_backend:on',
  'tfw_refsrc_session:on',
  'tfw_show_business_verified_badge:on',
  'tfw_duplicate_scribes_to_settings:on',
  'tfw_show_blue_verified_badge:on',
  'tfw_legacy_timeline_sunset:true',
  'tfw_show_gov_verified_badge:on',
  'tfw_show_business_affiliate_badge:on',
  'tfw_tweet_edit_frontend:on',
  'tfw_use_profile_image_shape_enabled:on',
  'tfw_fosnr_soft_interventions_enabled:on',
  'tfw_show_birdwatch_pivots_enabled:on',
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tweetId = searchParams.get('tweetId');

  if (!tweetId) {
    return NextResponse.json({});
  }

  const url = new URL(`${SYNDICATION_URL}/tweet-result`);

  url.searchParams.set('id', tweetId);
  url.searchParams.set('token', getTweetToken(tweetId));
  url.searchParams.set('features', API_FEATURES.join(';'));

  const response = await fetch(url);
  const result = await response.json();

  return NextResponse.json(result);
}
