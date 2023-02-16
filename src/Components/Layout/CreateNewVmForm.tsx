/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/ban-ts-comment */

import { Box } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormValues } from '@/lib/utils';

import {
  FormControlButton,
  MachineNameFormControl,
  PasswordFormControl,
  RegionFormControl,
  ServerNameFormControl,
} from '@/Components/form/NewVmFormUtils';
import { saveNewVm } from '@/Services/client/vmInstances.service';

// async function onSubmit(values: FormValues) {
//   // arriving here means that the form is valid
//   await saveNewVm(values);
// }

export default function CreateNewVmForm({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (values: FormValues) => {
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
      <ServerNameFormControl register={register} errors={errors} />
      <MachineNameFormControl errors={errors} register={register} />
      <RegionFormControl errors={errors} register={register} />
      <PasswordFormControl errors={errors} register={register} />
      <FormControlButton isSubmitting={isSubmitting} onClick={onClose} />
    </Box>
  );
}
