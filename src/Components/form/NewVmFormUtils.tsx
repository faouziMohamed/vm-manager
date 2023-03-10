/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Select,
} from '@chakra-ui/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdAddTask } from 'react-icons/md';

import { NewVmValues } from '@/lib/types';

import AppFormControl from '@/Components/form/AppFormControl';
import {
  passwordInputError,
  passwordRegex,
} from '@/Components/form/PasswordInput';
import { useAvailableRegions } from '@/Services/client/vm.service';
import Theme from '@/styles/theme';

export function FormControlButton(props: {
  isSubmitting: boolean;
  onClick: () => void;
}) {
  const { onClick, isSubmitting } = props;
  return (
    <HStack justifyContent='flex-end' gap={3}>
      <Button
        type='submit'
        bg={Theme.colors.primary.main}
        color={Theme.colors.primary['50']}
        leftIcon={isSubmitting ? <BiLoaderCircle /> : <MdAddTask />}
        isLoading={isSubmitting}
      >
        Create
      </Button>
      <Button type='button' onClick={onClick}>
        Cancel
      </Button>
    </HStack>
  );
}

type FormControlFieldProps = {
  errors: FieldErrors<NewVmValues>;
  register: UseFormRegister<NewVmValues>;
};

export function PasswordFormControl(props: FormControlFieldProps) {
  const { errors, register } = props;
  return (
    <AppFormControl
      placeholder='Type a Password'
      type='password'
      label='Server Password'
      error={errors.password}
      register={{
        ...register('password', {
          required: true,
          pattern: passwordRegex,
        }),
      }}
      displayError={passwordInputError}
      isRequired
    />
  );
}

export function RegionFormControl(props: FormControlFieldProps) {
  const { data, isLoading } = useAvailableRegions();

  const { errors, register } = props;
  return (
    <FormControl isRequired isInvalid={!!errors.region}>
      <FormLabel>Region</FormLabel>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Select
          {...register('region', { required: true })}
          placeholder='Select Region'
          variant='filled'
        >
          {data?.regions?.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      )}
      <FormHelperText>
        We recommend to choose a server near your region
      </FormHelperText>
      <FormErrorMessage>A region must be selected</FormErrorMessage>
    </FormControl>
  );
}

export function MachineNameFormControl(props: FormControlFieldProps) {
  const { errors, register } = props;
  return (
    <AppFormControl
      placeholder='test-app-server'
      label='VM hostname'
      isRequired
      error={errors.machineName}
      register={{
        ...register('machineName', {
          required: true,
          // The expression checks for invalid characters that are not allowed in a Windows computer name
          pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,62}[a-zA-Z0-9]$/,
        }),
      }}
      displayError={{
        heading: 'The machine name (hostname) must follow the following rules:',
        rules: [
          'Start with a lowercase letter or a digit',
          'Can contain lowercase letters, digits, or hyphens',
          'Is no longer than 63 characters',
          'Can have an optional suffix of a single lowercase letter or digit',
        ],
      }}
    />
  );
}

export function MachineUsernameFormControl(props: FormControlFieldProps) {
  const { errors, register } = props;
  return (
    <AppFormControl
      placeholder='dave'
      label='VM Username'
      isRequired
      error={errors.vmUsername}
      register={{
        ...register('vmUsername', {
          required: true,
          // The expression checks for invalid characters that are not allowed in a Windows computer name
          pattern: /^[a-zA-Z][a-zA-Z0-9-]{0,11}[a-zA-Z0-9]$/,
        }),
      }}
      displayError={{
        heading:
          'The Virtual Machine username must follow the following rules:',
        rules: [
          'Start with letter',
          'Can contain lowercase letters, digits, or hyphens',
          'Is no longer than 12 characters',
          'Can have an optional suffix of a single lowercase letter or digit',
        ],
      }}
    />
  );
}

export function ServerNameFormControl(props: {
  register: UseFormRegister<NewVmValues>;
  errors: FieldErrors<NewVmValues>;
}) {
  const { register, errors } = props;
  return (
    <AppFormControl
      placeholder='Test - Uploaded new App'
      label='Server Name'
      isRequired
      error={errors.serverName}
      register={{ ...register('serverName', { required: true }) }}
      displayError={{ heading: 'Server name is required' }}
    />
  );
}
