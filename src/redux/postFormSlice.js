
import { createSlice } from '@reduxjs/toolkit'

export const postFormSlice = createSlice({
  name: 'postForm',
  initialState: {
    tags: []
  },
  reducers: {
    addPostTag( state, action ){
      state.tags.push( action.payload )
    },
    removePostTag( state, action ){
      state.tags = state.tags.filter( tag => {
        return tag !== action.payload
      })
    },
    clearPostTags( state, action ) {
      state.tags = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { addPostTag, removePostTag, clearPostTags } = postFormSlice.actions

export default postFormSlice.reducer