import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
 
function MedicationProfileForm({ opened, onClose, onSubmit }) {
  const form = useForm({
    initialValues: { medicationId: '', startDate: '', dose: '', frequency: '', notes: '' },
    validate: {
      medicationId: (v) => v.trim().length === 0 ? 'Medication ID is required' : null,
      startDate: (v) => v.trim().length === 0 ? 'Start date is required' : null,
      dose: (v) => v.trim().length === 0 ? 'Dose is required' : null,
      frequency: (v) => v.trim().length === 0 ? 'Frequency is required' : null,
    },
  });
 
  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    onClose();
  };
 
  return (
    <Modal opened={opened} onClose={onClose} title='Add Medication to Profile'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label='Medication ID' required mb='sm' {...form.getInputProps('medicationId')} />
        <TextInput label='Start Date' required mb='sm' {...form.getInputProps('startDate')} />
        <TextInput label='Dose' required mb='sm' {...form.getInputProps('dose')} />
        <TextInput label='Frequency' required mb='sm' {...form.getInputProps('frequency')} />
        <TextInput label='Notes' description='Additional notes about the medication' mb='sm' {...form.getInputProps('notes')} />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={onClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </Group>
      </form>
    </Modal>
  );
}
export default MedicationProfileForm;