'use client';

import { Editable, Slate, RenderLeafProps, RenderElementProps } from 'slate-react';
import { useMemo, useCallback, useState, KeyboardEvent } from 'react';
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
  CustomElement,
  ElementFormat,
  MarkFormat,
  VerboseBlockOptions,
} from './types';

import styles from './wysiwyg.module.scss';

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function Wysiwyg() {
  const dispatch = useAppDispatch();
  const isReadOnly = useAppSelector((state) => state.editorReducer.isReadOnly);

  const [activeElements, setActiveElements] = useState<ActiveElementsMap>({
    activeMarks: null,
    activeBlocks: {},
  });

  const editorHandler = useMemo(() => new EditorHandler(initialValue), []);

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

  const handleChange = (values: Descendant[]) => {
    const isChanged = editorHandler.hasChanged(values);

    setActiveElements(editorHandler.getActiveElements());

    if (isChanged) {
      const headings = editorHandler.getUpdatedHeadings(values);

      if (headings) {
        dispatch(updateHeadings(headings));
      }
    }
  };

  return (
    <div className={styles.wysiwygWrapper}>
      {!isReadOnly && (
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
          readOnly={isReadOnly}
          placeholder='Start typing here...'
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
}
