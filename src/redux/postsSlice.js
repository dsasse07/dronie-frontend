import { createSlice } from '@reduxjs/toolkit'
import {testPosts} from '../data'

export const postsSlice = createSlice({
  name: 'posts',
  initialState: [
    ...testPosts
  ],
  reducers: {}
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = postsSlice.actions

export default postsSlice.reducer