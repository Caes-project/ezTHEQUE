var csv = require('csv'),
fs = require('fs'),
mongoose = require('mongoose');
require('../packages/livres/server/models/livre.js');
require('../packages/bds/server/models/bd.js');
require('../packages/cds/server/models/cd.js');
require('../packages/revues/server/models/revue.js');
require('../packages/dvds/server/models/dvd.js');
require('../packages/users/server/models/user.js');
var Livre = mongoose.model('Livre');
var Bd = mongoose.model('Bd');
var Cd = mongoose.model('Cd');
var Revue = mongoose.model('Revue');
var Dvd = mongoose.model('Dvd');
var User = mongoose.model('User');

mongoose.connect('mongodb://localhost/mean-dev');


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

LivreEmprunt = function(tmp, callback){
  console.log(tmp.ref_media);
  Livre.findOne({old_ref: parseInt(tmp.ref_media)}, function(err, livre){
    if(err){ 
      throw err;
    }else{
      console.log('trouvé Livre');
      console.log(livre);
      if(!livre) { return callback()}
      console.log('old_ref user' + tmp.id_user);
      User.findOne({id_user: tmp.id_user}, function(err, user){
        if(err){ 
          throw err;
        }else{
          console.log('trouvé User');
          console.log(user._id);
          livre.emprunt = {
            'user': user._id,
            'date_debut' :  tmp.date_debut,
            'date_fin' : tmp.date_fin   
          }
          user.emprunt.push({ 'id': livre._id,
              'date_debut' :  tmp.date_debut,
              'date_fin' : tmp.date_fin,
              'type' : 'Livres'           
            });
          user.save(function(err, user){
            if(err) throw err;
            livre.save(function(err, user){
              if(err) throw err;
                callback();
            });
          });
          // User.update({'id_user': tmp.id_user}, { $set: 
          //   { 'emprunt.id': livre._id,
          //     'emprunt.date_debut' :  tmp.date_debut,
          //     'emprunt.date_fin' : tmp.date_fin,
          //     'emprunt.type' : 'Livres'           
          //   }}, function(err){
          //     if(err) throw err;
          //     callback();
          // });
        }
      });
    }
  }); 
}

BdEmprunt = function(tmp, callback){
  console.log(tmp.ref_media);
  Bd.findOne({old_ref: parseInt(tmp.ref_media)}, function(err, bd){
    if(err){ 
      throw err;
    }else{
      console.log('trouvé bd');
      console.log(bd);
      if(!bd) { return callback()}
      console.log('old_ref user' + tmp.id_user);
      User.findOne({id_user: tmp.id_user}, function(err, user){
        if(err){ 
          throw err;
        }else{
          console.log('trouvé User');
          console.log(user._id);
          bd.emprunt = {
            'user': user._id,
            'date_debut' :  tmp.date_debut,
            'date_fin' : tmp.date_fin   
          }
          user.emprunt.push({ 'id': bd._id,
              'date_debut' :  tmp.date_debut,
              'date_fin' : tmp.date_fin,
              'type' : 'BD'           
            });
          user.save(function(err, user){
            if(err) throw err;
            bd.save(function(err, user){
              if(err) throw err;
                callback();
            });
          });
          // User.update({'id_user': tmp.id_user}, { $set: 
          //   { 'emprunt.id': bd._id,
          //     'emprunt.date_debut' :  tmp.date_debut,
          //     'emprunt.date_fin' : tmp.date_fin,
          //     'emprunt.type' : 'Livres'           
          //   }}, function(err){
          //     if(err) throw err;
          //     callback();
          // });
        }
      });
    }
  }); 
}

CdEmprunt = function(tmp, callback){
  console.log(tmp.ref_media);
  Cd.findOne({old_ref: tmp.ref_media}, function(err, cd){
    if(err){ 
      throw err;
    }else{
      console.log('trouvé cd');
      console.log(cd);
      if(!cd) { return callback()}
      console.log('old_ref user' + tmp.id_user);
      User.findOne({id_user: tmp.id_user}, function(err, user){
        if(err){ 
          throw err;
        }else{
          console.log('trouvé User');
          console.log(user._id);
          cd.emprunt = {
            'user': user._id,
            'date_debut' :  tmp.date_debut,
            'date_fin' : tmp.date_fin   
          }
          user.emprunt.push({ 'id': cd._id,
              'date_debut' :  tmp.date_debut,
              'date_fin' : tmp.date_fin,
              'type' : 'cd'           
            });
          user.save(function(err, user){
            if(err) throw err;
            cd.save(function(err, user){
              if(err) throw err;
                callback();
            });
          });
          // User.update({'id_user': tmp.id_user}, { $set: 
          //   { 'emprunt.id': cd._id,
          //     'emprunt.date_debut' :  tmp.date_debut,
          //     'emprunt.date_fin' : tmp.date_fin,
          //     'emprunt.type' : 'Livres'           
          //   }}, function(err){
          //     if(err) throw err;
          //     callback();
          // });
        }
      });
    }
  }); 
}

