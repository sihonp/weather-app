import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Routes from './routes';
import { useDispatch } from 'react-redux';
import { getGeoposition } from './redux/actions/geopositionActions';
import { Paper } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const App = () => {
  const dispatch = useDispatch()

  const [toggleDark, settoggleDark] = useState(false);
  const theme = createTheme({
    palette: {
      type: toggleDark ? "dark" : "light",
    },
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      dispatch(getGeoposition(position.coords.latitude, position.coords.longitude)),
    )
  }, [dispatch])

  return (
    <ThemeProvider theme={theme} >
      <Paper style={{ minHeight: "100vh" }}>
        <Header toggleDark={toggleDark}
          settoggleDark={settoggleDark} />
        <Routes />
      </Paper>
    </ThemeProvider>
  )
}

export default App
