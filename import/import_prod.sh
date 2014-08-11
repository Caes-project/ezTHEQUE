node import_prod.js
mongoimport --db mean-prod --collection users user.json
mongoimport --db mean-prod --collection livres Livre.json
mongoimport --db mean-prod --collection dvds dvd.json
mongoimport --db mean-prod --collection bds bd.json
mongoimport --db mean-prod --collection revues revue.json
mongoimport --db mean-prod --collection cds cd.json
node csvEmprunt_prod.js