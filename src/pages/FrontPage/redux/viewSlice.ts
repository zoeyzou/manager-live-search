import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { User } from '../../../types'

export type ViewState = {
  searchValue: string
  selectedUser: User | null
}

const initialState: ViewState = {
  searchValue: '',
  selectedUser: null,
}

/* eslint-disable no-param-reassign */
export const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    changeSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload
      state.selectedUser = null
    },
    changeSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload
      state.searchValue = ''
    },
  },
})
/* eslint-enable no-param-reassign */

export const { changeSearchValue, changeSelectedUser } = viewSlice.actions

export const viewReducer = viewSlice.reducer
