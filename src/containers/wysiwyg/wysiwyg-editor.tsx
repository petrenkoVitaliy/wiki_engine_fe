'use client';

import { Editable, Slate, RenderLeafProps, RenderElementProps } from 'slate-react';
import { useMemo, useCallback, useState, KeyboardEvent, useEffect } from 'react';
import { Descendant } from 'slate';

import { updateHeadings } from '@/redux/stores/editor';
import { useAppDispatch } from '@/redux/hooks';

import { Toolbar } from './components/toolbar/toolbar';
import { Leaf } from './components/leaf/leaf';
import { Element } from './components/element/element';

import { BlockButtons, MarkButtons, VerboseBlockButtons } from './elements';

import { EditorHandler } from './handlers/editor-handler/editor.handler';

import { Article } from '@/api/types/article.types';

import {
  ActiveElementsMap,
  CustomElement,
  ElementFormat,
  MarkFormat,
  VerboseBlockOptions,
} from './types';

import styles from './wysiwyg.module.scss';
import { PromptModal } from '@/components/prompt-modal/prompt-modal';
import { usePromptModalControls } from '@/hooks/prompt-modal-controls.hook';

const defaultValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

type WysiwygProps = {
  editorHandler: EditorHandler;
  article: Article | null;
  language: string | null;
  isEditMode: boolean;
};

export function WysiwygEditor(props: WysiwygProps) {
  const dispatch = useAppDispatch();

  const { promptParams, handleOpenModal, handleCloseModal } = usePromptModalControls<{
    format: string;
  }>();

  const editorHandler = useMemo(() => props.editorHandler || new EditorHandler(), [props]);

  const initialValue = useMemo(() => {
    const { article, language } = props;

    if (!article || !language) {
      // TODO use articleVersion
      return defaultValue;
    }

    return JSON.parse(article.languagesMap[language].version.content.content) as CustomElement[];
  }, [props.article, props.language]);

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
    (format: ElementFormat) => editorHandler.blockHandler.toggleBlock(format),
    []
  );

  const toggleVerboseBlock = useCallback(
    (format: ElementFormat, options: VerboseBlockOptions) =>
      editorHandler.blockHandler.toggleVerboseBlock(format, options),
    []
  );

  const handleHotKey = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => editorHandler.handleHotKey(event),
    []
  );

  const handleUrlSubmit = useCallback((params: { format: string }, url: string | null) => {
    if (url) {
      toggleVerboseBlock(params.format as ElementFormat, { url });
    }

    handleCloseModal();
  }, []);

  return (
    <div className={styles.wysiwygWrapper}>
      <Toolbar
        toggleMark={toggleMark}
        toggleBlock={toggleBlock}
        toggleVerboseBlock={toggleVerboseBlock}
        markButtons={MarkButtons}
        blockButtons={BlockButtons}
        verboseBlockButtons={VerboseBlockButtons}
        activeElements={activeElements}
        isHidden={!props.isEditMode}
        handleOpenVerbosePrompt={handleOpenModal}
      />

      <Slate editor={editorHandler.editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          className={styles.editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleHotKey}
          readOnly={!props.isEditMode}
          placeholder='Start typing here...'
          spellCheck
          autoFocus
        />
      </Slate>

      <PromptModal
        promptParams={promptParams}
        handleClose={handleCloseModal}
        handleSubmit={handleUrlSubmit}
        label='Please specify url:'
        cancelLabel='Cancel'
        submitLabel='Submit'
        placeholder='https://'
      />
    </div>
  );
}
