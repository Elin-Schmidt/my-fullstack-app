const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'files/' });

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gör katalogen 'files/' tillgänglig som en statisk resurs
app.use('/files', express.static('files'));

const messages = [];

// Funktion för att rensa oanvända bilder
function cleanUpUnusedImages() {
    const usedImages = messages.map((message) => message.image);
    const files = fs.readdirSync(path.join(__dirname, 'files'));

    files.forEach((file) => {
        if (!usedImages.includes(file)) {
            fs.unlinkSync(path.join(__dirname, 'files', file)); // Ta bort filen
        }
    });
}

app.get('/messages', (req, res) => {
    const messageList = messages
        .map(
            (message) => `
        <dt>${message.name}</dt>
        <dd>${message.text}</dd>
        <dd>
          <img src="/files/${message.image}" alt="Image" width="100">`
        )
        .join('');

    res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Meddelandeformulär</title>
  </head>
  <body>
    <h1>Posta ett meddelande</h1>
    <form action="http://localhost:8080/messages" enctype="multipart/form-data" method="post">
      <label>
        Namn:
        <input name="name" placeholder="Namn" value="">
      </label>
      <label>
        Text:
        <input name="text" placeholder="Text" value="">
      </label>
      <label>
        Bild:
        <input name="image" type="file">
      </label>
      <input type="submit" value="Skicka">
    </form>
    <h2>Meddelanden</h2>
    <dl>
      ${messageList}
    </dl>
  </body>
</html>`);
});

app.post('/messages', upload.single('image'), (req, res) => {
    const data = req.body;
    const file = req.file;

    if (data.name && data.text && file) {
        messages.push({
            name: data.name,
            text: data.text,
            image: file.filename
        });
    }

    // Rensa oanvända bilder efter att ett nytt meddelande har lagts till
    cleanUpUnusedImages();

    res.redirect('/messages');
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
