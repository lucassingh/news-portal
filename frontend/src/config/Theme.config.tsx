import { createTheme } from '@mui/material/styles';

export const themePalette = {
    PRIMARY: '#4972b2',
    SECONDARY: '#25aae1',
    TERTIARY: '#b63e81',
    EXTRA1: '#fcb040',
    EXTRA2: '#39b54a',
    LIGHT: '#d5d5d5',
    DARK: '#1C1C1C',
    BACKGROUND: '#fff',
    FONT_GLOBAL: 'Inter',
    FONT_HEADERS: "Archivo Black"
} as const;

const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: themePalette.BACKGROUND,
        },
        primary: {
            main: themePalette.PRIMARY,
            contrastText: themePalette.BACKGROUND
        },
        secondary: {
            main: themePalette.SECONDARY,
            contrastText: themePalette.BACKGROUND
        },
        success: {
            main: themePalette.TERTIARY,
            contrastText: themePalette.BACKGROUND
        },
        info: {
            main: themePalette.LIGHT,
            contrastText: themePalette.DARK
        },
        warning: {
            main: themePalette.DARK,
            contrastText: themePalette.BACKGROUND
        },
        text: {
            primary: themePalette.DARK,
        }
    },
    typography: {
        fontFamily: themePalette.FONT_GLOBAL,
        h1: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '2.5rem',
            lineHeight: 1.2
        },
        h2: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '2rem'
        },
        h3: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '1.75rem'
        },
        h4: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '1.5rem'
        },
        h5: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '1.25rem'
        },
        h6: {
            fontFamily: themePalette.FONT_HEADERS,
            fontWeight: 'bold',
            color: themePalette.DARK,
            fontSize: '1rem'
        },
        subtitle1: {
            color: '#616161',
            fontSize: '0.875rem'
        },
        body1: {
            lineHeight: 1.6,
            fontSize: '1rem'
        },
        button: {
            textTransform: 'none',
            fontWeight: 500
        }
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    color: themePalette.BACKGROUND,
                    padding: '12px 24px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)'
                    }
                },
            },
            variants: [
                {
                    props: { variant: 'contained' },
                    style: {
                        backgroundColor: themePalette.PRIMARY,
                        '&:hover': {
                            backgroundColor: themePalette.SECONDARY,
                            boxShadow: `0 4px 8px 0 ${themePalette.PRIMARY}80`
                        }
                    }
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        '&:hover': {
                            backgroundColor: themePalette.TERTIARY,
                            boxShadow: `0 4px 8px 0 ${themePalette.SECONDARY}80`
                        }
                    }
                },
                {
                    props: { variant: 'outlined' },
                    style: {
                        border: `2px solid ${themePalette.PRIMARY}`,
                        color: themePalette.PRIMARY,
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: `${themePalette.PRIMARY}10`,
                            border: `2px solid ${themePalette.PRIMARY}`,
                            color: themePalette.PRIMARY
                        }
                    }
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        border: `2px solid ${themePalette.SECONDARY}`,
                        color: themePalette.SECONDARY,
                        '&:hover': {
                            backgroundColor: `${themePalette.SECONDARY}10`,
                            border: `2px solid ${themePalette.SECONDARY}`,
                            color: themePalette.SECONDARY
                        }
                    }
                }
            ]
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'medium',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themePalette.PRIMARY,
                        borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themePalette.SECONDARY,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themePalette.TERTIARY,
                        borderWidth: '2px',
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: themePalette.EXTRA1,
                    },
                },
                input: {
                    color: themePalette.DARK,
                    '&::placeholder': {
                        color: themePalette.LIGHT,
                        opacity: 1,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: themePalette.PRIMARY,
                    '&.Mui-focused': {
                        color: themePalette.TERTIARY,
                    },
                    '&.Mui-error': {
                        color: themePalette.EXTRA1,
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    '&.Mui-error': {
                        color: themePalette.EXTRA1,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: themePalette.PRIMARY,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: `${themePalette.PRIMARY}20`,
                        color: themePalette.DARK,
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: `${themePalette.PRIMARY}30`,
                    },
                    '&:hover': {
                        backgroundColor: `${themePalette.PRIMARY}10`,
                    },
                    // Estilos específicos para menús en AppBar
                    '&.nav-menu-item': {
                        color: themePalette.BACKGROUND,
                        '&:hover': {
                            backgroundColor: themePalette.TERTIARY,
                        },
                        '&.active': {
                            backgroundColor: themePalette.EXTRA1,
                            color: themePalette.DARK,
                            fontWeight: 'bold',
                        },
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: themePalette.PRIMARY,
                    '&.Mui-checked': {
                        color: themePalette.TERTIARY,
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: themePalette.PRIMARY,
                    '&.Mui-checked': {
                        color: themePalette.TERTIARY,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: themePalette.PRIMARY,
                    boxShadow: 'none',
                    padding: '0 24px',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '64px',
                    padding: '0 !important',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: themePalette.BACKGROUND,
                    textDecoration: 'none',
                    fontWeight: 500,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: themePalette.TERTIARY,
                        color: themePalette.BACKGROUND,
                    },
                    '&.active': {
                        backgroundColor: themePalette.EXTRA1,
                        color: themePalette.DARK,
                        fontWeight: 'bold',
                    },
                },
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: themePalette.PRIMARY,
                    marginTop: '8px',
                    border: `1px solid ${themePalette.BACKGROUND}20`,
                },
            },
        },
    }
});

export default theme;