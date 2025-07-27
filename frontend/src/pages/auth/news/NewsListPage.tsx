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
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { News } from '../../../interfaces/news';
import { CiEdit, CiEraser, CiRead } from 'react-icons/ci';
import { enqueueSnackbar } from 'notistack';
import { useNews } from '../../../hooks/useNews';
import { buildImageUrl } from '../../../../utils/helpers';

const NewsListPage: React.FC = () => {
    const { news, loading, error, removeNews } = useNews();
    const navigate = useNavigate();
    const theme = useTheme();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleNews = news.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const truncateText = (text: string, wordCount: number) => {
        const words = text.split(' ');
        if (words.length > wordCount) {
            return words.slice(0, wordCount).join(' ') + '...';
        }
        return text;
    };

    const handleView = (id: number) => navigate(`/news/view/${id}`);
    const handleEdit = (id: number) => navigate(`/news/edit/${id}`);

    const handleDeleteClick = (newsItem: News) => {
        setNewsToDelete(newsItem);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (newsToDelete) {
            try {
                await removeNews(newsToDelete.id);
                enqueueSnackbar(`Noticia "${truncateText(newsToDelete.title, 5)}" eliminada correctamente`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
                setDeleteDialogOpen(false);
                if (visibleNews.length === 1 && page > 0) {
                    setPage(page - 1);
                }
            } catch (err) {
                console.error('Error deleting news:', err);
                enqueueSnackbar(`Error al eliminar la noticia "${truncateText(newsToDelete.title, 5)}"`, {
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
                    Listado de Noticias
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/news/create')}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        py: 1
                    }}
                >
                    Crear Noticia
                </Button>
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
                                <TableCell>Título</TableCell>
                                <TableCell>Subtítulo</TableCell>
                                <TableCell>Imagen</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleNews.map((newsItem: News) => (
                                <TableRow
                                    key={newsItem.id}
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
                                    onClick={() => handleView(newsItem.id)}
                                >
                                    <TableCell>{newsItem.id}</TableCell>
                                    <TableCell>{truncateText(newsItem.title, 5)}</TableCell>
                                    <TableCell>{truncateText(newsItem.subtitle, 5)}</TableCell>
                                    <TableCell>
                                        {newsItem.image_url && (
                                            <Avatar
                                                src={buildImageUrl(newsItem.image_url)}
                                                variant="square"
                                                sx={{ width: 56, height: 56 }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{truncateText(newsItem.image_description, 5)}</TableCell>
                                    <TableCell>
                                        {new Date(newsItem.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(newsItem.id);
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
                                                    handleEdit(newsItem.id);
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
                                                    handleDeleteClick(newsItem);
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
                                    count={news.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Noticias por página:"
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
                    {newsToDelete && (
                        <Typography>
                            ¿Estás seguro que deseas eliminar la noticia "{truncateText(newsToDelete.title, 10)}"?
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

export default NewsListPage;