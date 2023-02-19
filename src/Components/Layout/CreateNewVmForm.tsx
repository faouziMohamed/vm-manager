/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/ban-ts-comment */

import { Box } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { NewVmValues } from '@/lib/utils';

import {
  FormControlButton,
  MachineNameFormControl,
  MachineUsernameFormControl,
  PasswordFormControl,
  RegionFormControl,
  ServerNameFormControl,
} from '@/Components/form/NewVmFormUtils';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import { saveNewVm } from '@/Services/client/vm.service';

export default function CreateNewVmForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewVmValues>({ mode: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (values: NewVmValues) => {
      // arriving here means that the form is valid
      setIsSubmitting(true);
      await saveNewVm(values);
      setIsSubmitting(false);
      onClose();
    },
    [onClose],
  );
  return (
    <Box
      as='form'
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      display='flex'
      flexDirection='column'
      gap={4}
      // @ts-ignore: Unreachable code error
      ref={formRef}
    >
      {isSubmitting && <FuturaSpinner semiTransparent />}
      <ServerNameFormControl register={register} errors={errors} />
      <MachineNameFormControl errors={errors} register={register} />
      <MachineUsernameFormControl errors={errors} register={register} />
      <RegionFormControl errors={errors} register={register} />
      <PasswordFormControl errors={errors} register={register} />
      <FormControlButton isSubmitting={isSubmitting} onClick={onClose} />
    </Box>
  );
}
