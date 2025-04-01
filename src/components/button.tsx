import { twc } from '@utils/twc.js'

export const Button = twc.button`
  border py-1 px-4

  cursor-pointer
  disabled:cursor-default

  border-gray-200

  bg-white
  hover:bg-gray-300
  disabled:bg-gray-300

  text-gray-700
  hover:text-gray-900
  disabled:text-white
`
