import { createSlice } from '@reduxjs/toolkit'
import { images } from 'ionicons/icons'
import {testPosts} from '../data'

export const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    updatePost(state, action){
      const index = state.findIndex( post => post.id === action.payload.id)
      state[index] = {
        ...action.payload,
        images: JSON.parse(action.payload.images), 
          user: {
            ...action.payload.user,
            avatar: JSON.parse(action.payload.user.avatar)
          }
      }
    },
    setPosts(state, action){
      const posts = action.payload.map( post => {
        return {
          ...post, 
          images: JSON.parse(post.images), 
          user: {
            ...post.user,
            avatar: JSON.parse(post.user.avatar)
          }}
      })
      state.push(...posts)
    },
    resetPosts(state, action){
      return state = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { setPosts, updatePost, resetPosts } = postsSlice.actions

export default postsSlice.reducer