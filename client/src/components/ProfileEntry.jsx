import { Card, Text, Badge, Group, Stack } from '@mantine/core';
 
function ProfileEntry({ profile }) {
  const statusColor = profile.status === 'active' ? 'teal' : 'gray';
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Text fw={600}>
            {profile.medication?.brandName} ({profile.medication?.activeIngredient})
          </Text>
          <Badge color={statusColor} variant='light'>{profile.status}</Badge>
        </Group>
        <Text size='sm'>Dose: {profile.dose} — {profile.frequency}</Text>
        <Text size='sm' c='dimmed'>
          Started: {new Date(profile.startDate).toLocaleDateString()}
          {profile.endDate && ` — Ended: ${new Date(profile.endDate).toLocaleDateString()}`}
        </Text>
        {profile.notes && <Text size='sm' c='dimmed'>Notes: {profile.notes}</Text>}
      </Stack>
    </Card>
  );
}
export default ProfileEntry;