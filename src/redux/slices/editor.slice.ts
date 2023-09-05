import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/api/api.mapper';
import { Article, ArticleType } from '@/api/types/article.types';

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

const createArticleLanguage = createAsyncThunk(
  `${sliceName}/createArticleLanguage`,
  async (params: {
    id: number;
    content: string;
    language: string;
    name: string;
    storedArticle: Article;
    callback: (article: Article | null) => void;
  }) => {
    const { content, name, language, callback, id, storedArticle } = params;
    const articleLanguageResponse = await apiHandler.createArticleLanguage(id, language, {
      content,
      name,
    });

    let article: Article | null = null;

    if (articleLanguageResponse.status === 'ok') {
      article = {
        ...storedArticle,
        languages: [...storedArticle.languages, articleLanguageResponse.result],
        languagesMap: {
          ...storedArticle.languagesMap,
          [articleLanguageResponse.result.language.code]: articleLanguageResponse.result, // TODO optimize
        },
      };
    }

    callback(article);

    return article;
  }
);

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
      article_type: ArticleType.Public,
    });

    let article: Article | null = null;

    if (articleResponse.status === 'ok') {
      article = ApiMapper.mapArticleDtoToType(articleResponse.result);
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
      const updatedLanguagesMap = { ...storedArticle.languagesMap };
      const updatedArticleLanguages = storedArticle.languages.map((articleLanguage) => {
        if (articleLanguage.language.code !== language) {
          return articleLanguage;
        }

        articleLanguage.version = articleVersionResponse.result;
        updatedLanguagesMap[language].version = articleVersionResponse.result;

        return articleLanguage;
      });

      article = {
        ...storedArticle,
        languages: updatedArticleLanguages,
        languagesMap: updatedLanguagesMap,
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
    builder.addCase(createArticleLanguage.fulfilled, (state, action) => {
      state.article = action.payload;
    });
  },
});

export { editArticle, createArticle, createArticleLanguage };
export const { updateHeadings, toggleEditMode, setEditMode } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
