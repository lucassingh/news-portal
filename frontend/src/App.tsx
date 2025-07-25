import { BrowserRouter } from "react-router-dom"
import ThemeConfig, { themePalette } from "./config/Theme.config"
import { AppRouter } from "./router/router"
import { ThemeProvider } from "@mui/material"
import { SnackbarProvider } from 'notistack';

function App() {

    return (
        <BrowserRouter>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                style={{
                    fontFamily: themePalette.FONT_GLOBAL,
                    marginTop: '75px',
                    fontSize: '0.875rem',
                }}
            >
                <ThemeProvider theme={ThemeConfig}>
                    <AppRouter />
                </ThemeProvider>
            </SnackbarProvider>
        </BrowserRouter>
    )
}

export default App
