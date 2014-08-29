mongoexport -db mean-dev --collection livres --out ./export/livres.json
mongoexport -db mean-dev --collection users --out ./export/users.json
mongoexport -db mean-dev --collection bds --out ./export/bds.json
mongoexport -db mean-dev --collection cds --out ./export/cds.json
mongoexport -db mean-dev --collection dvds --out ./export/dvds.json
mongoexport -db mean-dev --collection revues --out ./export/revues.json

mongoexport --db mean-dev --collection revues --csv -f title,code_barre,date_acquis,date_hors_circu,ref,tags --out ./export/revues.csv
mongoexport --db mean-dev --collection dvds --csv -f title,realisateur,acteur,annee,duree,code_barre,info,dewey,date_acquis,date_hors_circu,ref,ref_adav,resume,tags --out ./export/dvds.csv
mongoexport --db mean-dev --collection bds --csv -f title,scenariste,dessinateur,code_barre,editeur,dewey,date_acquis,date_hors_circu,ref,cote,resume,tags --out ./export/bds.csv
mongoexport --db mean-dev --collection users --csv -f name,email,livre_mag_revue,DVD,CD,caution,paiement,emprunt --out ./export/users.csv
mongoexport --db mean-dev --collection cds --csv -f title,auteur,editeur,interpretes,code_barre,dewey,date_acquis,date_hors_circu,ref,resume,tags --out ./export/cds.csv
mongoexport --db mean-dev --collection livres --csv -f title,auteur,code_barre,dewey,date_acquis,date_hors_circu,ref,cote,resume,tags --out ./export/livres.csv
