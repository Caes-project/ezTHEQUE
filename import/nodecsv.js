var csv = require('csv');
var fs = require('fs');
var tabUser = {};
var userListe = fs.createReadStream(__dirname + '/user/exp_dump.caes_user.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['id_user', 'nom', 'prenom', 'email', 'group', 'username', 'mdp', 'date_maj', 'commentaire', 'BD_1', 'date_i_BD', 'date_fin_BD', 'Livres_1', 'date_i_Livres', 'date_fin_Livres' , 'CD_1', 'date_i_CD', 'date_fin_CD', 'mag_1', 'date_i_mag', 'date_fin_mag', 'DVD_1', 'date_i_DVD', 'date_fin_DVD']                                          
});
console.log('debut');
var transformer = csv.transform(function(data){
  return data;
});

userListe.pipe(parser).pipe(transformer);
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
    var newUser = {
      'username' : data.username,
      'email' : data.email,
      'name' : data.prenom + ' ' + data.nom,
      'roles' : ['authenticated'],
      'hashed_password' : data.mdp,
      'date_maj' : data.date_maj,
      'livre_mag_revue' : data.date_fin_Livres,
      'DVD' : data.date_fin_DVD,
      'CD' : data.date_fin_CD,
      'paiement' : null,
      'caution' : null,
      'provider' : 'local',
      'salt' : null,
      'emprunt' : [],
      'historique' : [],
      'id_user' : data.id_user
    }
    if(data.group === 'admin'){
      newUser.roles.push('admin');
    }
    tabUser[data.id_user] = newUser;
    fs.appendFileSync('user.json', JSON.stringify(newUser)+ '\n');
    console.log(data);
  }
});