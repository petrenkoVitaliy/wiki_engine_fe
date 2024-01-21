import { CSSProperties, useMemo } from 'react';
import {
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from 'slate-react';
import clsx from 'clsx';

import { ControlButton } from '@/components/control-button/control-button';

import { ICONS } from '@/icons';
import { VerboseBlockService } from '@/services/verbose-block/verbose-block.service';

import { TwitterBlockElement } from '../../../types';

import { TweetItem } from './tweet-item';

import styles from './tweet-element.module.scss';

type TweetElementProps = { style: CSSProperties } & Omit<RenderElementProps, 'element'> & {
    element: TwitterBlockElement;
  };

export function TweetElement({ style, attributes, children, element }: TweetElementProps) {
  const editor = useSlateStatic() as ReactEditor;
  const selected = useSelected();
  const focused = useFocused();

  const threadDetails = useMemo(() => {
    return {
      isThread: !!element.parentId,
      parentsAmount: element.parentTweets.length || 0,
    };
  }, [element]);

  const handleRemoveTweet = () => {
    VerboseBlockService.blockHandler['tweet'].removeNode(editor, element);
  };

  const toggleThread = () => {
    if (!threadDetails.isThread) {
      return;
    }

    if (threadDetails.parentsAmount) {
      VerboseBlockService.blockHandler['tweet'].removeThreadTweets(editor, element);
    } else {
      VerboseBlockService.blockHandler['tweet'].uploadThreadTweets(editor, element);
    }
  };

  return (
    <span
      style={style}
      {...attributes}
      className={clsx({
        [styles.tweetWrapper]: true,
        [styles.selected]: selected && focused,
      })}
    >
      {children}

      {element.parentTweets.map((item, index) => (
        <TweetItem
          topElement={index === 0}
          key={item.tweetId}
          element={element}
          item={item}
          editor={editor}
          tweetIndex={index}
          label={`${index + 1} / ${threadDetails.parentsAmount + 1} `}
          isThread={threadDetails.isThread}
        />
      ))}

      <TweetItem
        element={element}
        item={element}
        editor={editor}
        topElement={!element.parentTweets.length}
        isThread={threadDetails.isThread}
        label={
          threadDetails.parentsAmount
            ? `${threadDetails.parentsAmount + 1} / ${threadDetails.parentsAmount + 1} `
            : undefined
        }
      />

      <span className={styles.controlsWrapper} contentEditable={false}>
        <ControlButton
          icon={ICONS.VERBOSE.deleteIcon}
          label='Delete'
          labeled
          onClick={handleRemoveTweet}
        />
        {threadDetails.isThread && (
          <ControlButton
            icon={threadDetails.parentsAmount ? ICONS.VERBOSE.hideIcon : ICONS.BUTTON.threadIcon}
            label={threadDetails.parentsAmount ? 'Hide thread' : 'Unroll full thread'}
            onClick={toggleThread}
            labeled
          />
        )}
      </span>
    </span>
  );
}
