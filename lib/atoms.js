import { atom } from 'jotai'

export const errorStateAtom = atom({
  errorMessage: null,
  unknownContracts: []
})
