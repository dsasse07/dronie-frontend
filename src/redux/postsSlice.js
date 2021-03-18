import { createSlice } from '@reduxjs/toolkit'
import {testPosts} from '../data'

export const postsSlice = createSlice({
  name: 'posts',
  initialState: [
    ...testPosts
  ],
  reducers: {
    updatePost(state, action){
      const index = state.findIndex( post => post.id === action.payload.id)
      state[index] = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { updatePost } = postsSlice.actions

export default postsSlice.reducer