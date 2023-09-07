import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { apiHandler } from '@/api/api-handler/api.handler';
import { ApiMapper } from '@/mappers/api.mapper';
import { Article, ArticleType } from '@/api/types/article.types';
import { createHandledAsyncThunk } from '../thunk';

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

const sliceName = 'editor';

const createArticleLanguage = createHandledAsyncThunk(
  `${sliceName}/createArticleLanguage`,
  async (params: {
    id: number;
    content: string;
    language: string;
    name: string;
    storedArticle: Article;
    callback: (article: Article | null, language: string) => void;
  }) => {
    const { content, name, language, callback, id, storedArticle } = params;
    const articleLanguageResponse = await apiHandler.createArticleLanguage(id, language, {
      content,
      name,
    });

    let article: Article | null = null;

    if (articleLanguageResponse.status === 'ok') {
      article = ApiMapper.addLanguageToArticle(storedArticle, articleLanguageResponse.result);
    }

    callback(article, language);

    return article;
  }
);

const createArticle = createHandledAsyncThunk(
  `${sliceName}/createArticle`,
  async (params: {
    content: string;
    language: string;
    name: string;
    callback: (article: Article | null, language: string) => void;
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

    callback(article, language);

    return article;
  }
);

const editArticle = createHandledAsyncThunk(
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
    const articleVersionResponse = await apiHandler.createArticleVersion(id, language, {
      content,
    });

    let article: Article | null = null;

    if (articleVersionResponse.status === 'ok') {
      const updatedLanguagesMap = { ...storedArticle.languagesMap };

      const updatedArticleLanguages = storedArticle.languages.map((articleLanguage) => {
        if (articleLanguage.language.code !== language) {
          return articleLanguage;
        }

        updatedLanguagesMap[language] = {
          ...updatedLanguagesMap[language],
          version: articleVersionResponse.result,
        };

        return {
          ...articleLanguage,
          version: articleVersionResponse.result,
        };
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
    builder.addCase(createArticleLanguage.fulfilled, (state, action) => {
      state.article = action.payload;
    });
  },
});

export { editArticle, createArticle, createArticleLanguage };
export const { updateHeadings, toggleEditMode, setEditMode } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
