import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
import { CiImageOn } from 'react-icons/ci';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { sanitizeHTML } from '../../../../utils/helpers';
import { useNews } from '../../../hooks/useNews';
import RichTextEditor from '../../../components/RichTextEditor';

const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    subtitle: Yup.string().required('El subtítulo es requerido'),
    image_description: Yup.string().required('La descripción de la imagen es requerida'),
});

export const NewsEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { news, editNews } = useNews();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const newsItem = news.find(item => item.id === parseInt(id || ''));

    // Función para inicializar el formulario
    const initializeForm = useCallback(() => {
        if (!newsItem) return;

        return {
            title: newsItem.title,
            subtitle: newsItem.subtitle,
            image_description: newsItem.image_description,
            body: newsItem.body,
        };
    }, [newsItem]);

    const formik = useFormik({
        initialValues: initializeForm() || {
            title: '',
            subtitle: '',
            image_description: '',
            body: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (!newsItem) return;

            setIsSubmitting(true);
            try {
                const sanitizedBody = sanitizeHTML(values.body);
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('subtitle', values.subtitle);
                formData.append('image_description', values.image_description);
                formData.append('body', sanitizedBody);

                if (imageFile) {
                    formData.append('image', imageFile);
                }

                await editNews(newsItem.id, formData);

                enqueueSnackbar(`La noticia con el id ${newsItem.id} se actualizó correctamente`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                });

                navigate('/news');
            } catch (error) {
                enqueueSnackbar(`La noticia con el id ${newsItem.id} no se pudo actualizar correctamente`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                });
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!newsItem) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4">Noticia no encontrada</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'regular' }}>
                Editar Noticia
            </Typography>

            <Paper elevation={3} sx={{ p: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                    {/* Campo para la imagen */}
                    <Box sx={{ mb: 3 }}>
                        <input
                            accept="image/*"
                            id="image-upload"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CiImageOn />}
                                fullWidth
                                sx={{ py: 2 }}
                            >
                                Cambiar Imagen Principal
                            </Button>
                        </label>
                        {imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxHeight: 200,
                                        maxWidth: '100%',
                                        borderRadius: '4px',
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Título */}
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Título"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        sx={{ mb: 3 }}
                    />

                    {/* Subtítulo */}
                    <TextField
                        fullWidth
                        id="subtitle"
                        name="subtitle"
                        label="Subtítulo"
                        value={formik.values.subtitle}
                        onChange={formik.handleChange}
                        error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
                        helperText={formik.touched.subtitle && formik.errors.subtitle}
                        sx={{ mb: 3 }}
                        multiline
                        rows={2}
                    />

                    {/* Descripción de la imagen */}
                    <TextField
                        fullWidth
                        id="image_description"
                        name="image_description"
                        label="Descripción de la imagen (para accesibilidad)"
                        value={formik.values.image_description}
                        onChange={formik.handleChange}
                        error={formik.touched.image_description && Boolean(formik.errors.image_description)}
                        helperText={formik.touched.image_description && formik.errors.image_description}
                        sx={{ mb: 3 }}
                    />

                    {/* Editor de texto enriquecido */}
                    <Box sx={{
                        mb: 3,
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Contenido de la noticia
                        </Typography>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0
                        }}>
                            <RichTextEditor
                                value={formik.values.body}
                                onChange={(content) => formik.setFieldValue('body', content)}
                            />
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 3,
                        marginTop: '60px'
                    }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/news')}
                            sx={{ minWidth: 120 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{ minWidth: 120 }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Actualizar Noticia'
                            )}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};