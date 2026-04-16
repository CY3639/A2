import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

function Home() { 
    return (
        <Container size={500} mt='xl' ta='center'>
            <Title order={1} mb='md'>Welcome to MedProfile</Title>
            <Text c='dimmed' mb='xl'>
                Manage patient medication profiles securely.
            </Text>
            <Group justify='center' gap='md'>
                <Button component={Link} to='/login'>
                    Login
                </Button>
                <Button component={Link} to='/register' variant='outline'>
                    Register
                </Button>
            </Group>
        </Container>
    );
}


export default Home;