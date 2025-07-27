import { Box, Typography, Container, Avatar, Tooltip, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../../../hooks/useNews';
import { buildImageUrl } from '../../../../utils/helpers';
import { CiEdit, CiEraser, CiSquareChevLeft } from 'react-icons/ci';
import { IconButton } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../interfaces/user';
import theme from '../../../config/Theme.config';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

export const NewsViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const { news, removeNews } = useNews();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const newsItem = news.find(item => item.id === parseInt(id || ''));

    if (!newsItem) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h4">Noticia no encontrada</Typography>
            </Container>
        );
    }

    const formattedDate = new Date(newsItem.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleEdit = () => {
        navigate(`/news/edit/${newsItem.id}`);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!newsItem) return;

        try {
            await removeNews(newsItem.id);
            enqueueSnackbar(`Noticia "${newsItem.title}" eliminada correctamente`, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                }
            });
            setDeleteDialogOpen(false);
            navigate('/news');
        } catch (err) {
            console.error('Error deleting news:', err);
            enqueueSnackbar(`Error al eliminar la noticia "${newsItem.title}"`, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                }
            });
        }
    };

    return (
        <>
            <Button
                startIcon={<CiSquareChevLeft size={40} />}
                onClick={() => navigate('/news')}
                sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                }}
            >
                Volver al listado
            </Button>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {newsItem.image_url && (
                    <Box sx={{
                        mb: 4,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3
                    }}>
                        <img
                            src={buildImageUrl(newsItem.image_url)}
                            alt={newsItem.image_description}
                            style={{
                                width: '100%',
                                maxHeight: '60vh',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-news.jpg';
                            }}
                        />
                    </Box>
                )}

                {/* Título */}
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.2,
                        color: 'text.primary'
                    }}
                >
                    {newsItem.title}
                </Typography>

                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        mb: 4,
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        fontWeight: 300,
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}
                >
                    {newsItem.subtitle}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 6,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2
                }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                        }}
                    >
                        Publicado el {formattedDate}
                    </Typography>

                    {user?.role === UserRole.ADMIN && (
                        <Box>
                            <Tooltip title="Editar">
                                <IconButton
                                    onClick={handleEdit}
                                    color="primary"
                                    sx={{ ml: 1 }}
                                >
                                    <CiEdit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                <IconButton
                                    onClick={handleDelete}
                                    color="error"
                                    sx={{ ml: 1 }}
                                >
                                    <CiEraser />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                {/* Cuerpo de la noticia */}
                <Box
                    sx={{
                        '& h1, & h2, & h3': {
                            margin: '1.5rem 0 1rem',
                            lineHeight: 1.3,
                        },
                        '& p': {
                            marginBottom: '1.5rem',
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                            textAlign: 'justify',
                        },
                        '& ul, & ol': {
                            paddingLeft: '2rem',
                            marginBottom: '1.5rem',
                        },
                        '& li': {
                            marginBottom: '0.5rem',
                        },
                        '& blockquote': {
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                            paddingLeft: '1.5rem',
                            margin: '1.5rem 0',
                            fontStyle: 'italic',
                            color: 'text.secondary',
                        },
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            margin: '1.5rem auto',
                            display: 'block',
                        },
                        '& a': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                        },
                        '& p:first-of-type:first-letter': {
                            float: 'left',
                            fontSize: '4.5rem',
                            lineHeight: 0.8,
                            fontWeight: 'bold',
                            marginRight: '0.5rem',
                            marginTop: '0.3rem',
                            color: 'text.primary',
                        },
                    }}
                    dangerouslySetInnerHTML={{ __html: newsItem.body }}
                />

                <Divider sx={{ my: 6 }} />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4
                }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main'
                        }}
                    >
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Equipo Editorial
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.role === UserRole.ADMIN ? 'Editor' : 'Redactor'}
                        </Typography>
                    </Box>
                </Box>
            </Container>

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
                    <Typography>
                        ¿Estás seguro que deseas eliminar la noticia "{newsItem?.title}"?
                    </Typography>
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
        </>
    );
};
