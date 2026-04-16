import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
 
function PatientForm({ opened, onClose, onSubmit }) {
  const form = useForm({
    initialValues: { firstName: '', lastName: '', address: '' },
    validate: {
      firstName: (v) => v.trim().length < 2 ? 'First name must be at least 2 characters' : null,
      lastName:  (v) => v.trim().length < 2 ? 'Last name must be at least 2 characters' : null,
    },
  });
 
  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    onClose();
  };
 
  return (
    <Modal opened={opened} onClose={onClose} title='Add Patient'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label='First name' description='Patient legal first name'
          required mb='sm' {...form.getInputProps('firstName')} />
        <TextInput label='Last name' required mb='sm'
          {...form.getInputProps('lastName')} />
        <TextInput label='Address' mb='sm'
          {...form.getInputProps('address')} />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={onClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </Group>
      </form>
    </Modal>
  );
}
export default PatientForm;