import { Card, Text, Badge, Group, Stack } from '@mantine/core';
 
function MedicationItem({ medication }) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Text fw={600}>{medication.brandName}</Text>
          <Badge color='teal' variant='light'>{medication.form}</Badge>
        </Group>
        <Text size='sm' c='dimmed'>Active ingredient: {medication.activeIngredient}</Text>
        <Text size='sm' c='dimmed'>Strength: {medication.strength}</Text>
      </Stack>
    </Card>
  );
}
export default MedicationItem;