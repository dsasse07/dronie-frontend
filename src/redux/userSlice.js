import { createSlice } from '@reduxjs/toolkit'
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
    },
    removeCurrentUser( state, action ){
      return state = null
    },
    updateUsersChat( state, action ){
      const index = state.chats.findIndex( chat => chat.id === action.payload.id)
      console.log(`index`, index)
      if (index >= 0) {
        state.chats[index] = action.payload
      } else {
        state.chats.push( action.payload )
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { removeCurrentUser, setCurrentUser, updateUsersPosts, addCommentToUser, updateUsersChat } = currentUserSlice.actions

export default currentUserSlice.reducer