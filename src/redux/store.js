import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './userSlice'
import postsReducer from './postsSlice'
import profileReducer from './profileSlice'

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    posts: postsReducer,
    profile: profileReducer
  }
})

