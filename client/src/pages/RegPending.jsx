import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

function RegPending() { 
    return (
        <Container size={500} mt='xl' ta='center'>
            <Title order={1} mb='md'>Welcome to MedProfile</Title>
            <Text c='dimmed' mb='xl'>
                <p>Your account is pending admin approval.</p>
                <p>Please wait for an administrator to approve your registration.</p>
            </Text>
            <Group justify='center' gap='md'>
                <Button component={Link} to='/Home'>
                    Return to Home
                </Button>
            </Group>
        </Container>
    );
}

export default RegPending;