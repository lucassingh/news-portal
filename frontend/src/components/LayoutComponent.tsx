import React from 'react';
import { Container } from '@mui/material';
import { NavbarComponent } from './NavbarComponent';

interface LayoutProps {
    children: React.ReactNode;
}

export const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {

    return (
        <><NavbarComponent />
            <Container sx={{ mt: 4 }}>{children}</Container>
        </>
    );
};