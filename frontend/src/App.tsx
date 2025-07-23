import { BrowserRouter } from "react-router-dom"
import ThemeConfig from "./config/Theme.config"
import { AppRouter } from "./router/router"
import { ThemeProvider } from "@mui/material"

function App() {

    return (
        <BrowserRouter>
            <ThemeProvider theme={ThemeConfig}>
                <AppRouter />
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
