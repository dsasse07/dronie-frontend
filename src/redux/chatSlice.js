
import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {},
  reducers: {
    setChat( state, action ){
      return state = action.payload 
    },
    addMessage( state, action ){
      state.messages.push( action.payload )
    },
    clearChat( state, action ) {
      state = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { setChat, addMessage, clearChat } = chatSlice.actions

export default chatSlice.reducer