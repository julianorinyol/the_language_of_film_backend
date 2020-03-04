## Exploring the database locally. 

### Find the mongo container's id
```$> docker container ls
$> docker exec -it 50d28ab991e0 bash
>mongo
>use language_of_film_db
>show collections
>db.films.find()
```


## Database Schema

```words
- word
- language_id

languages: 
- language:

phrases
- film_id
- time_in_film
- language
- phrase

phrases_words
- word_id
- phrase_id

users
- name
- email
- **todo authentication: password_hash, reset_token, etc. 

rewiews (which words/phrases the user knows)
- object_id (can refer to a word or a phrase)
- object_type: string "phrase" or "word"
- number_minutes_until_next_review:  (self rated value. proxy for how well you know it)

languages_users
- user_id
- language_id
- learning: bool
- skill_level: 1-5 where 5 is fluent.

films_users
- user_id
- film_id
```
