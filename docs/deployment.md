1. gcloud builds submit --tag gcr.io/the-language-of-film-api/first-language-of-film

2. gcloud container images list

3. gcloud run deploy first-language-of-film \
  --image gcr.io/the-language-of-film-api/first-language-of-film \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars=DATABASE_HOST=mongodb+srv://username:urlencodedpassword@host,DATABASE_NAME=test,JWT_SECRET=asdf