var express = require('express');
var bodyParser = require('body-parser');

const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
const portArduino = new serialport('/dev/ttyACM0', {baudRate: 9600});

const parser = new Readline();
portArduino.pipe(parser);

parser.on('data', line => {
    try{
      if(JSON.parse(line)) {
        fs.appendFile('texte', line+'\n', (err) => {
        if (err) throw err;
        });
      }
    }
    catch(e){
    }
  });

var app = express();

const hostname = '127.0.0.1';
const port = 3000;

var fs = require('fs');
function readFile(file){
  return new Promise((resolve, reject) => {
    jsonList = [];
    fs.readFile(file, 'utf8', function(err, data){
      content=data.split("\n");
      for (var i in content){
	try{
	  jsonList[i] = JSON.parse(content[i]);
          console.log(jsonList[i]);
        }
	catch(e){
        }
      }
      resolve(jsonList);
    });
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); //il sera utilisé partout

app.post('/', function(req, res) {
  req.body.temperature = parseFloat(req.body.temperature);
  req.body.humidity = parseFloat(req.body.humidity);
  str = JSON.stringify(req.body);
  str2 = '\n'+str;
  console.log(str);
  console.log(req.body);
  fs.appendFile('texte', str2, (err) => {
    if (err) throw err;
    console.log('Un nouvel élément a été rajouté au fichier !');
    res.status(204).end();
  });
});


app.get('/', function(req, res) {
  const promise = readFile('texte').then( (result) => {
    res.render('affichageDonnees.ejs', {donnees : result});
    },
    (err) => {
    res.render('Une erreur s\'est produite !');
    }
    );

});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});