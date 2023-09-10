import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Article } from '@/api/types/article.types';

import {
  editArticle,
  createArticle,
  updateArticleType,
  createArticleLanguage,
} from './editor.thunk';

type EditorState = {
  headings: string[];
  isEditorEditMode: boolean;
  article: Article | null;
};

const initialState: EditorState = {
  headings: [],
  isEditorEditMode: false,
  article: null,
};

export const sliceName = 'editor';

export const editorSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    updateHeadings: (state, action: PayloadAction<string[]>) => {
      state.headings = action.payload;
    },

    toggleEditMode: (state) => {
      state.isEditorEditMode = !state.isEditorEditMode;
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditorEditMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editArticle.fulfilled, (state, action) => {
      state.article = action.payload;
    });
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.article = action.payload;
    });
    builder.addCase(updateArticleType.fulfilled, (state, action) => {
      state.article = action.payload;
    });
    builder.addCase(createArticleLanguage.fulfilled, (state, action) => {
      state.article = action.payload;
    });
  },
});

export const { updateHeadings, toggleEditMode, setEditMode } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
