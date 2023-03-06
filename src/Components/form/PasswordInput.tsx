import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChangeEventHandler, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import { adjustColor } from '@/lib/utils';

import Theme from '@/styles/theme';

export const passwordInputError = {
  heading: 'The password must follow the following rules:',
  rules: [
    '1 uppercase letter',
    '1 lowercase letter',
    '1 number',
    '1 special character (@$!%*?&)',
  ],
};
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\W\s]{6,}$/;

export default function PasswordInput(props: {
  placeholder: string;
  register: UseFormRegisterReturn;
  hasError?: boolean;
  value?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const { placeholder, register, hasError, value, disabled } = props;

  const [show, setShow] = useState(false);
  const inputColor = hasError
    ? Theme.colors.danger.main
    : Theme.colors.primary.main;
  return (
    <InputGroup>
      <Input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        _focusVisible={{
          borderColor: inputColor,
          boxShadow: `0 0 0 1px ${inputColor}`,
        }}
        value={value}
        isDisabled={disabled}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register}
      />
      <InputRightElement>
        <IconButton
          bg={inputColor}
          color={Theme.colors.primary['50']}
          _hover={{ bg: adjustColor(inputColor, -15) }}
          _active={{ bg: adjustColor(inputColor, -25) }}
          onClick={() => setShow(!show)}
          aria-label='Toggle password visibility'
          icon={show ? <AiFillEyeInvisible /> : <AiFillEye />}
          borderRadius='0 5px 5px 0'
        />
      </InputRightElement>
    </InputGroup>
  );
}
