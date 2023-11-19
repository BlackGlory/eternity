import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { IconButton } from '@components/icon-button.jsx'

export function UpdateButton(props: React.ComponentProps<typeof IconButton>) {
  return (
    <IconButton title='Update' {...props}>
      <ArrowPathIcon className='w-4 h-4' />
    </IconButton>
  )
}
