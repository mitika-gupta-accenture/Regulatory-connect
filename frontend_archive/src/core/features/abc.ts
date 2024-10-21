import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: {
    id: number;
    title: string;
    content: string;
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<PostState["posts"]>) => {
      state.posts = action.payload;
      state.loading = false;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addPost: (state, action: PayloadAction<PostState["posts"][0]>) => {
      state.posts.push(action.payload);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
} = postSlice.actions;
export default postSlice.reducer;
