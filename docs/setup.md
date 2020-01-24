## Create the containers
docker-compose up

## Seed the database (and create the collections)
### SSH in to main container
```
docker exec -it main-api bash
>yarn seed
```
### Check that the API is working

```
curl localhost:8000/api/v1/cards
curl localhost:8000/api/v1/films
curl localhost:8000/api/v1/words
```

### Setup the frontend
https://github.com/julianorinyol/the_language_of_film_frontend
