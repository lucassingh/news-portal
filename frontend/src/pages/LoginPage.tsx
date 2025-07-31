import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { RegisterComponent } from '../components/RegisterComponent';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
    useTheme,
    styled
} from '@mui/material';
import backgroundImage from '../assets/background.png';
import type { LoginFormValues } from '../interfaces/user';

const FormContainer = styled(Paper)(({ theme }) => ({
    borderRadius: 8,
    border: `1px solid ${theme.palette.info.main}`,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    padding: 40,
    width: '100%',
    maxWidth: 450,
    display: 'flex',
    flexDirection: 'column',
    gap: 24
}));

export const LoginPage: React.FC = () => {
    const theme = useTheme();
    const { login } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string()
            .email('Debe ser un email válido')
            .required('El email es requerido'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es requerida')
    });

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await login(values.username, values.password);
                await Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Has iniciado sesión correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
                    confirmButtonColor: theme.palette.primary.main
                });
            }
        }
    });

    const handleRegisterSuccess = () => {
        setShowRegister(false);
        formik.resetForm();
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={8}
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', sm: 'block' }
                }}
            />

            <Grid
                item
                xs={12}
                sm={4}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    p: 3
                }}
            >
                <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showRegister ? (
                        <RegisterComponent
                            onSwitchToLogin={() => setShowRegister(false)}
                            onRegisterSuccess={handleRegisterSuccess}
                        />
                    ) : (
                        <>
                            <Box sx={{
                                width: '100%',
                                maxWidth: 450,
                                mb: 4,
                                textAlign: 'left'
                            }}>
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.main,
                                        mb: 1
                                    }}
                                >
                                    Iniciar Sesión
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    Ingresa tus credenciales para acceder al sistema
                                </Typography>
                            </Box>

                            <FormContainer elevation={0}>
                                <TextField
                                    fullWidth
                                    id="username"
                                    label="Email"
                                    name="username"
                                    autoComplete="email"
                                    autoFocus
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    sx={{ mb: 2 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={() => formik.handleSubmit()}
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        py: 1.5,
                                        mb: 2,
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </Button>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        textAlign: 'center',
                                        mt: 2
                                    }}
                                >
                                    ¿No tienes una cuenta?{' '}
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => setShowRegister(true)}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Regístrate
                                    </Link>
                                </Typography>
                            </FormContainer>
                        </>
                    )}
                </Container>
            </Grid>
        </Grid>
    );
};