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

const short_urls = {};
let next_id = 1;

app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;
  const domainName = url.replace(/^https?\:\/\//, "");

  dns.lookup(domainName, function(err, address, family) {
    if (err)
      return res.send({ error: 'invalid url' });

    const id = next_id++;

    short_urls[id] = url;

    res.send({
      original_url: url,
      short_url: id
    });
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const { id } = req.params;

  res.redirect(short_urls[id]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
