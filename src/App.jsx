import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import Container from '@mui/material/Container';

import MainContent from "./components/MainContent";
function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "IBM",
    },
  });
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <ThemeProvider theme={theme}>
          <Container maxWidth="xl">
            <MainContent />
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
