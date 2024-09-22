import { Switch as HeadlessSwitch } from '@headlessui/react'
import classNames from 'classnames'

interface ISwitchProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function Switch({ value, onChange }: ISwitchProps) {
  return (
    <HeadlessSwitch
      title={value ? 'Disable' : 'Enable'}
      checked={value}
      onChange={onChange}
      className={classNames(
        'inline-flex h-4 w-7 rounded-full items-center'
      , value ? 'bg-gray-700' : 'bg-gray-300 dark:bg-gray-700'
      )}
    >
      <span
        className={classNames(
          'inline-block h-2 w-2 rounded-full transform bg-white transition'
        , value ? 'translate-x-4' : 'translate-x-1 dark:bg-gray-500'
        )}
      />
    </HeadlessSwitch>
  )
}
