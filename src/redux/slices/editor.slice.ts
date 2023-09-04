import { apiHandler } from '@/api/api-handler/api.handler';
import { Article } from '@/api/types/article.types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type EditorState = {
  headings: string[];
  isEditMode: boolean;
  article: Article | null;
};

const initialState: EditorState = {
  headings: [],
  isEditMode: false,
  article: null,
};

const sliceName = 'editor';

const saveArticle = createAsyncThunk(
  `${sliceName}/saveArticle`,
  async (
    params: {
      content: string;
      id: number;
      language: string;
      storedArticle: Article;
      callback: (article: Article | null) => void;
    },
    thunkApi
  ) => {
    thunkApi.dispatch(setEditMode(false));

    const { content, id, language, storedArticle, callback } = params;
    const articleVersionResponse = await apiHandler.createArticleVersion(id, language, { content });

    let article: Article | null = null;

    if (articleVersionResponse.status === 'ok') {
      article = {
        ...storedArticle,
        language: {
          ...storedArticle.language,
          version: articleVersionResponse.result,
        },
      };
    }

    callback(article);

    return article;
  }
);

export const editorSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    updateHeadings: (state, action: PayloadAction<string[]>) => {
      state.headings = action.payload;
    },

    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveArticle.fulfilled, (state, action) => {
      state.article = action.payload;
    });
  },
});

export { saveArticle };
export const { updateHeadings, toggleEditMode, setEditMode } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
