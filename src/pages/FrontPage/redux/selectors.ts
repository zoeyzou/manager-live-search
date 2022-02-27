import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../../store'

export const getSearchValue = (state: RootState) =>
  state.frontPage.view.searchValue ?? state.frontPage.view.selectedUser?.name

export const getIsFetchingUsers = (state: RootState) =>
  state.frontPage.data.loading === 'pending'

const getUsers = (state: RootState) => state.frontPage.data.entities

export const getFilteredManagers = createSelector(
  getSearchValue,
  getUsers,
  (searchValue, userMap) =>
    Object.values(userMap).filter(
      (user) =>
        user?.jobLevel?.toLowerCase().includes('manager') &&
        (user.firstName + user.lastName)
          .toLowerCase()
          .includes(searchValue.split(' ').join('').toLowerCase())
    )
)
