import classNames from 'classnames'

export function Button(props: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      className={
        classNames(
          'border py-1 px-4 hover:bg-gray-300 disabled:bg-gray-300 disabled:text-white dark:border-gray-600 dark:disabled:text-gray-400 dark:disabled:bg-gray-800 dark:hover:bg-gray-700'
        , props.className
        )
      }
    />
  )
}
