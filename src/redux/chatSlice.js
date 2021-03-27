
import { createSlice } from '@reduxjs/toolkit'



export const chatSlice = createSlice({
  name: 'chat',
  initialState: {},
  reducers: {
    setChat( state, action ){

      // function getOtherParticipant(existingChat){
      //   return existingChat.participants.filter( participant => {
      //     return participant.username === action.payload.params.username
      //   })[0]
      // }

      // const messages = action.payload.chat?.messages
      // const otherUser = action.payload.chat ? getOtherParticipant(action.payload.chat) : {username: action.payload.params.username}
      // const theirUnreadMessages = messages?.filter( message => {
      //   return (message.user_id !== action.payload.currentUser.id && message.read === false)
      // })
      
      // return state = {messages, otherUser, theirUnreadMessages} 
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