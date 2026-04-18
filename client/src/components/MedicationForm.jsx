import { useState, useEffect } from 'react';
import { Modal, TextInput, Select, Button, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

function MedicationForm({ opened, onClose, onSubmit, medication }) {
  const [serverError, setServerError] = useState('');

  const form = useForm({
    initialValues: {
      activeIngredient: medication?.activeIngredient ?? '',
      brandName:        medication?.brandName        ?? '',
      strength:         medication?.strength         ?? '',
      form:             medication?.form             ?? '',
    },
    validate: {
      activeIngredient: (v) => v.trim().length === 0 ? 'Active ingredient is required' : null,
      brandName:        (v) => v.trim().length === 0 ? 'Brand name is required' : null,
      strength:         (v) => v.trim().length === 0 ? 'Strength is required' : null,
      form:             (v) => !v ? 'Form is required' : null,
    },
  });

  useEffect(() => {
    if (medication) {
      form.setValues({
        activeIngredient: medication.activeIngredient,
        brandName:        medication.brandName,
        strength:         medication.strength,
        form:             medication.form,
      });
    } else {
      form.reset();
    }
  }, [medication]);

  const handleSubmit = async (values) => {
    setServerError('');
    const error = await onSubmit(values);
    if (error) {
      setServerError(error);
      return;
    }
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={medication ? 'Edit Medication' : 'Add Medication'}>
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
        {serverError && <Text c='red' size='sm' mb='sm'>{serverError}</Text>}
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={onClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MedicationForm;