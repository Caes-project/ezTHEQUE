var csv = require('csv');
var fs = require('fs');
var crypto = require('crypto');
var userListe = fs.createReadStream(__dirname + '/user/exp_dump.caes_user.csv');
var parser = csv.parse({
    delimiter: ';',
    columns:  ['id_user', 'nom', 'prenom', 'email', 'group', 'username', 'mdp', 'date_maj', 'commentaire', 'BD_1', 'date_i_BD', 'date_fin_BD', 'Livres_1', 'date_i_Livres', 'date_fin_Livres' , 'CD_1', 'date_i_CD', 'date_fin_CD', 'mag_1', 'date_i_mag', 'date_fin_mag', 'DVD_1', 'date_i_DVD', 'date_fin_DVD']                                          
});
//console.log('debut');
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
  //console.log('transformer');
  while(data = transformer.read()){

    var newUser = {
      'username' : data.username,
      'email' : data.email,
      'name' : data.nom + ' ' + data.prenom,
      'roles' : ['authenticated'],
      'hashed_password' : data.mdp,
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
    if(data.date_fin_DVD !== '0000-00-00' && data.date_fin_DVD !== 'NULL'){
      newUser.DVD = new Date(data.date_fin_DVD);
    } 
    if(data.date_fin_CD !== '0000-00-00' && data.date_fin_CD !== 'NULL'){
      newUser.CD = new Date(data.date_fin_CD);
    } 
    if(data.date_fin_Livres !== '0000-00-00' && data.date_fin_Livres !== 'NULL'){
      newUser.livre_mag_revue = new Date(data.date_fin_Livres);
    }
    if(data.date_maj !== '0000-00-00' && data.date_maj !== 'NULL'){
      newUser.date_maj = new Date(data.date_maj);
    }

		var salt=makeSalt();
		newUser.salt=salt;
		newUser.hashed_password=hashPassword(data.mdp,salt);
		//console.log(newUser);
		fs.appendFileSync('user.json', JSON.stringify(newUser)+ '\n');
  }
});

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  function makeSalt() {
    return crypto.randomBytes(16).toString('base64');
  }

  /**
   * Hash password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  function hashPassword(password,salt) {
    if (!password || !salt) return '';
    var salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
