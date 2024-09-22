import classNames from 'classnames'

export function IconButton(props: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      className={
        classNames(
          'border w-6 h-6 inline-flex justify-center items-center'

          // Light
          , 'hover:bg-gray-300 disabled:bg-gray-300'
          , 'text-gray-700 disabled:text-white hover:text-gray-900'

          // Dark
          , 'dark:hover:bg-gray-700 dark:disabled:bg-gray-800'
          , 'dark:text-white dark:disabled:text-gray-400 dark:hover:text-gray-200'
          , 'dark:border-gray-600'

          , props.className
        )
      }
    />
  )
}
