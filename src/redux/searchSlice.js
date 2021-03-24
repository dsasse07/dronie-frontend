import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    filter: "users",
    query: "",
    results: []
  },
  reducers: {
    setFilter(state, action){
      return state.filter = action.payload 
    },
    setQuery(state, action){
      state.query = action.payload
    },
    setResults(state, action){
      state.results.push( ...action.payload )
    },
    clearResults( state, action ){
      return state.results = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { setFilter, setQuery, setResults, clearResults } = searchSlice.actions

export default searchSlice.reducer