import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import express from 'express';
const app = express();
const { json, urlencoded, static: expressStatic } = express;
import multer from 'multer';
const upload = multer({ dest: 'files/' });

const filesDir = join(__dirname, 'files');
if (!existsSync(filesDir)) {
    mkdirSync(filesDir);
}
app.use(json());
app.use(urlencoded({ extended: true }));

// Gör katalogen 'files/' tillgänglig som en statisk resurs
app.use('/files', expressStatic('files'));

const messages = [];

// Funktion för att rensa oanvända bilder
function cleanUpUnusedImages() {
    const usedImages = messages.map((message) => message.image);
    const files = readdirSync(join(__dirname, 'files'));

    files.forEach((file) => {
        if (!usedImages.includes(file)) {
            unlinkSync(join(__dirname, 'files', file)); // Ta bort filen
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

export function getMessages(req, res) {
    res.send('Get messages');
}

export function sendMessage(req, res) {
    res.send('Send message');
}
