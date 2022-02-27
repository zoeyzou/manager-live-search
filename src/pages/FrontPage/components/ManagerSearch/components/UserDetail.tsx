import cn from 'classnames'

import type { FC } from 'react'

import type { User } from '../../../../../types'
import styles from './UserDetail.module.css'

type Props = {
  user: User
  isHighlighted: boolean
}

export const UserDetail: FC<Props> = ({ user, isHighlighted }) => (
  <div className={cn(styles.userDetail, { [styles.highlight]: isHighlighted })}>
    <span>{user.name.split(' ').map((part) => part[0].toUpperCase())}</span>
    <div>
      <p>{user.name}</p>
      <p>{user.email || 'Missing email'}</p>
    </div>
  </div>
)
