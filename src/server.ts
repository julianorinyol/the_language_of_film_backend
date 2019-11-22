import app  from './app';

const port: Number = Number(process.env.PORT)

app.set("port", port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))