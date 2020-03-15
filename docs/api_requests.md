
curl localhost:8000/api/v1/films

curl -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbkBibGEuY29tIiwiaWF0IjoxNTg0Mjg1ODQ5fQ.HvA_RFt2hUUhyUSQbTwmvTYgE5h2-pXtpY8UbHJDClI" localhost:8000/api/v1/films

curl localhost:8000/api/v1/films/5e6e47fe7340a500811b801c


 curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"julian@bla.com","password":"password123"}' \
  http://localhost:8000/api/v1/login