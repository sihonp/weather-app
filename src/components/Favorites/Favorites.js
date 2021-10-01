import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { URL } from '../../redux/actions'
import { API_KEY } from '../../redux/actions'
import { Container, Grid, Card, IconButton, CardMedia, CircularProgress } from '@material-ui/core';
import useStyles from "./styles";
import { converter, padNum } from '../../helpers';
import { removeFavorite } from '../../redux/actions/favoritesActions';
import FavoriteIcon from '@material-ui/icons/Favorite';

const Favorites = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const convertTempUnits = useSelector(state => state.temperature);

    const [favoriteArray, setFavoriteArray] = useState([]);
    const favorites = useSelector(state => state.favoritesArray)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getFavorites = async () => {
            setLoading(true)
            const favoritesData = {}
            for await (let favorite of favorites) {
                const response = await axios.get(`${URL}currentconditions/v1/${favorite.id}?apikey=${API_KEY}`)
                favoritesData[favorite.id] = response.data[0]
            }
            setFavoriteArray(favoritesData)
            await setLoading(false)
        }
        getFavorites()
    }, [favorites]);

    if (loading) {
        return (
            <div className={classes.noFav} ><CircularProgress /></div>
        )
    }

    if (favorites.length === 0) {
        return (
            <div className={classes.noFav} ><h2>No Favorites Selected</h2></div>
        )
    }

    return (
        <Container >
            <Grid container spacing={2} className={classes.gridContainer} justifyContent="center">
                {favorites.map((favorite, index) =>
                    <Card key={index} className={classes.card}>
                        <Grid container alignItems="center">
                            <Grid item xs={9} className={classes.cityName}>
                                {favorite.name}
                            </Grid>
                            <Grid item xs={3} className={classes.icon}>
                                <IconButton onClick={() => dispatch(removeFavorite(favorite.id))}><FavoriteIcon className={classes.favIcon} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <div>Currently</div>
                        <br />
                        <Grid className={classes.weatherStatus}>
                            {favoriteArray[favorite.id].WeatherText}
                        </Grid>
                        <Grid container alignItems="center">
                            <Grid item xs={9} className={classes.weatherTemp}>
                                {convertTempUnits ? `${Math.trunc(favoriteArray[favorite.id].Temperature.Imperial.Value)}\xB0` : converter(favoriteArray[favorite.id].Temperature.Imperial.Value)}
                            </Grid>
                            <Grid item xs={3} >
                                <CardMedia className={classes.media} image={`https://developer.accuweather.com/sites/default/files/${padNum(favoriteArray[favorite.id].WeatherIcon)}-s.png`} />
                            </Grid>
                        </Grid>
                    </Card>
                )}
            </Grid>
        </Container>
    )
}

export default Favorites
