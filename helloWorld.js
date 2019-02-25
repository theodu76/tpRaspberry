var express = require('express');
var bodyParser = require('body-parser');

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
        jsonList[i] = JSON.parse(content[i]);
        console.log(jsonList[i]);
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
  fs.appendFile('fichier-data.json', str2, (err) => {
    if (err) throw err;
    console.log('Un nouvel élément a été rajouté au fichier !');
    res.status(204).end();
  });
});


app.get('/', function(req, res) {
  const promise = readFile('fichier-data.json').then( (result) => {
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