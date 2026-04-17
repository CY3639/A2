import { Modal, TextInput, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

function MedicationForm({ opened, onClose, onSubmit }) {
  const form = useForm({
    initialValues: { activeIngredient: '', brandName: '', strength: '', form: '' },
    validate: {
      activeIngredient: (v) => v.trim().length === 0 ? 'Active ingredient is required' : null,
      brandName: (v) => v.trim().length === 0 ? 'Brand name is required' : null,
      strength: (v) => v.trim().length === 0 ? 'Strength is required' : null,
      form: (v) => !v ? 'Form is required' : null,
    },
  });

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title='Add Medication'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label='Active Ingredient' required mb='sm' {...form.getInputProps('activeIngredient')} />
        <TextInput label='Brand Name' required mb='sm' {...form.getInputProps('brandName')} />
        <TextInput label='Strength' required mb='sm' {...form.getInputProps('strength')} />
        <Select
          label='Form'
          required
          mb='sm'
          data={['tablet', 'capsule', 'liquid', 'other']}
          {...form.getInputProps('form')}
        />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={onClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MedicationForm;