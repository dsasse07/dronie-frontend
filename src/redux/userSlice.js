import { createSlice } from '@reduxjs/toolkit'
import {testUser} from '../data'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: null,
  reducers: {
    setCurrentUser(state, action){
      console.log(`action`, action)
      return state = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer