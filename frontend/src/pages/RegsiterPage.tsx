
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

export const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Registrarse
                </Typography>
                <Typography paragraph>
                    Página de registro. (Simulación)
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{ mt: 3 }}
                >
                    Volver al Login
                </Button>
            </Box>
        </Container>
    );
};