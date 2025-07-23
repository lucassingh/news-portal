import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    404 - Página no encontrada
                </Typography>
                <Typography paragraph>
                    La página que estás buscando no existe o no tienes permiso para acceder.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{ mt: 3 }}
                >
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
};