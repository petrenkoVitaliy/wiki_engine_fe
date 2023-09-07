'use client';

import { Editable, Slate, RenderLeafProps, RenderElementProps } from 'slate-react';
import { useMemo, useCallback, useEffect } from 'react';

import { Leaf } from './components/leaf/leaf';
import { Element } from './components/element/element';

import { EditorHandler } from './handlers/editor-handler/editor.handler';

import { ArticleVersionDto } from '@/api/dto/article.dto';

import { CustomElement } from './types';

import styles from './wysiwyg.module.scss';

type WysiwygProps = {
  articleVersion: ArticleVersionDto;
};

const defaultValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function WysiwygViewer(props: WysiwygProps) {
  const editorHandler = useMemo(() => new EditorHandler(), []);

  useEffect(() => {
    const newChildren = JSON.parse(props.articleVersion.content.content) as CustomElement[];

    editorHandler.blochHandler.updateChildren(newChildren);
  }, [props.articleVersion]);

  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  return (
    <div className={styles.wysiwygWrapper}>
      <Slate editor={editorHandler.editor} initialValue={defaultValue}>
        <Editable
          className={styles.editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
          placeholder=''
          spellCheck
        />
      </Slate>
    </div>
  );
}
