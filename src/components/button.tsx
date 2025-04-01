import { twc } from '@utils/twc.js'

export const Button = twc.button`
  border py-1 px-4

  cursor-pointer
  disabled:cursor-default

  border-gray-200
  dark:border-gray-600

  bg-white
  hover:bg-gray-300 hover:dark:bg-gray-700
  disabled:bg-gray-300 disabled:dark:bg-gray-800

  text-gray-700
  dark:text-gray-400
  hover:text-gray-900
  disabled:text-white
  disabled:dark:text-gray-400
`
