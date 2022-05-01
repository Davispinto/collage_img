const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
  })
);

app.use(express.static("web"));

//se crea una carpeta pública del servidor llamada imagen 
app.use("/imgs", express.static(__dirname + "/imagen"));

//ruta GET / que devuelve el formulario
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web/formulario.html");
});

//ruta GET / que devuelve el archivo collage
app.get("/imagen", (req, res) => {
  res.sendFile(__dirname + "/web/collage.html");
});

//ruta POST / recibe y almacena una imagen en una carpeta pública del servidor
app.post("/imagen", (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  target_file.mv(`${__dirname}/imagen/imagen-${posicion}.jpg`, (error) => {
    error ? res.send("Ocurrio un error al subir la imagen") : res.redirect("/imagen");
  });
});

//ruta GET /deleteImg/:nombre toma como parametro el nombre de una imagen y la elimina de la carpeta publica
//se ocupa get debido a ser un link <a> 
app.get("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/imagen/${nombre}`, (error) => {
    error
      ? res.send(`
      <h2>Ocurrio un error al eliminar la imagen</br> <a href="/collage.html" style="text-decoration:none">Volver</a></h2>
      <style>
      body {
        background-color: black;
        color: white;
        text-align: center;
        padding: 10px;
      }
    </style>
    `)
      : res.redirect("/imagen");
  });
});

app.listen(port, () => console.log(`Servidor activo en el puerto: ${port}`));