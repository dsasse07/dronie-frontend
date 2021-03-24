import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './userSlice'
import postsReducer from './postsSlice'
import profileReducer from './profileSlice'
import tagsReducer from './tagsSlice'
import postFormReducer from './postFormSlice'
import searchReducer from './searchSlice'

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    posts: postsReducer,
    profile: profileReducer,
    tags: tagsReducer,
    postForm: postFormReducer,
    search: searchReducer
  }
})

