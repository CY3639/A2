import { Card, Text, Badge, Group, Stack, Button } from '@mantine/core';

function MedicationItem({ medication, onDelete }) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Text fw={600}>{medication.brandName}</Text>
          <Badge color='teal' variant='light'>{medication.form}</Badge>
        </Group>
        <Text size='sm' c='dimmed'>Active ingredient: {medication.activeIngredient}</Text>
        <Text size='sm' c='dimmed'>Strength: {medication.strength}</Text>
        <Group justify='flex-end'>
          <Button
            size='xs'
            color='red'
            variant='light'
            onClick={() => onDelete(medication._id)}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

export default MedicationItem;