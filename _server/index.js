// Copyright: Thomas Frank, Node Hill 2020
// MIT-licensed

const www = process.argv[2];
let port = +process.argv[3];
if (isNaN(port)) { port = 3000; }
if (!www) {
  console.log('Please tell the server which application to run:');
  console.log('npm start nameOfFolder [portnumber]\n');
  process.exit();
}

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const express = require('express');
const open = require('open');
const chokidar = require('chokidar');
const compression = require('compression')
const autoloader = require('./autoloader');

require('all-that-sass')({
  reportCompiles: true,
  watch: path.resolve(www + '/sass'),
  input: path.resolve(www + '/sass/style.scss'),
  output: path.resolve(`_server/static-www-files/css/${www}-style.css`)
});

const www2 = path.resolve(__dirname, '../' + www);
const staticFiles = path.resolve(__dirname, 'static-www-files');

const app = express();
app.use(compression());

app.all('/sass/*', (req, res) => {
  res.send('<pre>You are not allowed to see the SASS source in a browser.</pre>');
});

app.all('/databases/*', (req, res) => {
  res.send('<pre>You are not allowed to see the databases in a browser.</pre>');
});

app.get('/css/style.css', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static-www-files', 'css', `${www}-style.css`));
});

app.get('/README.md', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'README.md'));
});

app.use(express.static(staticFiles));
app.use(express.static(www2));
app.use(express.json());

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

let chokTime = Date.now();
chokidar.watch([www, 'sass']).on('all', async () => {
  if (Date.now() - chokTime > 500) {
    await sleep(1500);
    hotChangeRes && hotChangeRes.end();
    chokTime = Date.now();
  }
});

app.get('/js/all.js', async (req, res) => {
  res.send(await autoloader());
});

let hotChangeRes;
app.get('/hotchanges', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  hotChangeRes = res;
});

let db;
app.post('/sql', (req, res) => {
  if (req.body.sqlQuery.toLowerCase().slice(0, 4) === 'use ') {
    let dbName = req.body.sqlQuery.slice(4);
    if (!dbName.includes('.db')) { dbName += '.db'; }
    db = new sqlite3.Database(path.resolve(__dirname, '../' + www, 'databases', dbName));
    res.json([]);
    return;
  }
  else if (!db) {
    res.json({ error: 'First tell us which db to use: USE dbname' });
    return;
  }
  db.all(
    req.body.sqlQuery, req.body.sqlParams || [],
    (err, result) => {
      if (err) {
        res.status(500);
        res.json({ error: err })
      }
      else { res.json(result); }
    }
  );
});

let sassError = {};
let orgWarn = console.warn;
console.warn = function (...args) {
  let error = args.join('');
  if (error.includes('SASS')) {
    sassError = { error };
    let tempFile = path.resolve(www, '___sass_error');
    fs.writeFileSync(tempFile, '', 'utf-8');
    setTimeout(() => fs.unlinkSync(tempFile), 2000);
  }
  orgWarn.apply(console, args)
}
let orgLog = console.log;
let hasOpened;
console.log = function (...args) {
  let log = args.join('');
  if (log.includes('SASS')) {
    sassError = {};
    !hasOpened && open(`http://localhost:${port}`);
    hasOpened = true;
  }
  orgLog.apply(console, args);
}
app.get('/sass-error', (req, res) => {
  res.json(sassError);
});

app.get('*', async (req, res) => {
  if (req.url.includes('.js')) {
    res.status(404);
    res.send('Not found.');
    return;
  }
  res.sendFile(path.resolve(__dirname, 'static-www-files', 'index.html'));
});

app.listen(port);
console.log(`Open http://localhost:${port} in your browser\n`);