RevueEmprunt = function(tmp, callback){
  console.log(tmp.ref_media);
  Revue.findOne({old_ref: tmp.ref_media}, function(err, revue){
    if(err){ 
      throw err;
    }else{
      console.log('trouvé revue');
      console.log(revue);
      if(!revue) { return callback()}
      console.log('old_ref user' + tmp.id_user);
      User.findOne({id_user: tmp.id_user}, function(err, user){
        if(err){ 
          throw err;
        }else{
          console.log('trouvé User');
          console.log(user._id);
          revue.emprunt = {
            'user': user._id,
            'date_debut' :  tmp.date_debut,
            'date_fin' : tmp.date_fin   
          }
          user.emprunt.push({ 'id': revue._id,
              'date_debut' :  tmp.date_debut,
              'date_fin' : tmp.date_fin,
              'type' : 'revue'           
            });
          user.save(function(err, user){
            if(err) throw err;
            revue.save(function(err, user){
              if(err) throw err;
                callback();
            });
          });
          // User.update({'id_user': tmp.id_user}, { $set: 
          //   { 'emprunt.id': cd._id,
          //     'emprunt.date_debut' :  tmp.date_debut,
          //     'emprunt.date_fin' : tmp.date_fin,
          //     'emprunt.type' : 'Livres'           
          //   }}, function(err){
          //     if(err) throw err;
          //     callback();
          // });
        }
      });
    }
  }); 
}

DvdEmprunt = function(tmp, callback){
  console.log(tmp.ref_media);
  Dvd.findOne({old_ref: tmp.ref_media}, function(err, dvd){
    if(err){ 
      throw err;
    }else{
      console.log('trouvé dvd');
      console.log(dvd);
      if(!dvd) { return callback()}
      console.log('old_ref user' + tmp.id_user);
      User.findOne({id_user: tmp.id_user}, function(err, user){
        if(err){ 
          throw err;
        }else{
          console.log('trouvé User');
          console.log(user._id);
          dvd.emprunt = {
            'user': user._id,
            'date_debut' :  tmp.date_debut,
            'date_fin' : tmp.date_fin   
          }
          user.emprunt.push({ 'id': dvd._id,
              'date_debut' :  tmp.date_debut,
              'date_fin' : tmp.date_fin,
              'type' : 'dvd'           
            });
          user.save(function(err, user){
            if(err) throw err;
            dvd.save(function(err, user){
              if(err) throw err;
                callback();
            });
          });
          // User.update({'id_user': tmp.id_user}, { $set: 
          //   { 'emprunt.id': cd._id,
          //     'emprunt.date_debut' :  tmp.date_debut,
          //     'emprunt.date_fin' : tmp.date_fin,
          //     'emprunt.type' : 'Livres'           
          //   }}, function(err){
          //     if(err) throw err;
          //     callback();
          // });
        }
      });
    }
  }); 
}
var tmp = [];
transformer.on('readable', function(){
  while(data = transformer.read()){
    tmp.push(data);
    // switch (tmp.typeMedia){
    //   case 'livres' : LivreEmprunt(tmp); break;
    // }
    // fs.appendFileSync('emprunt.json', + '\n');
    // console.log(data);
  }
});

transformer.on('finish', function(){
  var recursivite = function(){
    var emprunt = tmp.pop();
    if(!emprunt){
      process.exit(0);
    }

     switch (emprunt.typeMedia){
      case 'livres' : LivreEmprunt(emprunt, recursivite); break;
      case 'BD' : BdEmprunt(emprunt, recursivite); break;
      case 'CD' : CdEmprunt(emprunt, recursivite); break;
      case 'revues' : RevueEmprunt(emprunt, recursivite); break;
      case 'DVD' : DvdEmprunt(emprunt, recursivite); break;
      default: recursivite(); break;
    } 
  };
  recursivite();
});

