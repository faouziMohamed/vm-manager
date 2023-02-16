/* eslint-disable react/jsx-props-no-spreading */
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import CustomFormControlErrorMessage, {
  CustomErrorMessageProps,
} from '@/Components/form/CustomFormControlErrorMessage';
import PasswordInput from '@/Components/form/PasswordInput';
import Theme from '@/styles/theme';

type AppFormControlProps = {
  error?: FieldError;
  register?: UseFormRegisterReturn;
  label?: string;
  placeholder: string;
  displayError?: CustomErrorMessageProps;
  isRequired?: boolean;
  type?: string;
  disabled?: boolean;
  value?: string;
};
export default function AppFormControl(props: AppFormControlProps) {
  const { error, label, placeholder, displayError } = props;
  const { register = {} as UseFormRegisterReturn } = props;
  const { isRequired = false, type: typ = 'text', disabled } = props;
  const { value } = props;
  const inputColor = error
    ? Theme.colors.danger.main
    : Theme.colors.primary.main;
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {!!label && <FormLabel>{label}</FormLabel>}
      {typ === 'password' ? (
        <PasswordInput
          hasError={!!error}
          placeholder={placeholder}
          register={register}
          value={value}
          disabled={disabled}
        />
      ) : (
        <Input
          disabled={disabled}
          _focusVisible={{
            borderColor: inputColor,
            boxShadow: `0 0 0 1px ${inputColor}`,
          }}
          type={typ}
          placeholder={placeholder}
          value={value}
          {...register}
          sx={{
            '&:disabled': {
              backgroundColor: 'gray.100',
              borderColor: 'gray.400',
              opacity: '0.6',
            },
          }}
        />
      )}
      {!!displayError && <CustomFormControlErrorMessage {...displayError} />}
    </FormControl>
  );
}
