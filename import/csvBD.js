var csv = require('csv');
var fs = require('fs');
var cpt = 0;
var BDliste = fs.createReadStream(__dirname + '/user/exp_dump.caes_bd.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['titre', 'dessinateur', 'scenariste', 'editeur', 'genre', 'ref', 'date_achat', 'lien_image', 'mis_hs', 'rayonnage']
});
var transformer = csv.transform(function(data){
  return data;
});

BDliste.pipe(parser).pipe(transformer);
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
      case 4: new_ref='10'+data.ref; break;
      case 3: new_ref='100'+data.ref; break;
      case 2: new_ref='1000'+data.ref; break;
      case 1: new_ref='10000'+data.ref; break;
    }
    
    var newBD = {
      'title' : data.titre,
      'dessinateur' : data.dessinateur,
      'scenariste' : data.scenariste,
      'editeur' : data.editeur,
      'dewey' : data.genre,
      'ref' : parseInt(new_ref),
      'rayonnage' : data.rayonnage,
      'old_ref' : parseInt(data.ref),
      'emprunt' : {
        user: null,
        date_debut : null,
        date_fin : null
      },
      'historique' : []
    }
    if(data.date_achat !== '0000-00-00' && data.date_achat !== 'NULL'){
      newBD.date_acquis = new Date(data.date_achat);
    } 
    if(data.mis_hs !== '0000-00-00' && data.mis_hs !== 'NULL'){
      newBD.date_hors_circu = new Date(data.mis_hs);
    }
    // var match = data.lien_image.match(/\ /);
    var images = data.lien_image.split('\ ');
    if(images){
      data.lien_image = images[0];
    }
    if(data.lien_image && data.lien_image !== 'NULL'){
     newBD.lien_image = 'packages/bds/upload/'+ data.lien_image;
    }else{
      newBD.lien_image = 'packages/default.jpg'
    }

    //création code barre
    var refString = data.ref.toString();
    var middle = '00000000000'.substring(0,11-refString.length);
    var code_barre = '1'+middle+refString;
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
    newBD.code_barre = code_barre;
    fs.appendFileSync('bd.json', JSON.stringify(newBD)+ '\n');
    // console.log(newBD);
    // console.log('cpt' + cpt);
  }
});
