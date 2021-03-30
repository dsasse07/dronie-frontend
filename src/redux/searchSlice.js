import { createSlice } from '@reduxjs/toolkit'
import avatarPlaceHolder from '../assets/avatar.jpg'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    filter: "users",
    query: "",
    results: {
      users: [],
      description: [],
      tags: [],
      location: []
    }
  },
  reducers: {
    setFilter(state, action){
      state.filter = action.payload 
    },
    setQuery(state, action){
      state.query = action.payload
    },
    setPostResults(state, action){
      const posts = action.payload.map( post => {
        return {
          ...post, 
          images: JSON.parse(post.images), 
          user: {
            ...post.user,
            avatar: JSON.parse(post.user.avatar)
          }}
      })
      state.results[state.filter].push( ...posts )
    },
    setUserResults( state, action){
      const users = action.payload.map( user => {
        const avatar = user.avatar ? JSON.parse(user.avatar)[0] : {secure_url: avatarPlaceHolder}
        return {...user, avatar: avatar }
      })
      state.results.users.push( ...users )
    },
    clearResults( state, action ){
      state.results = {
        users: [],
        description: [],
        tags: [],
        location: []
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setFilter, setQuery, setUserResults, setPostResults, clearResults } = searchSlice.actions

export default searchSlice.reducer