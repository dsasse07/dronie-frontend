import { createSlice } from '@reduxjs/toolkit'
import {testUser} from '../data'
import avatarPlaceHolder from '../assets/avatar.jpg'


export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: null,
  reducers: {
    setCurrentUser(state, action){
      const avatar = action.payload.avatar ? JSON.parse(action.payload.avatar)[0] : {secure_url: avatarPlaceHolder}
      const user = {...action.payload, avatar: avatar }
      return state = user
    },
    updateUsersPosts(state, action){
      const newPost = {
        ...action.payload, 
        images: JSON.parse(action.payload.images) 
      }
      if (state?.posts){
        state.posts = [...state.posts, newPost]
      } else {
        state.posts = [newPost]
      }
    },
    addCommentToUser(state, action){
      state.comments.push( action.payload )
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCurrentUser, updateUsersPosts, addCommentToUser } = currentUserSlice.actions

export default currentUserSlice.reducer