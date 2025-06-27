require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const dns = require('dns');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bp.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const short_urls = [];

app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;

  dns.lookup(url, function(err, address, family) {
    if (err)
      return res.send({ error: 'invalid url' });

    short_urls.push(url);

    res.send({
      original_url: url,
      short_url: short_urls.length
    });
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const { id } = req.params;

  res.redirect(short_urls[Number(id) - 1]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
