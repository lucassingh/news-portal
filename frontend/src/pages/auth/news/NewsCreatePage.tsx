import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { CiImageOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { useNews } from '../../../hooks/useNews';

const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    subtitle: Yup.string().required('El subtítulo es requerido'),
    image_description: Yup.string().required('La descripción de la imagen es requerida'),
    body: Yup.string().required('El contenido es requerido')
});

export const NewsCreatePage = () => {
    const navigate = useNavigate();
    const { addNews } = useNews();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            subtitle: '',
            image_description: '',
            body: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('subtitle', values.subtitle);
                formData.append('image_description', values.image_description);
                formData.append('body', values.body);

                if (imageFile) {
                    formData.append('image', imageFile);
                }

                await addNews(formData);
                enqueueSnackbar('Noticia creada exitosamente', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
                navigate('/news');
            } catch (error) {
                enqueueSnackbar('Error al crear la noticia', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

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

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'regular' }}>
                Crear Nueva Noticia
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
                            required
                        />
                        <label htmlFor="image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CiImageOn />}
                                fullWidth
                                sx={{ py: 2 }}
                            >
                                Subir Imagen Principal
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
                                        borderRadius: '4px'
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

                    {/* Cuerpo de la noticia */}
                    <TextField
                        fullWidth
                        id="body"
                        name="body"
                        label="Contenido de la noticia"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        error={formik.touched.body && Boolean(formik.errors.body)}
                        helperText={formik.touched.body && formik.errors.body}
                        multiline
                        rows={10}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2
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
                                'Publicar Noticia'
                            )}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};