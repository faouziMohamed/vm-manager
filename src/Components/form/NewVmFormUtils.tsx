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

import { FormValues } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
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
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
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
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\W\s]{6,}$/,
        }),
      }}
      displayError={{
        heading: 'Password must contain at least 6 characters including:',
        rules: [
          '1 uppercase letter',
          '1 lowercase letter',
          '1 number',
          '1 special character (@$!%*?&)',
        ],
      }}
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
      label='Machine Name'
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

export function ServerNameFormControl(props: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
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
