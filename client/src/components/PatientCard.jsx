import { Card, Text, Group, Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
 
function PatientCard({ patient }) {
  const navigate = useNavigate();
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder mb='sm'>
      <Stack gap='xs'>
        <Group justify='space-between'>
          <Text fw={600}>{patient.firstName} {patient.lastName}</Text>
        </Group>
        <Text size='sm' c='dimmed'>Address: {patient.address}</Text>
        <Button size='xs' variant='light'
          onClick={() => navigate(`/patients/${patient._id}`)}
        >
          View Profile
        </Button>
      </Stack>
    </Card>
  );
}
export default PatientCard;