import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchUsers as fetchUsersApi } from '../api'

import type { User } from '../../../types'

export type DataState = {
  ids: string[]
  entities: Record<string, User>
  loading: 'initial' | 'pending' | 'succeeded' | 'rejected'
}

const initialState: DataState = {
  ids: [],
  entities: {},
  loading: 'initial',
}

export const fetchUsers = createAsyncThunk('data/fetchUsers', async () => {
  const users = await fetchUsersApi()
  return users
})

/* eslint-disable no-param-reassign */
export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = 'rejected'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const byId = (action.payload as User[]).reduce((dictionary, user) => {
          dictionary[user.id] = user
          return dictionary
        }, {} as Record<string, User>)

        state.ids = Object.keys(byId)
        state.entities = byId
        state.loading = 'succeeded'
      })
  },
})
/* eslint-enable no-param-reassign */
export const dataReducer = dataSlice.reducer
