import { ImageBlockService } from './blocks-services/image.service';
import { LinkBlockService } from './blocks-services/link.service';
import { TweetBlockService } from './blocks-services/tweet.service';
import { VideoBlockService } from './blocks-services/video.service';

import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export class VerboseBlockService {
  public static blockHandler = {
    twitter: TweetBlockService,
    youtube: VideoBlockService,
    link: LinkBlockService,
    image: ImageBlockService,
  };

  public static insertVerboseUri(editor: BaseEditor & ReactEditor, uri: string): void {
    const tweetId = VerboseBlockService.blockHandler['twitter'].getTweetKeyFromUri(uri);

    if (tweetId) {
      VerboseBlockService.blockHandler['twitter'].insertTweet(editor, tweetId);
      return;
    }

    const youtubeKey = VerboseBlockService.blockHandler['youtube'].getYoutubeVideoKeyFromUri(uri);

    if (youtubeKey) {
      return VerboseBlockService.blockHandler['youtube'].insertVideo(editor, youtubeKey);
    }

    return VerboseBlockService.blockHandler['link'].wrapLink(editor, uri);
  }
}
