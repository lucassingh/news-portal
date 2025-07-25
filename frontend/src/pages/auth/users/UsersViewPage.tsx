// src/pages/auth/users/UsersViewPage.tsx
import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    useTheme,
    Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRole } from '../../../interfaces/user';
import { CiSquareChevLeft } from 'react-icons/ci';

export const UsersViewPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const user = {
        id: id || '1',
        email: 'usuario@ejemplo.com',
        role: UserRole.USER,
        is_active: true,
        createdAt: '2023-05-15T10:30:00Z',
        lastLogin: '2023-06-20T14:45:00Z'
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Box>
            <Button
                startIcon={<CiSquareChevLeft size={40} />}
                onClick={() => navigate('/users')}
                sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                }}
            >
                Volver al listado
            </Button>

            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 'regular',
                }}
            >
                Detalles del Usuario
            </Typography>

            <Card
                sx={{
                    maxWidth: 600,
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                        boxShadow: theme.shadows[6],
                    },
                    transition: theme.transitions.create(['box-shadow'], {
                        duration: theme.transitions.duration.standard,
                    }),
                }}
            >
                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: theme.palette.primary.main,
                                mr: 3,
                                fontSize: '1.5rem',
                                fontWeight: 'regular',
                            }}
                        >
                            {user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Email:</Typography>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{ fontWeight: 'regular' }}
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Rol:</Typography>
                                <Chip
                                    label={user.role === UserRole.USER ? 'Usuario' : 'Administrador'}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                        mb: 3
                    }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Estado
                            </Typography>
                            <Chip
                                label={user.is_active ? 'Activo' : 'Inactivo'}
                                sx={{
                                    mt: 1,
                                    backgroundColor: user.is_active
                                        ? theme.palette.success.light
                                        : theme.palette.error.light,
                                    color: user.is_active
                                        ? theme.palette.success.contrastText
                                        : theme.palette.error.contrastText,
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                ID de Usuario
                            </Typography>
                            <Typography variant="body1">
                                {user.id}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Fecha de Creación
                        </Typography>
                        <Typography variant="body1">
                            {formatDate(user.createdAt)}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Último Inicio de Sesión
                        </Typography>
                        <Typography variant="body1">
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 3
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '50px',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderWidth: '2px'
                                }
                            }}
                        >
                            Editar Usuario
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};