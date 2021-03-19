import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './userSlice'
import postsReducer from './postsSlice'

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    posts: postsReducer
  }
})

