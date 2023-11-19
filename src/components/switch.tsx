import { Switch as HeadlessSwitch } from '@headlessui/react'
import classNames from 'classnames'

interface ISwitchProps {
  value: boolean
  onClick: (value: boolean) => void
}

export function Switch({ value, onClick }: ISwitchProps) {
  return (
    <HeadlessSwitch
      checked={value}
      onChange={onClick}
      className={classNames(
        'inline-flex h-4 w-7 rounded-full items-center'
      , value ? 'bg-gray-700' : 'bg-gray-300'
      )}
    >
      <span
        className={classNames(
          'inline-block h-2 w-2 rounded-full transform bg-white transition'
        , value ? 'translate-x-4' : 'translate-x-1'
        )}
      />
    </HeadlessSwitch>
  )
}
