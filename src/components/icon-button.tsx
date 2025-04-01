import { twc } from '@utils/twc.js'

export const IconButton = twc.button`
  border w-6 h-6 inline-flex justify-center items-center

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
