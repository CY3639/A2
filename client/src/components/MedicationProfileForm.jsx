import { useState, useEffect, useRef } from 'react';
import { Modal, Autocomplete, TextInput, Button, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MedicationProfileForm({ opened, onClose, onSubmit }) {
  const [drugSearch, setDrugSearch] = useState('');
  const [drugOptions, setDrugOptions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [drugError, setDrugError] = useState('');
  const justSelected = useRef(false);

  const form = useForm({
    initialValues: { startDate: null, dose: '', frequency: '', notes: '' },
    validate: {
      startDate: (v) => !v ? 'Start date is required' : null,
      dose: (v) => v.trim().length === 0 ? 'Dose is required' : null,
      frequency: (v) => v.trim().length === 0 ? 'Frequency is required' : null,
    },
  });

  useEffect(() => {
    if (drugSearch.trim().length === 0) {
      setDrugOptions([]);
      return;
    }
    const fetchMedications = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const params = new URLSearchParams();
        params.set('medicationName', drugSearch);
        const response = await fetch(`${API_BASE_URL}/medications/search?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        setDrugOptions(
          data.map((med) => ({
            value: med._id,
            label: `${med.brandName} (${med.activeIngredient}) ${med.strength} ${med.form}`,
          }))
        );
      } catch (err) {
        console.error('Medication search failed:', err);
      }
    };
    fetchMedications();
  }, [drugSearch]);

  const handleOptionSubmit = (value) => {
    justSelected.current = true;
    setSelectedId(value);
    setDrugError('');
    const match = drugOptions.find((opt) => opt.value === value);
    if (match) setDrugSearch(match.label);
  };

  const handleChange = (val) => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    setDrugSearch(val);
    setSelectedId('');
  };

  const reset = () => {
    form.reset();
    setDrugSearch('');
    setDrugOptions([]);
    setSelectedId('');
    setDrugError('');
    justSelected.current = false;
  };

  const handleSubmit = (values) => {
    if (!selectedId) {
      setDrugError('Please select a medication');
      return;
    }
    onSubmit({
      medicationId: selectedId,
      ...values,
      startDate: new Date(values.startDate).toISOString(),
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title='Add Medication to Profile'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Autocomplete
          label='Medication'
          placeholder='Type a drug or brand name...'
          data={drugOptions}
          value={drugSearch}
          onChange={handleChange}
          onOptionSubmit={handleOptionSubmit}
          error={drugError}
          required
          mb='sm'
        />
        <DateInput
          label='Start Date'
          placeholder='Select a date'
          required
          mb='sm'
          {...form.getInputProps('startDate')}
        />
        <TextInput label='Dose' required mb='sm' {...form.getInputProps('dose')} />
        <TextInput label='Frequency' required mb='sm' {...form.getInputProps('frequency')} />
        <TextInput
          label='Notes'
          description='Additional notes about the medication'
          mb='sm'
          {...form.getInputProps('notes')}
        />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={handleClose}>Cancel</Button>
          <Button type='submit'>Save</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MedicationProfileForm;