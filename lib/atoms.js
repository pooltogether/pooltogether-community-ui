import { atom } from 'jotai'

export const EMPTY_ERROR_STATE = Object.freeze({ errorMessage: null, unknownContracts: [] })

export const errorStateAtom = atom(EMPTY_ERROR_STATE)
