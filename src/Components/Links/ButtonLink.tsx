/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef } from 'react';

import clsxm from '@/lib/utils';

import UnStyledLink, { UnStyledLinkProps } from './UnStyledLink';

enum ButtonVariant {
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
}

type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: keyof typeof ButtonVariant;
} & UnStyledLinkProps;

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { children, className, variant = 'primary', isDarkBg = false, ...rest },
    ref,
  ) => {
    return (
      <UnStyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'inline-flex items-center rounded px-4 py-2 font-semibold',
          'focus:outline-none focus-visible:ring focus-visible:ring-primary-500',
          'shadow-sm',
          'transition-colors duration-75',
          // #region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-600 text-white',
              'border border-primary-700',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-500',
              'disabled:bg-primary-400 disabled:hover:bg-primary-400',
            ],
            variant === 'outline' && [
              'text-primary-500',
              'border border-primary-600',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-primary-500',
              'shadow-none',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'text-dark bg-white ',
              'border border-gray-300',
              'hover:text-dark hover:bg-gray-100',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          // #endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className,
        )}
      >
        {children}
      </UnStyledLink>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
export default ButtonLink;
