var csv = require('csv');
var fs = require('fs');
var cpt = 0;
var BDliste = fs.createReadStream(__dirname + '/user/exp_dump.caes_dvd.csv');
fs.unlink('dvd.json');
var parser = csv.parse({
  delimiter: ';',
  columns: ['ref', 'ref_adav', 'titre', 'annee', 'realisateur', 'acteurs', 'resume', 'info', 'genre', 'duree', 'date_achat', 'lien_image', 'mis_hs', 'rayonnage'],
  relax: true
});
var transformer = csv.transform(function(data) {
  return data;
});

BDliste.pipe(parser).pipe(transformer);
// parser.on('readable', function(){
//   while(data = parser.read()){
//     transformer.write(data);
//   }
// });

parser.on('error', function(err) {
  console.log(err);
});

transformer.on('error', function(err) {
  console.log(err);
});

transformer.on('readable', function() {
  var new_ref;
  var genre;
  while (data = transformer.read()) {
    switch (data.ref.length) {
      case 4:
        new_ref = '50' + data.ref;
        break;
      case 3:
        new_ref = '500' + data.ref;
        break;
      case 2:
        new_ref = '5000' + data.ref;
        break;
      case 1:
        new_ref = '50000' + data.ref;
        break;
    }
    switch (data.genre) {
      case 'ANI':
        genre = 'Animation';
        break;
      case 'AVE':
        genre = 'Aventure/Action';
        break;
      case 'COM':
        genre = 'Comédie';
        break;
      case 'CDR':
        genre = 'Comédie dramatique';
        break;
      case 'DOC':
        genre = 'Documentaire';
        break;
      case 'FAN':
        genre = 'Fantastique/Horreur';
        break;
      case 'HIS':
        genre = 'Historique/Guerre';
        break;
      case 'MUS':
        genre = 'Musical';
        break;
      case 'POL':
        genre = 'Policier/Suspense';
        break;
      case 'SFI':
        genre = 'Science Fiction';
        break;
      case 'THE':
        genre = 'Théatre';
        break;
      case 'WES':
        genre = 'Western';
        break;
    }
    var newDVD = {
      'title': data.titre,
      'realisateur': data.realisateur,
      'acteur': data.acteurs,
      'dewey': genre,
      'old_deway': data.genre,
      'annee': data.annee,
      'duree': data.duree,
      'resume': data.resume,
      'info': data.info,
      'ref': parseInt(new_ref),
      'ref_adav': parseInt(data.ref_adav),
      'rayonnage': data.rayonnage,
      'old_ref': data.ref,
      'emprunt': {
        user: null,
        date_debut: null,
        date_fin: null
      },
      'historique': []
    }
    if (data.date_achat !== '0000-00-00' && data.date_achat !== 'NULL') {
      newDVD.date_acquis = new Date(data.date_achat);
    }
    if (data.mis_hs !== '0000-00-00' && data.mis_hs !== 'NULL') {
      newDVD.date_hors_circu = new Date(data.mis_hs);
    }
    // var match = data.lien_image.match(/\ /);
    console.log(data);
    var images;
    if (data.lien_image) {
      images = data.lien_image.split(' ');
      if (images.length > 0) {
        data.lien_image = images[0];
      }
      if (data.lien_image && data.lien_image !== 'NULL') {
        newDVD.lien_image = 'packages/dvds/upload/' + data.lien_image;
      } else {
        newDVD.lien_image = 'packages/dvds/upload/default.jpg'
      }
    }

    //création code barre
    var refString = data.ref.toString();
    var middle = '00000000000'.substring(0, 11 - refString.length);
    var code_barre = '5' + middle + refString;
    var sommePair = 0;
    var sommeImpair = 0;
    for (var i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        sommeImpair += parseInt(code_barre.charAt(i));
      } else {
        sommePair += parseInt(code_barre.charAt(i));
      }
    }
    var tmp = sommePair * 3 + sommeImpair;
    tmp = tmp % 10;
    var cle = (10 - tmp) % 10;
    code_barre += cle;
    newDVD.code_barre = code_barre;
    fs.appendFileSync('dvd.json', JSON.stringify(newDVD) + '\n');
    // console.log(newDVD);
    // console.log('cpt' + cpt);
  }
});