import { createSlice } from '@reduxjs/toolkit'
import avatarPlaceHolder from '../assets/avatar.jpg'


export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    posts: []
  },
  reducers: {
    setProfileUser(state, action){
      const avatar = action.payload.avatar ? JSON.parse(action.payload.avatar)[0] : {secure_url: avatarPlaceHolder}
      const user = {...action.payload, avatar: avatar }
      state.user = user
    },
    setProfilePosts(state, action){
      const posts = action.payload.map( post => {
        return {
          ...post, 
          images: JSON.parse(post.images), 
          user: {
            ...post.user,
            avatar: JSON.parse(post.user.avatar)
          }}
      })
      state.posts.push(...posts)
    },
    updateProfilePosts(state, action){
      console.log(`action`, action)
      const newPost = {
        ...action.payload, 
        images: JSON.parse(action.payload.images) 
      }
      state.posts.unshift(newPost)
    },
    resetProfile( state, action ){
      return state = {
        user: null,
        posts: []
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setProfileUser, setProfilePosts, updateProfilePosts, resetProfile } = profileSlice.actions

export default profileSlice.reducer