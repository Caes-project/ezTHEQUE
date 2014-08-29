node import_dev.js
node nodecsv.js 
node csvLivre.js
node csvRevue.js
node csvBD.js
node csvCD.js
node csvDVD.js
mongoimport --db mean-dev --collection users user.json
mongoimport --db mean-dev --collection livres Livre.json
mongoimport --db mean-dev --collection dvds dvd.json
mongoimport --db mean-dev --collection bds bd.json
mongoimport --db mean-dev --collection revues revue.json
mongoimport --db mean-dev --collection cds cd.json
node csvEmprunt.js