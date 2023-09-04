import { apiHandler } from '@/api/api-handler/api.handler';
import { apiMapper } from '@/api/api.mapper';
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

const createArticle = createAsyncThunk(
  `${sliceName}/createArticle`,
  async (params: {
    content: string;
    language: string;
    name: string;
    callback: (article: Article | null) => void;
  }) => {
    const { content, name, language, callback } = params;
    const articleResponse = await apiHandler.createArticle({
      content,
      language,
      name,
      article_type: 'Public', // TODO enum & select
    });

    let article: Article | null = null;

    if (articleResponse.status === 'ok') {
      article = apiMapper.mapArticleDtoToType(articleResponse.result, language);
    }

    callback(article);

    return article;
  }
);

const editArticle = createAsyncThunk(
  `${sliceName}/editArticle`,
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
    builder.addCase(editArticle.fulfilled, (state, action) => {
      state.article = action.payload;
    });
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.article = action.payload;
    });
  },
});

export { editArticle, createArticle };
export const { updateHeadings, toggleEditMode, setEditMode } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
