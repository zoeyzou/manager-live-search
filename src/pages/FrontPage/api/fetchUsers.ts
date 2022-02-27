import type { User } from '../../../types'

const USER_API =
  'https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json'

type UserType = 'employees' | 'accounts'

type UserApiBase<T extends UserType> = {
  type: T
  id: string
}

type Employee = UserApiBase<'employees'> & {
  attributes: {
    firstName: string
    lastName: string
    name: string
    'Job Level': string
  }
  relationships: {
    account: {
      data: {
        id: string
      }
    }
  }
}

type Account = UserApiBase<'accounts'> & {
  attributes: {
    email: string
  }
}

type UserApiResponse = {
  data: Employee[]
  included: Array<Employee | Account>
}

export const fetchUsers = async (): Promise<User[] | unknown> => {
  try {
    const response = await fetch(USER_API)
    const parsedResponse: UserApiResponse = await response.json()

    // merge all the user items in both data and included property
    const employees = [
      ...parsedResponse.data.filter((item) => item.type === 'employees'),
      ...parsedResponse.included.filter((item) => item.type === 'employees'),
    ] as Employee[]

    const parsedUsers = employees.reduce<User[]>((users, employee) => {
      // filter out redundant items
      if (users.findIndex((user) => employee.id === user.id) > -1) {
        return users
      }

      const accountDetail = parsedResponse.included.find(
        (account) =>
          account.type === 'accounts' &&
          employee.relationships.account.data.id === account.id
      ) as Account

      const parsedUser: User = {
        id: employee.id,
        firstName: employee.attributes.firstName,
        lastName: employee.attributes.lastName,
        name: employee.attributes.name,
        jobLevel: employee.attributes['Job Level'],
        email: accountDetail?.attributes.email ?? '',
      }

      users = [...users, parsedUser] // eslint-disable-line no-param-reassign
      return users
    }, [])
    return parsedUsers
  } catch (e) {
    return e
  }
}
