import { useState, useEffect, useRef } from 'react';
import { Modal, Autocomplete, TextInput, Button, Group, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// profile prop = edit mode, no profile prop = create mode
function MedicationProfileForm({ opened, onClose, onSubmit, profile }) {
  const isEditMode = Boolean(profile);

  const [drugSearch, setDrugSearch] = useState('');
  const [drugOptions, setDrugOptions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [drugError, setDrugError] = useState('');
  const justSelected = useRef(false);

  const form = useForm({
    initialValues: {
      startDate: null,
      dose: '',
      frequency: '',
      notes: '',
      endDate: null,
    },
    validate: {
      startDate: (v) => (!isEditMode && !v) ? 'Start date is required' : null,
      dose: (v) => v.trim().length === 0 ? 'Dose is required' : null,
      frequency: (v) => v.trim().length === 0 ? 'Frequency is required' : null,
    },
  });

  // pre-populate when edit mode opens
  useEffect(() => {
    if (opened && isEditMode && profile) {
      form.setValues({
        dose: profile.dose || '',
        frequency: profile.frequency || '',
        notes: profile.notes || '',
        startDate: profile.startDate ? new Date(profile.startDate) : null,
        endDate: profile.endDate ? new Date(profile.endDate) : null,
      });
    }
  }, [opened, profile]);

  // medication search for create mode only
  useEffect(() => {
    if (isEditMode) return;
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
  }, [drugSearch, isEditMode]);

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
    if (!isEditMode && !selectedId) {
      setDrugError('Please select a medication');
      return;
    }

    if (isEditMode) {
      onSubmit({
        dose: values.dose,
        frequency: values.frequency,
        notes: values.notes,
        endDate: values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : undefined,
      });
    } else {
      onSubmit({
        medication: selectedId,
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : undefined,
      });
    }

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEditMode ? 'Edit Medication Profile' : 'Add Medication to Profile'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>

        {/* Create mode only — medication search */}
        {!isEditMode && (
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
        )}

        {/* Edit mode — show medication name as read-only */}
        {isEditMode && profile?.medication && (
          <Text size='sm' fw={600} mb='sm'>
            {profile.medication.brandName} ({profile.medication.activeIngredient})
          </Text>
        )}

        {/* Start date only shown in create mode */}
        {!isEditMode && (
          <DateInput
            label='Start Date'
            placeholder='Select a date'
            required
            mb='sm'
            {...form.getInputProps('startDate')}
          />
        )}

        <TextInput label='Dose' required mb='sm' {...form.getInputProps('dose')} />
        <TextInput label='Frequency' required mb='sm' {...form.getInputProps('frequency')} />
        <TextInput
          label='Notes'
          description='Additional notes about the medication'
          mb='sm'
          {...form.getInputProps('notes')}
        />

        {/* End date available in both modes */}
        <DateInput
          label='End Date'
          placeholder='Select a date (optional)'
          clearable
          mb='sm'
          {...form.getInputProps('endDate')}
        />

        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={handleClose}>Cancel</Button>
          <Button type='submit'>{isEditMode ? 'Update' : 'Save'}</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MedicationProfileForm;