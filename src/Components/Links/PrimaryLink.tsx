/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef } from 'react';

import clsxm from '@/lib/utils';

import UnStyledLink, { UnStyledLinkProps } from './UnStyledLink';

const PrimaryLink = forwardRef<HTMLAnchorElement, UnStyledLinkProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <UnStyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'inline-flex items-center',
          'font-medium text-primary-600 hover:text-primary-500',
          'focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          className,
        )}
      >
        {children}
      </UnStyledLink>
    );
  },
);

PrimaryLink.displayName = 'PrimaryLink';

export default PrimaryLink;
