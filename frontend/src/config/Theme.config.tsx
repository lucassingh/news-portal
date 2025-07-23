import { createTheme } from '@mui/material/styles';

export const themePalette = {
    PRIMARY: '#00214a',
    SECONDARY: '#ba0001',
    TERTIARY: '#0068ff',
    LIGHT: '#E7EAF1',
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
            main: themePalette.PRIMARY
        },
        secondary: {
            main: themePalette.SECONDARY
        },
        success: {
            main: themePalette.TERTIARY
        },
        info: {
            main: themePalette.LIGHT
        },
        warning: {
            main: themePalette.DARK
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
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: themePalette.BACKGROUND,
                    color: themePalette.DARK,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                }
            }
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 500
                },
                contained: {
                    color: themePalette.SECONDARY,
                    '&:hover': {
                        backgroundColor: '#a30000' // Un tono más oscuro del secondary
                    }
                },
                outlined: {
                    color: themePalette.PRIMARY,
                    borderColor: themePalette.PRIMARY,
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderColor: themePalette.PRIMARY,
                        backgroundColor: 'rgba(0, 33, 74, 0.04)',
                        borderWidth: '1.5px'
                    }
                },
                text: {
                    '&:hover': {
                        backgroundColor: 'rgba(0, 33, 74, 0.04)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: themePalette.DARK,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                        color: themePalette.PRIMARY,
                        textDecoration: 'underline'
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: themePalette.LIGHT
                        },
                        '&:hover fieldset': {
                            borderColor: themePalette.LIGHT
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: themePalette.PRIMARY,
                            borderWidth: '1.5px'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: themePalette.DARK
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: themePalette.PRIMARY
                    }
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: themePalette.LIGHT
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: themePalette.BACKGROUND,
                    color: themePalette.DARK
                }
            }
        }
    }
});

export default theme;