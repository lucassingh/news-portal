import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import {
    Box,
    Button,
    Link,
    TextField,
    Typography,
    MenuItem,
    useTheme
} from '@mui/material';
import type { RegisterFormValues } from '../interfaces/user';
import { UserRole } from '../interfaces/user';
import api from '../config/apiConfig';
import { AxiosError } from 'axios';

interface RegisterComponentProps {
    onSwitchToLogin: () => void;
    onRegisterSuccess: () => void;
}

interface ApiErrorResponse {
    detail?: string;
    message?: string;
    // Agrega otros campos que pueda devolver tu API
}

export const RegisterComponent: React.FC<RegisterComponentProps> = ({
    onSwitchToLogin,
    onRegisterSuccess
}) => {
    const theme = useTheme();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Debe ser un email válido')
            .required('El email es requerido'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es requerida'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
            .required('Debes confirmar tu contraseña'),
        role: Yup.string()
            .oneOf([UserRole.ADMIN, UserRole.USER])
            .required('El rol es requerido')
    });

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            role: UserRole.USER
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // Registrar usuario directamente con TU API
                await api.post('/auth/register', {
                    email: values.email.trim(),
                    password: values.password,
                    role: values.role
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente',
                    confirmButtonColor: theme.palette.primary.main
                }).then(() => {
                    onRegisterSuccess();
                });
            } catch (err) {
                console.error('Register error:', err);
                let errorMessage = 'Hubo un problema al registrar tu cuenta';

                // Manejo seguro de errores con TypeScript
                if (typeof err === 'object' && err !== null) {
                    const error = err as AxiosError<ApiErrorResponse>;

                    if (error.response?.data?.detail) {
                        errorMessage = error.response.data.detail;
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: theme.palette.primary.main
                });
            }
        }
    });

    return (
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
                    Crear Cuenta
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary
                    }}
                >
                    Completa el formulario para registrarte
                </Typography>
            </Box>

            <Box
                component="form"
                noValidate
                onSubmit={formik.handleSubmit}
                sx={{ width: '100%', maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 3 }}
            >
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    type="password"
                    id="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />

                <TextField
                    select
                    fullWidth
                    name="role"
                    label="Rol"
                    id="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                >
                    <MenuItem value={UserRole.USER}>Usuario</MenuItem>
                    <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
                </TextField>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={formik.isSubmitting}
                    sx={{
                        py: 1.5,
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
                </Button>

                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        mt: 2
                    }}
                >
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        component="button"
                        type="button"
                        onClick={onSwitchToLogin}
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Iniciar sesión
                    </Link>
                </Typography>
            </Box>
        </>
    );
};