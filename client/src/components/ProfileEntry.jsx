import { useState } from 'react';
import { Card, Text, Badge, Group, Stack, Button } from '@mantine/core';
import MedicationProfileForm from './MedicationProfileForm';

const getIsPharmacist = () => {
  const token = localStorage.getItem('jwt');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.isPharmacist === true;
  } catch {
    return false;
  }
};

function ProfileEntry({ profile, onCease, onDelete, onEdit }) {
  const isPharmacist = getIsPharmacist();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const statusColor = profile.status === 'active' ? 'teal' : 'gray';

  const handleEdit = (updatedData) => {
    if (onEdit) onEdit(profile._id, updatedData);
  };

  return (
    <>
      <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
        <Stack gap='xs'>
          <Group justify='space-between'>
            <Text fw={600}>
              {profile.medication?.brandName} ({profile.medication?.activeIngredient})
            </Text>
            <Group gap='xs'>
              <Badge color={statusColor} variant='light'>{profile.status}</Badge>

              {isPharmacist && onEdit && (
                <Button size='xs' color='blue' variant='light' onClick={() => setEditModalOpen(true)}>
                  Edit
                </Button>
              )}

              {profile.status === 'active' && onCease && isPharmacist && (
                <Button size='xs' color='orange' variant='light' onClick={() => onCease(profile._id)}>
                  Cease
                </Button>
              )}

              {onDelete && isPharmacist && (
                <Button size='xs' color='red' variant='light' onClick={() => onDelete(profile._id)}>
                  Delete
                </Button>
              )}
            </Group>
          </Group>

          <Text size='sm'>Dose: {profile.dose} — {profile.frequency}</Text>
          <Text size='sm' c='dimmed'>
            Started: {new Date(profile.startDate).toLocaleDateString()}
            {profile.endDate && ` — Ended: ${new Date(profile.endDate).toLocaleDateString()}`}
          </Text>
          {profile.notes && <Text size='sm' c='dimmed'>Notes: {profile.notes}</Text>}
        </Stack>
      </Card>

      <MedicationProfileForm
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEdit}
        profile={profile}
      />
    </>
  );
}

export default ProfileEntry;