import { createTheme } from "@mui/material";


declare module '@mui/material/styles' {
    interface Theme {}
}

 // =============================================================================================== 
 //   LIGHT THEME
 // =============================================================================================== 
export const light_theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: '#826aed'
        }, 
        secondary: {
            main: '#c879ff'
        },
    },
});

 // =============================================================================================== 
 //   DARK THEME
 // =============================================================================================== 
export const dark_theme = createTheme({
    palette: {
        mode: "dark", 
        primary: {
            main: '#3c3c3b',
        }, 
        secondary: {
            main: '#341948'
        },
    },
});