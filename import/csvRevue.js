var csv = require('csv');
var fs = require('fs');
var cpt = 0;
var cpt_ref=1;
var listeRevues=[];
var BDliste = fs.createReadStream(__dirname + '/user/exp_dump.caes_revues_tries.csv');
var parser = csv.parse({
    delimiter: ',',
    columns:  ['ref', 'titre', 'date_achat', 'lien_image', 'mis_hs', 'rayonnage']
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
  console.log(err.stack);
});

transformer.on('error', function(err){
  console.log(err.stack);
});

transformer.on('readable', function(){
	var new_ref;
	while(data = transformer.read()){
	   switch(cpt_ref.toString().length){
      case 4: new_ref='40'+cpt_ref.toString(); break;
      case 3: new_ref='400'+cpt_ref.toString(); break;
      case 2: new_ref='4000'+cpt_ref.toString(); break;
      case 1: new_ref='40000'+cpt_ref.toString(); break;
    } 
		cpt_ref++;
		var newRevue = {
      'title' : data.titre,
      'code_barre' : 1,
      'nom_revue' : data.titre.split(' :')[0],
      'Hors_serie' : false,
      'emprunt' : {
        user: null,
        date_debut : null,
        date_fin : null
      },
			'date_acquis' : null,
			'date_hors_circu' : null,
			'lien_image' : null,
			'ref' : parseInt(new_ref),
      'old_ref' : data.ref,
			'tags' : null,
      'historique' : []
    }
		var newLR={
			'nom' : data.titre.split(' :')[0].split(' -')[0],
			'date_abo' : new Date() ,
    	'date_renouvellement' : new Date()
    }
		var n=data.titre.match(/ [nN][\.°o]? ?[0-9]+/g);
		if(n!=null){
		var m=n[0].match(/[0-9]+/g);
			if(m!=null){
				//console.log(m[0]);
				newRevue.numero=parseInt(m[0]);
			}
		}
		//debut code_barre
		console.log(data.ref.substring(0,3));
		switch(data.ref.substring(0,3)){
			case 'AAM':
				newRevue.code_barre='401';
				break;
			case 'AED':
				newRevue.code_barre='402';
				break;
			case 'CVF':
				newRevue.code_barre='403';
				break;
			case 'DEF':
				newRevue.code_barre='404';
				break;
			case 'EDP':
				newRevue.code_barre='405';
				break;
			case 'GEO':
				newRevue.code_barre='406';
				break;
			case 'IJA':
				newRevue.code_barre='407';
				break;
			case '60M':
				newRevue.code_barre='408';
				break;
			case 'OIN':
				newRevue.code_barre='409';
				break;
			case 'QCH':
				newRevue.code_barre='410';
				break;
			case 'SEA':
				newRevue.code_barre='411';
				break;
			case 'STM':
				newRevue.code_barre='412';
				break;
			case 'ADJ':
				newRevue.code_barre='413';
				break;
			case 'CIM':
				newRevue.code_barre='414';
				break;
			case 'CDA':
				newRevue.code_barre='415';
				break;
			case 'LIR':
				newRevue.code_barre='416';
				break;
			case 'PSY':
				newRevue.code_barre='417';
				break;
		}
		//console.log(data.ref.substring(3,7));
		newRevue.code_barre+=data.ref.substring(3,7);
		if(data.ref.substring(7,9) == 'HO' || data.ref.substring(7,9) == 'HS'){
			newRevue.code_barre+='00';
			newRevue.Hors_serie=true;
		}else{
			//console.log(data.ref.substring(7,10));
			switch(data.ref.substring(7,10)){
				case 'JAN':
					newRevue.code_barre+='01';
					break;
				case 'FEV':
					newRevue.code_barre+='02';
					break;
				case 'MAR':
					newRevue.code_barre+='03';
					break;
				case 'AVR':
					newRevue.code_barre+='04';
					break;
				case 'MAI':
					newRevue.code_barre+='05';
					break;
				case 'JIN':
					newRevue.code_barre+='06';
					break;
				case 'JUI':
					newRevue.code_barre+='07';
					break;
				case 'AOU':
					newRevue.code_barre+='08';
					break;
				case 'SEP':
					newRevue.code_barre+='09';
					break;
				case 'OCT':
					newRevue.code_barre+='10';
					break;
				case 'NOV':
					newRevue.code_barre+='11';
					break;
				case 'DEC':
					newRevue.code_barre+='12';
					break;				
			}
		}
		newRevue.code_barre+='000';
		var sommePair = 0;
    var sommeImpair = 0;
    for(var i = 0; i<12; i++){
      if(i % 2 === 0){
        sommeImpair+=parseInt(newRevue.code_barre.charAt(i));
      }else{
        sommePair+=parseInt(newRevue.code_barre.charAt(i));
      }
    }
		newRevue.code_barre+=(10-((sommePair*3+sommeImpair)%10));
		//fin code_barre

    if(data.date_achat !== '0000-00-00' && data.date_achat !== 'NULL'){
      newRevue.date_acquis = new Date(data.date_achat);
    } 
    if(data.mis_hs !== '0000-00-00' && data.mis_hs !== 'NULL'){
      newRevue.date_hors_circu = new Date(data.mis_hs);
    }
    // var match = data.lien_image.match(/\ /);
    var images = data.lien_image.split('\ ');
    if(images){
      data.lien_image = images[0];
    }
    if(data.lien_image && data.lien_image !== 'NULL'){
     newRevue.lien_image = 'packages/revues/upload/'+ data.lien_image;
    }else{
      newRevue.lien_image = 'packages/revues/upload/default.jpg'
    }

    fs.appendFileSync('revue.json', JSON.stringify(newRevue)+ '\n');
		var free =true;
		for(var i=0;i<listeRevues.length;i++){
			if(newLR.nom==listeRevues[i].nom){
				free=false;
				break;
			}
		}
		// if(free){
		// 	console.log(newLR.nom);
		// 	listeRevues.push(newLR);
		// 	fs.appendFileSync('listeRevues.json', JSON.stringify(newLR)+ '\n');
		// }
    // console.log(newRevue);
    // console.log('cpt' + cpt);
  }
});
