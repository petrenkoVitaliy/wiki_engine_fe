import { TweetDetailsDto } from '@/api/dto/internal.dto';

import { InternalFetchHandler } from './internal-fetch.handler';

export class InternalApiHandler extends InternalFetchHandler {
  public async getTweetDetails(tweetId: string) {
    const tweetResponse = await this.fetchApi<TweetDetailsDto>(
      `/api/tweet-details?tweetId=${tweetId}`,
      {
        method: 'get',
        cache: 'no-store',
      }
    );

    return tweetResponse;
  }
}
