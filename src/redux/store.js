import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './userSlice'
import postsReducer from './postsSlice'
import profileReducer from './profileSlice'
import tagsReducer from './tagsSlice'
import postFormReducer from './postFormSlice'
import searchReducer from './searchSlice'
import chatWithReducer from './chatWithSlice'

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    posts: postsReducer,
    profile: profileReducer,
    tags: tagsReducer,
    postForm: postFormReducer,
    search: searchReducer,
    chatWith: chatWithReducer,
  }
})

