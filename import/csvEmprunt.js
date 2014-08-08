var csv = require('csv');
var fs = require('fs');
var tabUser = {};
var empruntListe = fs.createReadStream(__dirname + '/user/exp_dump.caes_pret.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['id_user', 'ref_media', 'typeMedia', 'date_debut', 'date_fin']
});
var transformer = csv.transform(function(data){
  return data;
});
empruntListe.pipe(parser).pipe(transformer);
// parser.on('readable', function(){
//   while(data = parser.read()){
//     transformer.write(data);
//   }
// });

parser.on('error', function(err){
  console.log(err);
});

transformer.on('error', function(err){
  console.log(err);
});

transformer.on('readable', function(){
  console.log('transformer');
  while(data = transformer.read()){
   
    fs.appendFileSync('emprunt.json', + '\n');
    console.log(data);
  }
});

