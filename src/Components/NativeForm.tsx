/* eslint-disable react/jsx-props-no-spreading */
import { chakra } from '@chakra-ui/react';
import { FormEvent, forwardRef, ReactNode } from 'react';

type FormProps = {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

// forwardRef is important!!
// Dropdown needs access to the DOM of the Menu

const ExoticForm = forwardRef<HTMLFormElement, FormProps>(
  ({ children, ...rest }, ref) => (
    <form ref={ref} {...rest}>
      {children}
    </form>
  ),
);
ExoticForm.displayName = 'ExoticForm';

const NativeForm = chakra(ExoticForm, {
  shouldForwardProp: (prop) => ['children', 'ref'].includes(prop),
});

NativeForm.displayName = 'NativeForm';
export default NativeForm;
