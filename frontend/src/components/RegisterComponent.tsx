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
import { supabase } from '../config/apiConfig';

interface RegisterComponentProps {
    onSwitchToLogin: () => void;
    onRegisterSuccess: () => void;
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
                // 1. Registrar usuario en Auth de Supabase
                const { error: authError } = await supabase.auth.signUp({
                    email: values.email.trim(),
                    password: values.password,
                    options: {
                        data: {
                            role: values.role
                        }
                    }
                });

                if (authError) throw authError;

                // 2. Hashear la contraseña antes de guardar en la tabla users
                const { data: hashedData, error: hashError } = await supabase.rpc('hash_password', {
                    plain_password: values.password
                });

                if (hashError) throw hashError;

                // 3. Crear registro en tabla users
                const { error: userError } = await supabase
                    .from('users')
                    .insert({
                        email: values.email.trim(),
                        hashed_password: hashedData, // Usar el hash generado
                        role: values.role,
                        is_active: true
                    });

                if (userError) throw userError;

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Por favor verifica tu email para activar tu cuenta',
                    confirmButtonColor: theme.palette.primary.main
                }).then(() => {
                    onRegisterSuccess();
                });
            } catch (error) {
                console.error('Register error:', error);
                let errorMessage = 'Hubo un problema al registrar tu cuenta';

                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
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