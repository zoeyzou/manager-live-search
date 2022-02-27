import { useEffect } from 'react'
import { ComboBox } from '../../../../components'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { fetchUsers } from '../../redux/dataSlice'
import { changeSearchValue, changeSelectedUser } from '../../redux/viewSlice'
import {
  getFilteredManagers,
  getIsFetchingUsers,
  getSearchValue,
} from '../../redux/selectors'
import { UserDetail } from './components/UserDetail'

import type { User } from '../../../../types'

export const ManagerSearch = () => {
  const search = useAppSelector(getSearchValue)
  const isLoading = useAppSelector(getIsFetchingUsers)
  const managers = useAppSelector(getFilteredManagers)

  const dispatch = useAppDispatch()

  const searchChangeHandler = (text?: string) =>
    dispatch(changeSearchValue(text ?? ''))

  const onSelectUser = (user: User) => dispatch(changeSelectedUser(user))

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <ComboBox
      displayText={search}
      isLoading={isLoading}
      items={managers}
      onTextChange={searchChangeHandler}
      onSelectItem={onSelectUser}
      renderItem={(user, isHighlighted) => (
        <UserDetail user={user} isHighlighted={isHighlighted} />
      )}
    />
  )
}
