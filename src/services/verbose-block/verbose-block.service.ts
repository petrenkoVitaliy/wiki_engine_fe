import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

import {
  ImageBlockService,
  TweetBlockService,
  VideoBlockService,
  LinkBlockService,
} from './block-service';

export class VerboseBlockService {
  public static blockHandler = {
    tweet: TweetBlockService,
    youtube: VideoBlockService,
    link: LinkBlockService,
    image: ImageBlockService,
  };

  public static insertVerboseUri(editor: BaseEditor & ReactEditor, uri: string): void {
    const tweetId = VerboseBlockService.blockHandler['tweet'].getTweetKeyFromUri(uri);

    if (tweetId) {
      VerboseBlockService.blockHandler['tweet'].insertTweet(editor, tweetId);
      return;
    }

    const youtubeKey = VerboseBlockService.blockHandler['youtube'].getYoutubeVideoKeyFromUri(uri);

    if (youtubeKey) {
      return VerboseBlockService.blockHandler['youtube'].insertVideo(editor, youtubeKey);
    }

    return VerboseBlockService.blockHandler['link'].wrapLink(editor, uri);
  }
}
