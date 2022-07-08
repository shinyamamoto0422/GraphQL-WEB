import { FC, memo } from 'react'
import Link from 'next/link'
import { type } from 'os'

type Props = {
  title: string
  onClick?: () => void
  className?: string
  href?: string
  type?: 'submit' | 'button'
  disabled?: boolean
  dataTestId?: string
}

export const Button: FC<Props> = memo(
  ({ title, className, href, type, disabled, dataTestId, onClick }) => {
    return (
      <button
        type={type}
        disabled={disabled}
        datatype={dataTestId}
        onClick={onClick}
        className={`${className} mt-3 py-1 px-3 text-white rounded-xl focus:outline-none`}
      >
        {href ? <Link href={href}>{title}</Link> : <a>{title}</a>}
      </button>
    )
  }
)
