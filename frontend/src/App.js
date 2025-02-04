import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import Layout from './components/Layout';
import EventsDisplay from './components/EventsDisplay';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
              </Routes>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <EventsDisplay />
              </Box>
            </Grid>
          </Grid>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
