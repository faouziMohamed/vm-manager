/* eslint-disable react/jsx-props-no-spreading */

import { Button, ButtonProps, chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

import Theme from '@/styles/theme';

const ButtonUnderlined = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <Button
        variant='unstyled'
        padding={0}
        borderRadius={0}
        all='initial'
        ref={ref}
        {...rest}
        className='underlined-link animated-underline '
        color={Theme.colors.primary['400']}
        _hover={{ color: Theme.colors.primary['500'] }}
        // use chakra-ui props instead of className
      >
        {children}
      </Button>
    );
  },
);

ButtonUnderlined.displayName = 'ButtonUnderlined';

const UnderlineButton = chakra(ButtonUnderlined, {
  shouldForwardProp(prop: string): boolean {
    return ['children', 'className'].includes(prop);
  },
});
export default UnderlineButton;
