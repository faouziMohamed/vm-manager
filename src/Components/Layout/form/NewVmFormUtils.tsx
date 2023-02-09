/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdAddTask } from 'react-icons/md';

import { FormValues } from '@/lib/utils';

import { useAvailableRegions } from '@/Services/hooks';
import Theme from '@/styles/theme';

function CustomFormControlErrorMessage({
  heading,
  list,
}: {
  heading: string;
  list: string[];
}) {
  return (
    <>
      <Heading as='h3' fontSize='xs'>
        {heading}
      </Heading>
      <Box as='ul' listStyleType='disc' ml={4}>
        {list.map((item) => (
          <Text key={item} as='li'>
            {item}
          </Text>
        ))}
      </Box>
    </>
  );
}

export function FormControlButton(props: {
  isSubmitting: boolean;
  onClick: () => void;
}) {
  const { onClick, isSubmitting } = props;
  return (
    <HStack justifyContent='flex-end' gap={3}>
      <Button
        type='submit'
        bg={Theme.colors.secondary.main}
        color={Theme.colors.secondary['50']}
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
    <FormControl isRequired isInvalid={!!errors.password}>
      <FormLabel>Server Password</FormLabel>
      <Input
        type='password'
        {...register('password', {
          required: true,
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\W\s]{6,}$/,
        })}
      />

      <FormErrorMessage flexDirection='column' alignItems='flex-start'>
        <CustomFormControlErrorMessage
          heading='Password must contain at least 6 characters including:'
          list={[
            '1 uppercase letter',
            '1 lowercase letter',
            '1 number',
            '1 special character (@$!%*?&)',
          ]}
        />
      </FormErrorMessage>
    </FormControl>
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
    <FormControl isRequired isInvalid={!!errors.machineName}>
      <FormLabel>Machine Name</FormLabel>
      <Input
        placeholder='test-app-server'
        {...register('machineName', {
          required: true,
          // The expression checks for invalid characters that are not allowed in a Windows computer name
          pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,62}[a-zA-Z0-9]$/,
        })}
      />
      <FormErrorMessage flexDirection='column' alignItems='flex-start'>
        <CustomFormControlErrorMessage
          heading='The machine name (hostname) must follow the following rules:'
          list={[
            'Start with a lowercase letter or a digit',
            'Can contain lowercase letters, digits, or hyphens',
            'Is no longer than 63 characters',
            'Can have an optional suffix of a single lowercase letter or digit',
          ]}
        />
      </FormErrorMessage>
    </FormControl>
  );
}

export function ServerNameFormControl(props: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const { register, errors } = props;
  return (
    <FormControl isRequired>
      <FormLabel>Server Name</FormLabel>
      <Input
        placeholder='Test - Uploaded new App'
        {...register('serverName', { required: true })}
      />
      {errors.serverName && (
        <FormErrorMessage>{errors.serverName.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}
