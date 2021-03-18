import { createSlice } from '@reduxjs/toolkit'
import {testUser} from '../data'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...testUser
  },
  reducers: {}
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = userSlice.actions

export default userSlice.reducer