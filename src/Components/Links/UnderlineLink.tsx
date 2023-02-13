/* eslint-disable react/jsx-props-no-spreading */

import { chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

import UnStyledLink, {
  UnStyledLinkProps,
} from '@/Components/Links/UnStyledLink';
import Theme from '@/styles/theme';

const LinkUnderlined = forwardRef<HTMLAnchorElement, UnStyledLinkProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <UnStyledLink
        ref={ref}
        {...rest}
        className='underlined-link animated-underline '
        color={Theme.colors.primary['400']}
        _hover={{ color: Theme.colors.primary['500'] }}
        // use chakra-ui props instead of className
      >
        {children}
      </UnStyledLink>
    );
  },
);

LinkUnderlined.displayName = 'LinkUnderlined';

const UnderlineLink = chakra(LinkUnderlined, {
  shouldForwardProp(prop: string): boolean {
    return ['href', 'children', 'className'].includes(prop);
  },
});
export default UnderlineLink;
