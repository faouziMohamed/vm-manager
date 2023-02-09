import CreateNewVmForm from '@/Components/Layout/CreateNewVmForm';
import AppBlurredModal from '@/Components/Modals/AppBlurredModal';

type CreateVmProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function CreateNewVm(props: CreateVmProps) {
  const { isOpen, onClose } = props;
  const title = 'Create a new Instance';
  return (
    <AppBlurredModal isOpen={isOpen} onClose={onClose} title={title}>
      <CreateNewVmForm onClose={onClose} />
    </AppBlurredModal>
  );
}
