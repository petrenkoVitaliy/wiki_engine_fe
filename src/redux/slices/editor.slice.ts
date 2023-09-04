import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type EditorState = {
  headings: string[];
  isReadOnly: boolean;
};

const initialState: EditorState = {
  headings: [],
  isReadOnly: false,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    updateHeadings: (state, action: PayloadAction<string[]>) => {
      state.headings = action.payload;
    },

    toggleReadOnly: (state) => {
      state.isReadOnly = !state.isReadOnly;
    },
  },
});

export const { updateHeadings, toggleReadOnly } = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
