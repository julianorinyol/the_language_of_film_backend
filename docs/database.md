Exploring the database locally. 

In Terminal
# find the mongo container's id
```$> docker container ls
$> docker exec -it 50d28ab991e0 bash
>mongo
>use my_database
>show collections
>db.films.find()```