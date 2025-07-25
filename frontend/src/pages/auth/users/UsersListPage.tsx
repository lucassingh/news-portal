import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableFooter,
    TablePagination,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../interfaces/user';
import { CiEdit, CiEraser, CiRead } from 'react-icons/ci';
import { useUsers } from '../../../hooks/useUsers';
import { enqueueSnackbar } from 'notistack';


const UsersListPage: React.FC = () => {
    const { users, loading, error, removeUser } = useUsers();
    const navigate = useNavigate();
    const theme = useTheme();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleUsers = users.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleView = (id: number) => navigate(`/users/view/${id}`);
    const handleEdit = (id: number) => navigate(`/users/edit/${id}`);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await removeUser(userToDelete.id);
                enqueueSnackbar(`Usuario ${userToDelete.email} eliminado correctamente`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
                setDeleteDialogOpen(false);
                if (visibleUsers.length === 1 && page > 0) {
                    setPage(page - 1);
                }
            } catch (err) {
                console.error('Error deleting user:', err);
                enqueueSnackbar(`Error al eliminar el usuario ${userToDelete.email}`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'regular' }}>
                    Listado de usuarios activos
                </Typography>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                            boxShadow: theme.shadows[4],
                        },
                        transition: theme.transitions.create(['box-shadow'], {
                            duration: theme.transitions.duration.standard,
                        }),
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleUsers.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                        cursor: 'pointer',
                                        transition: theme.transitions.create(['background-color'], {
                                            duration: theme.transitions.duration.shortest,
                                        }),
                                    }}
                                    onClick={() => handleView(user.id)}
                                >
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                padding: theme.spacing(0.5, 1),
                                                borderRadius: theme.shape.borderRadius,
                                                backgroundColor: user.is_active
                                                    ? theme.palette.success.light
                                                    : theme.palette.error.light,
                                                color: user.is_active
                                                    ? theme.palette.success.contrastText
                                                    : theme.palette.error.contrastText,
                                            }}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(user.id);
                                                }}
                                                color="primary"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.light,
                                                        color: theme.palette.primary.contrastText,
                                                    },
                                                }}
                                            >
                                                <CiRead />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(user.id);
                                                }}
                                                color="secondary"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.secondary.light,
                                                        color: theme.palette.secondary.contrastText,
                                                    },
                                                    ml: 1,
                                                    mr: 1,
                                                }}
                                            >
                                                <CiEdit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(user);
                                                }}
                                                color="error"
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.error.light,
                                                        color: theme.palette.error.contrastText,
                                                    },
                                                }}
                                            >
                                                <CiEraser />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={users.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Usuarios por página:"
                                    labelDisplayedRows={({ from, to, count }) =>
                                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                                    }
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        padding: theme.spacing(2),
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'regular' }}>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    {userToDelete && (
                        <Typography>
                            ¿Estás seguro que deseas eliminar al usuario {userToDelete.email}?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                            },
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersListPage;