#!/bin/sh
set -e
if [ "$(id -u)" != "0" ]
	then
	echo "Ce script a besoin des droits sudo => sudo ./install.sh"
  	exit 1
else
	default_proxy="proxyout.inist.fr"
	default_port=8080

	echo -n "=> Installation de git, nodejs, npm et mongodb"
	apt-get update > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : apt-get update" && exit 1) 
	(echo "" | apt-get install git nodejs npm mongodb > /dev/null 2>&1) || (echo "$(tput setaf 1)echec$(tput sgr0) : apt-get install git nodejs npm mongodb" && exit 1) 
	echo "$(tput setaf 2) ✓$(tput sgr0)"
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
		echo -n "=> Configuration des regles pour le proxy web"
		npm config set https-proxy "http://$proxy_name:$proxy_port" || (echo "$(tput setaf 1)echec$(tput sgr0) : npm config set https-proxy http://$proxy_name:$proxy_port" && exit 1) 
		npm config set proxy "http://$proxy_name:$proxy_port" || (echo "$(tput setaf 1)echec$(tput sgr0) : npm config set proxy http://$proxy_name:$proxy_port" && exit 1) 
		git config --global http.proxy "http://$proxy_name:$proxy_port" || (echo "$(tput setaf 1)echec$(tput sgr0) : git config --global http.proxy http://$proxy_name:$proxy_port" && exit 1)
		echo "$(tput setaf 2) ✓$(tput sgr0)" 
	fi
	echo -n "=> Creation du lien symbolique \"node\" vers \"nodejs\""
	(ln -s /usr/bin/nodejs /usr/bin/node > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || echo "" && echo "$(tput setaf 3)attention$(tput sgr0) : un fichier/lien symbolique \"/usr/bin/node\" existe deja verifiez qu'il renvoie bien vers \"/usr/bin/nodejs\""
	
	if [ -d "ezTHEQUE" ]
		then
		echo -n "=> Mise a jour du projet"
		cd ezTHEQUE
		git pull > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : impossible de mettre a jour du projet" && exit 1) 
		echo "$(tput setaf 2) ✓$(tput sgr0)"
	else
		echo -n "=> Recuperation des sources du projet"
		git clone https://github.com/Caes-project/ezTHEQUE.git ezTHEQUE > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : impossible de recuperer les sources du projet via git clone" && exit 1) 
		cd ezTHEQUE
		echo "$(tput setaf 2) ✓$(tput sgr0)"
	fi
	echo -n "=> Installation de bower, MEAN et grunt dans le repertoire de l'application"
	npm install bower meanio@latest grunt-cli > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : npm install bower meanio@latest grunt-cli" && exit 1)
	echo "$(tput setaf 2) ✓$(tput sgr0)"
	if [ "$proxy_bool" = "y" ]
		then
		echo -n "=> Edition du fichier .bowerrc"
		echo "{" > .bowerrc || (echo "$(tput setaf 1)echec$(tput sgr0) : impossible de modifier le fichier .bowerrc" && exit 1) 
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
		echo "$(tput setaf 2) ✓$(tput sgr0)"
	fi
	echo -n "=> Configuration redirection de git://github.com vers https://github.com" 
	git config --global url.https://github.com/.insteadOf git://github.com/ > /dev/null 2>&1 || echo "$(tput setaf 1)echec$(tput sgr0) : ajout redirection git://github.com vers https://github.com"
	echo "$(tput setaf 2) ✓$(tput sgr0)"	
	echo -n "=> Installation des dependances"
	npm install > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : installation des dependances" && exit 1)
	./node_modules/bower/bin/bower --allow-root install wd=./ > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : execution du gestionnaire bower" && exit 1)
	echo "$(tput setaf 2) ✓$(tput sgr0)"
	echo -n "=> Test de fonctionnement de l'application"
	npm test > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : un ou plusieurs tests ont echoue")
	echo "$(tput setaf 2) ✓$(tput sgr0)"
	if [ -f "data_set.sh" ]
		then
		echo -n "Un jeu de donnees est disponible voulez vous l'importer ? [y/N] : "
		read data_import
		if [ "$data_import" = "y" ]
			then
			echo -n "=> Inportation du jeu de donnees"
			./data_set.sh > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : impossible d'importer les donnees" && exit 1)
			cd public
			tar xvf image.tar.gz > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : impossible d'extraire les images" && exit 1)
			cd ..
			echo "$(tput setaf 2) ✓$(tput sgr0)"
			echo "par defaut l'application est en mode developpement, pour utiliser le jeu de donnees passer l'application en mode production grace à \"export NODE_ENV=production\""
			echo "le compte administrateur a pour email : admin@admin.com et comme mot de passe : password"
		fi 
	fi
	echo -n "=> changement du proprietaire du repertoire : $SUDO_USER"	
	chown -R $SUDO_USER . > /dev/null 2>&1 || (echo "$(tput setaf 1)echec$(tput sgr0) : changement de proprietaire" && exit 1)
	echo "$(tput setaf 2) ✓$(tput sgr0)"	
	echo "L'installation et tous les tests sont reussis."
	echo "Vous pouvez des maintenant utiliser ezTHEQUE, faites \"cd ezTHEQUE\" puis la commande \"./node_modules/.bin/grunt\" dans le dossier de l'application."
	echo "Une fois lancer vous pourrez y acceder via http://localhost:3000"
fi				
