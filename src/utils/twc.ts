import { createTwc } from 'react-twc'
import { twMerge } from 'tailwind-merge'

export const twc = createTwc({ compose: twMerge })
