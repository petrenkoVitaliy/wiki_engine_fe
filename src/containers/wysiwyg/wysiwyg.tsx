'use client';

import { Editable, Slate, RenderLeafProps, RenderElementProps } from 'slate-react';
import { useMemo, useCallback, useState, KeyboardEvent, useContext, useEffect } from 'react';
import { Descendant } from 'slate';

import { updateHeadings } from '@/redux/slices/editor.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { Toolbar } from './components/toolbar/toolbar';
import { Leaf } from './components/leaf/leaf';
import { Element } from './components/element/element';

import { BlockButtons, MarkButtons, VerboseBlockButtons } from './elements';

import { EditorHandler } from './handlers/editor-handler/editor.handler';

import {
  ActiveElementsMap,
  // CustomElement,
  ElementFormat,
  MarkFormat,
  VerboseBlockOptions,
} from './types';

import styles from './wysiwyg.module.scss';
import { ArticleContext } from '@/context/article-context';

// const initialValue: CustomElement[] = [
//   {
//     type: 'paragraph',
//     children: [{ text: '' }],
//   },
// ]; TODO

type WysiwygProps = {
  editorHandler: EditorHandler;
};

export function Wysiwyg(props: WysiwygProps) {
  const articleContext = useContext(ArticleContext);
  if (!articleContext) return null;

  const dispatch = useAppDispatch();
  const isEditMode = useAppSelector((state) => state.editorReducer.isEditMode);

  const editorHandler = useMemo(() => props.editorHandler || new EditorHandler(), [props]);

  const initialValue = useMemo(
    () => JSON.parse(articleContext.article.language.version.content.content),
    [articleContext]
  );

  useEffect(() => {
    updateHeading(initialValue);
  }, [initialValue]);

  const [activeElements, setActiveElements] = useState<ActiveElementsMap>({
    activeMarks: null,
    activeBlocks: {},
  });

  const updateHeading = (values: Descendant[]) => {
    const headings = editorHandler.getUpdatedHeadings(values);

    if (headings) {
      dispatch(updateHeadings(headings));
    }
  };

  const handleChange = (values: Descendant[]) => {
    setActiveElements(editorHandler.getActiveElements());

    const isChanged = editorHandler.hasChanged(values);
    if (isChanged) {
      updateHeading(values);
    }
  };

  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  const toggleMark = useCallback(
    (format: MarkFormat) => editorHandler.markHandler.toggleMark(format),
    []
  );

  const toggleBlock = useCallback(
    (format: ElementFormat) => editorHandler.blochHandler.toggleBlock(format),
    []
  );

  const toggleVerboseBlock = useCallback(
    (format: ElementFormat, options: VerboseBlockOptions) =>
      editorHandler.blochHandler.toggleVerboseBlock(format, options),
    []
  );

  const handleHotKey = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => editorHandler.handleHotKey(event),
    []
  );

  return (
    <div className={styles.wysiwygWrapper}>
      {isEditMode && (
        <Toolbar
          toggleMark={toggleMark}
          toggleBlock={toggleBlock}
          toggleVerboseBlock={toggleVerboseBlock}
          markButtons={MarkButtons}
          blockButtons={BlockButtons}
          verboseBlockButtons={VerboseBlockButtons}
          activeElements={activeElements}
        />
      )}

      <Slate editor={editorHandler.editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          className={styles.editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleHotKey}
          readOnly={!isEditMode}
          placeholder='Start typing here...'
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
}
