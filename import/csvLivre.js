var csv = require('csv');
var fs = require('fs');
var cpt = 0;
var Livreliste = fs.createReadStream(__dirname + '/user/exp_dump.caes_livres.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['ref', 'auteur', 'titre', 'genre', 'date_achat', 'lien_image', 'mis_hs', 'rayonnage']
});
var transformer = csv.transform(function(data){
  return data;
});

Livreliste.pipe(parser).pipe(transformer);
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
  var new_ref;
  while(data = transformer.read()){
    switch(data.ref.length){
      case 4: new_ref='20'+data.ref; break;
      case 3: new_ref='200'+data.ref; break;
      case 2: new_ref='2000'+data.ref; break;
      case 1: new_ref='20000'+data.ref; break;
    }
    
    var newLivre = {
      'title' : data.titre,
      'auteur' : data.auteur,
      'dewey' : data.genre,
      'ref' : parseInt(new_ref),
      'date_acquis' : data.date_achat,
      'cote' : data.rayonnage,
      'emprunt' : {
        user: null,
        date_debut : null,
        date_fin : null
      },
      'historique' : [],
			'resume' : null,
			'tags' : null,
			'old_ref' : parseInt(data.ref)

    }
    if(data.mis_hs !== '0000-00-00' && data.mis_hs !== 'NULL'){
      newLivre.date_hors_circu = data.mis_hs;
    }
    // var match = data.lien_image.match(/\ /);
    if(data.lien_image.split('\ ')){
      var images = data.lien_image.split('\ ');
      data.lien_image = images[0];
    }
    if(data.lien_image && data.lien_image !== 'NULL'){
     newLivre.lien_image = 'packages/livres/upload/'+ data.lien_image;
    }else{
      newLivre.lien_image = 'packages/default.jpg'
    }

    //création code barre
    var refString = data.ref.toString();
    var middle = '00000000000'.substring(0,11-refString.length);
    var code_barre = '2'+middle+refString;
    var sommePair = 0;
    var sommeImpair = 0;
    for(var i = 0; i<12; i++){
      if(i % 2 === 0){
        sommeImpair+=parseInt(code_barre.charAt(i));
      }else{
        sommePair+=parseInt(code_barre.charAt(i));
      }
    }
    var tmp = sommePair*3+sommeImpair;
    tmp = tmp % 10;
    var cle = (10 - tmp) % 10;
    code_barre+=cle;
    newLivre.code_barre = code_barre;
    fs.appendFileSync('Livre.json', JSON.stringify(newLivre)+ '\n');
    // console.log(newLivre);
    // console.log('cpt' + cpt);
  }
});
