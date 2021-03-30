import { createSlice } from '@reduxjs/toolkit'

export const chatWithSlice = createSlice({
  name: 'chatWith',
  initialState: null,
  reducers: {
    setChatWith( state, action ){
      return state = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setChatWith } = chatWithSlice.actions

export default chatWithSlice.reducer