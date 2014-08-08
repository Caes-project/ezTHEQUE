var csv = require('csv');
var fs = require('fs');
var cpt = 0;
var BDliste = fs.createReadStream(__dirname + '/user/exp_dump.caes_cd.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['ref', 'auteur', 'titre', 'editeur', 'interpretes', 'qqch', 'date_achat', 'lien_image', 'mis_hs', 'rayonnage']
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
	var genre;
  while(data = transformer.read()){
		switch(data.ref.substring(0,1)){		
			case 'K':genre='Jazz';break;
			case 'F':genre='Etranger';break;
			case 'A':genre='Français';break;
			case 'E':genre='Enfants';break;
			case 'P':genre='Classique';break;
			case 'T':genre='BO film';break;
			case 'B':genre='Blues';break;
		}
    switch(data.ref.substring(1).length){
      case 4: new_ref='30'+data.ref.substring(1); break;
      case 3: new_ref='300'+data.ref.substring(1); break;
      case 2: new_ref='3000'+data.ref.substring(1); break;
      case 1: new_ref='30000'+data.ref.substring(1); break;
    }
    
    var newCD = {
      'title' : data.titre,
      'auteur' : data.auteur,
      'editeur' : data.editeur,
      'interpretes' : data.interpretes,
      'dewey' : genre,
      'ref' : parseInt(new_ref),
      'rayonnage' : data.rayonnage,
      'old_ref' : data.ref,
      'emprunt' : {
        user: null,
        date_debut : null,
        date_fin : null
      },
      'historique' : []
    }
    if(data.date_achat !== '0000-00-00' && data.date_achat !== 'NULL'){
      newCD.date_acquis = data.date_achat;
    } 
    if(data.mis_hs !== '0000-00-00' && data.mis_hs !== 'NULL'){
      newCD.date_hors_circu = data.mis_hs;
    }
    // var match = data.lien_image.match(/\ /);
    var images = data.lien_image.split('\ ');
    if(images){
      data.lien_image = images[0];
    }
    if(data.lien_image && data.lien_image !== 'NULL'){
     newCD.lien_image = 'packages/cds/upload/'+ data.lien_image;
    }else{
      newCD.lien_image = 'packages/cds/upload/default.jpg'
    }

    //création code barre
    var refString = data.ref.substring(1);
    var middle = '0000000000'.substring(0,8-refString.length);
    var genre_code=(data.ref.charCodeAt(0)-64).toString();
    var top_middle='00000'.substring(0,3-genre_code.length);
    var code_barre = '3'+top_middle+genre_code+middle+refString;
		//console.log(code_barre);
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
    newCD.code_barre = code_barre;
		//console.log(code_barre);
    fs.appendFileSync('cd.json', JSON.stringify(newCD)+ '\n');
    // console.log(newCD);
    // console.log('cpt' + cpt);
  }
});
