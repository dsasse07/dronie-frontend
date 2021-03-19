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
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer