import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    useTheme,
    styled,
    MenuItem,
    FormControlLabel,
    Switch,
    CircularProgress
} from '@mui/material';
import { UserRole, type User } from '../../../interfaces/user';
import { useAuth } from '../../../context/AuthContext';
import { getUserById, updateUser } from '../../../services/users/users.service';
import { useSnackbar } from 'notistack';
import { CiSquareChevLeft } from 'react-icons/ci';

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

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Debe ser un email válido')
        .required('El email es requerido'),
    role: Yup.string()
        .oneOf([UserRole.ADMIN, UserRole.USER])
        .required('El rol es requerido'),
    is_active: Yup.boolean().required('El estado es requerido')
});

export const UsersEditPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<User>>({
        email: '',
        role: UserRole.USER,
        is_active: true
    });

    const isAdmin = currentUser?.role === UserRole.ADMIN;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id) return;

                const userData = await getUserById(parseInt(id));
                setInitialValues({
                    email: userData.email,
                    role: userData.role,
                    is_active: userData.is_active
                });
            } catch (error) {
                console.error('Error fetching user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información del usuario',
                    confirmButtonColor: theme.palette.primary.main
                });
                navigate('/users');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate, theme]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (!id) return;

                await updateUser(parseInt(id), values);

                enqueueSnackbar(`Usuario con ID ${id} actualizado correctamente`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
                navigate('/users');
            } catch (error) {
                console.error('Update error:', error);
                enqueueSnackbar(`Error al actualizar el usuario con ID ${id}`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
            }
        }
    });

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container component="main">
            <Grid
                item
                xs={12}
                sm={12}
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'start',
                    backgroundColor: theme.palette.background.default,
                    p: 3
                }}
            >
                <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Box sx={{
                        width: '100%',
                        maxWidth: 450,
                        mb: 4,
                        textAlign: 'left'
                    }}>
                        <Button
                            startIcon={<CiSquareChevLeft size={40} />}
                            onClick={() => navigate('/users')}
                            sx={{
                                color: theme.palette.primary.main,
                                marginBottom: 3,
                            }}
                        >
                            Volver al listado
                        </Button>

                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontWeight: 'regular',
                                mb: 1
                            }}
                        >
                            Editar Usuario
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary
                            }}
                        >
                            Actualiza la información del usuario
                        </Typography>
                    </Box>

                    <FormContainer elevation={0}>
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
                            sx={{ mb: 3 }}
                            disabled={!isAdmin}
                        />

                        {isAdmin && (
                            <TextField
                                fullWidth
                                id="role"
                                name="role"
                                label="Rol"
                                select
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                error={formik.touched.role && Boolean(formik.errors.role)}
                                helperText={formik.touched.role && formik.errors.role}
                                sx={{ mb: 3 }}
                            >
                                <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
                                <MenuItem value={UserRole.USER}>Usuario</MenuItem>
                            </TextField>
                        )}

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formik.values.is_active || false}
                                    onChange={formik.handleChange}
                                    name="is_active"
                                    color="primary"
                                    disabled={!isAdmin} // Solo admin puede cambiar estado
                                />
                            }
                            label={formik.values.is_active ? 'Activo' : 'Inactivo'}
                            sx={{ mb: 3 }}
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
                            {formik.isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/users')}
                            sx={{
                                py: 1.5,
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            Cancelar
                        </Button>
                    </FormContainer>
                </Container>
            </Grid>
        </Grid>
    );
};