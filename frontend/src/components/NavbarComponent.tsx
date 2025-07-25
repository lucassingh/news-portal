import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Button,
    useMediaQuery,
    useTheme,
    Avatar
} from '@mui/material';
import { CiMenuFries } from "react-icons/ci";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../interfaces/user';
import logo from '../assets/logo.png';
import { themePalette } from '../config/Theme.config';

export const NavbarComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleMenuClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Función para obtener las iniciales del email
    const getInitials = (email: string) => {
        if (!email) return '';
        // Tomar las dos primeras letras antes del @
        const usernamePart = email.split('@')[0];
        return usernamePart.substring(0, 2).toUpperCase();
    };

    return (
        <AppBar position="static" sx={{
            backgroundColor: themePalette.LIGHT,
            boxShadow: 'none',
            px: { xs: 2, md: 4 }
        }}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 !important'
            }}>
                <Box
                    component={Link}
                    to="/news"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: 60, height: 60, marginRight: 8 }}
                    />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'regular',
                            fontFamily: theme.typography.h1.fontFamily,
                            color: themePalette.PRIMARY,
                        }}
                    >
                        Portal de noticias
                    </Typography>
                </Box>

                {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            component={Link}
                            to="/news"
                            color="inherit"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                padding: '8px',
                                backgroundColor: isActive('/news') ? themePalette.TERTIARY : 'inherit',
                                color: isActive('/news') ? themePalette.BACKGROUND : themePalette.PRIMARY,
                                '&:hover': {
                                    backgroundColor: themePalette.TERTIARY,
                                    color: themePalette.BACKGROUND
                                }
                            }}
                        >
                            Noticias
                        </Button>

                        {user?.role === UserRole.ADMIN && (
                            <Button
                                component={Link}
                                to="/users"
                                color="inherit"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    padding: '8px',
                                    backgroundColor: isActive('/users') ? themePalette.TERTIARY : 'inherit',
                                    color: isActive('/users') ? themePalette.BACKGROUND : themePalette.PRIMARY,
                                    '&:hover': {
                                        backgroundColor: themePalette.TERTIARY,
                                        color: themePalette.BACKGROUND
                                    }
                                }}
                            >
                                Usuarios
                            </Button>
                        )}

                        {user && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: themePalette.EXTRA2,
                                        color: themePalette.BACKGROUND,
                                        width: 36,
                                        height: 36,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {getInitials(user.email)}
                                </Avatar>
                                <Typography variant="body1" sx={{ color: themePalette.PRIMARY }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: themePalette.PRIMARY,
                                padding: '8px',
                                border: `1px solid ${themePalette.TERTIARY}`,
                                '&:hover': {
                                    backgroundColor: themePalette.TERTIARY,
                                    color: themePalette.BACKGROUND
                                }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Box>
                )}

                {isMobile && (
                    <>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                        >
                            <CiMenuFries color={themePalette.TERTIARY} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                component={Link}
                                to="/news"
                                onClick={handleMenuClose}
                                sx={{
                                    backgroundColor: isActive('/news') ? themePalette.TERTIARY : 'inherit',
                                    color: isActive('/news') ? themePalette.BACKGROUND : 'inherit',
                                    '&:hover': {
                                        backgroundColor: themePalette.TERTIARY,
                                        color: themePalette.BACKGROUND
                                    }
                                }}
                            >
                                Noticias
                            </MenuItem>

                            {user?.role === UserRole.ADMIN && (
                                <MenuItem
                                    component={Link}
                                    to="/users"
                                    onClick={handleMenuClose}
                                    sx={{
                                        backgroundColor: isActive('/users') ? themePalette.TERTIARY : 'inherit',
                                        color: isActive('/users') ? themePalette.BACKGROUND : 'inherit',
                                        '&:hover': {
                                            backgroundColor: themePalette.TERTIARY,
                                            color: themePalette.BACKGROUND
                                        }
                                    }}
                                >
                                    Usuarios
                                </MenuItem>
                            )}

                            <MenuItem onClick={handleLogout}>
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};