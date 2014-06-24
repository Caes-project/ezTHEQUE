#!/bin/sh
set -e
if [ "$(id -u)" != "0" ]
	then
	echo "Ce script a besoin des droits sudo => sudo ./install.sh"
  	exit 1
else
	default_proxy="proxyout.inist.fr"
	default_port=8080

	echo "=> Installation de git, nodejs, npm et mongodb"
	apt-get update > /dev/null 2>&1 || (echo "echec : apt-get update" && exit 1) 
	(echo "" | apt-get install git nodejs npm mongodb > /dev/null 2>&1) || (echo "echec : apt-get install git nodejs npm mongodb" && exit 1) 
	echo -n "Etes vous derriere un proxy ? [y/N] : "
	read proxy_bool
	if [ "$proxy_bool" = "y" ]
		then
		echo -n "Entrez l'adresse du proxy (laissez vide pour le proxy par defaut => $default_proxy:$default_port) : "
		read proxy_name
		if [ "$proxy_name" = "" ]
			then
			echo "Le proxy par defaut sera utilise ($default_proxy:$default_port)"
			proxy_name=$default_proxy
			proxy_port=$default_port
		else
			echo -n "Entrez le port du proxy : "
			read proxy_port
		fi
		echo "=> Configuration des regles pour le proxy web"
		npm config set https-proxy "http://$proxy_name:$proxy_port" || (echo "echec : npm config" && exit 1) 
		npm config set proxy "http://$proxy_name:$proxy_port" || (echo "echec : npm config" && exit 1) 
		git config --global http.proxy "http://$proxy_name:$proxy_port" || (echo "echec : git config" && exit 1) 
	fi
	echo "=> Creation du lien symbolique \"node\" vers \"nodejs\""
	ln -s /usr/bin/nodejs /usr/bin/node > /dev/null 2>&1 || echo "warning : un fichier/lien symbolique \"/usr/bin/node\" existe deja verifiez qu'il renvoie bien vers \"/usr/bin/nodejs\""
	echo "=> Recuperation des sources du projet"
	git clone https://github.com/Caes-project/ezTHEQUE.git ezTHEQUE > /dev/null 2>&1 || (echo "echec : git clone" && exit 1) 
	cd ezTHEQUE
	echo "=> Installation de bower, MEAN et grunt dans le repertoire de l'application"
	npm install bower meanio@latest grunt-cli > /dev/null 2>&1 || (echo "echec : npm install bower meanio@latest grunt-cli" && exit 1)
	if [ "$proxy_bool" = "y" ]
		then
		echo "=> Edition du fichier .bowerrc"
		echo "{" > .bowerrc || (echo "echec : impossible de modifier .bowerrc" && exit 1) 
		echo "\t\"directory\": \"public/system/lib\"," >> .bowerrc
		echo "\t\"storage\": {" >> .bowerrc
		echo "\t\t\"packages\": \".bower-cache\"," >> .bowerrc
		echo "\t\t\"registry\": \".bower-registry\"" >> .bowerrc
		echo "\t}," >> .bowerrc
		echo "\t\"tmp\": \".bower-tmp\"," >> .bowerrc
		echo "\t\"proxy\" : \"http://$proxy_name:$proxy_port\"," >> .bowerrc
		echo "\t\"https-proxy\" : \"http://$proxy_name:$proxy_port\"," >> .bowerrc
		echo "\t\"strict-ssl\": false" >> .bowerrc
		echo "}" >> .bowerrc
	fi
	echo "=> Configuration redirection de git://github.com vers https://github.com" 
	git config --global url.https://github.com/.insteadOf git://github.com/ > /dev/null 2>&1 || echo "echec : ajout redirection git://github.com vers https://github.com"	
	echo "=> Installation des dependances"
	npm install > /dev/null 2>&1 || (echo "echec : installation des dependances" && exit 1)
	./node_modules/bower/bin/bower --allow-root install wd=./ > /dev/null 2>&1 || (echo "echec : execution du gestionnaire bower" && exit 1)
	echo "=> Test de fonctionnement de l'application"
	npm test > /dev/null 2>&1 || (echo "echec : un ou plusieurs tests ont echoue" && exit 1)
	echo "=> changement du proprietaire du repertoire : $SUDO_USER"	
	chown -R $SUDO_USER . > /dev/null 2>&1 || (echo "echec : changement de proprietaire" && exit 1)
	echo "L'installation et tous les tests sont reussis.\nVous pouvez des maintenant utiliser ezTHEQUE en utilisant la commande \"./node_modules/.bin/grunt\" dans le dossier de l'application.\nUne fois lancer vous pourrez y acceder via http://localhost:3000"
fi				
