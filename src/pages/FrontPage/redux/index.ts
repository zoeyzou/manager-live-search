import { combineReducers } from '@reduxjs/toolkit'
import { dataReducer } from './dataSlice'
import { viewReducer } from './viewSlice'

export const frontPageReducer = combineReducers({
  view: viewReducer,
  data: dataReducer,
})
