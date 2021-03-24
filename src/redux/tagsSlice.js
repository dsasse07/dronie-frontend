import { createSlice } from '@reduxjs/toolkit'

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: [],
  reducers: {
    setTags(state, action){
      return state = action.payload 
    },
    addTag(state, action){
      state.push( action.payload )
    },
    clearTags( state, action ){
      return state = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTags, addTag, clearTags } = tagsSlice.actions

export default tagsSlice.reducer