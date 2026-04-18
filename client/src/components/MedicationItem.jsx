import { Card, Text, Badge, Group, Stack, Button } from '@mantine/core';

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

function MedicationItem({ medication, onDelete, onEdit }) {
  const isPharmacist = getIsPharmacist();
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Text fw={600}>{medication.brandName}</Text>
          <Badge color='teal' variant='light'>{medication.form}</Badge>
        </Group>
        <Text size='sm' c='dimmed'>Active ingredient: {medication.activeIngredient}</Text>
        <Text size='sm' c='dimmed'>Strength: {medication.strength}</Text>
        {isPharmacist && (
          <Group justify='flex-end'>
            <Button size='xs' variant='light' onClick={() => onEdit(medication)}>
              Edit
            </Button>
            <Button size='xs' color='red' variant='light' onClick={() => onDelete(medication._id)}>
              Delete
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}

export default MedicationItem;