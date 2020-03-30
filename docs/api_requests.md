# films
curl -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbkBibGEuY29tIiwiaWF0IjoxNTg0Mjg1ODQ5fQ.HvA_RFt2hUUhyUSQbTwmvTYgE5h2-pXtpY8UbHJDClI" localhost:8000/api/v1/films
curl localhost:8000/api/v1/films/5e6e47fe7340a500811b801c

# login
 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"julian@bla.com","password":"password123"}' \
  http://localhost:8000/api/v1/login

# reviews
curl --header "Content-Type: application/json" \
   --header "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbkBibGEuY29tIiwiaWF0IjoxNTg0NDc4MDM2fQ.ayZCRNpVpCeSHx5fAxHIelInU3RX5turTna3-wjjaTU" \
  --request POST \
  --data '{"itemId":"5e71367d6f69330098106c2c", "itemText": "maldita", "itemType":"word","percentage":75}' \
  http://localhost:8000/api/v1/reviews/



# phrases - add or update many

# does this work?
curl 'http://localhost:8000/api/v1/phrases/add_or_update_many' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbkBibGEuY29tIiwiaWF0IjoxNTg1MjYyMTc2fQ.tDcHVp7hJ3DjHVKlxSFRvT9bTCQ2tqs8CZT65eCKH1s' \
-H 'Content-Type: application/json;charset=UTF-8' \
--request POST \
--data '{"itemId":"5e71367d6f69330098106c2c", "itemText": "maldita", "itemType":"word","percentage":75}'