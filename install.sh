#!/bin/sh
set -e
if [ "$(id -u)" != "0" ]
	then
	echo "Ce script a besoin des droits sudo => sudo ./install.sh"
  	exit 1
else
	if [ "$http_proxy" = "" ]
		then
		default_proxy="http://proxyout.inist.fr:8080"
	else
		default_proxy=$http_proxy
	fi
	echo -n "=> Installation de git, nodejs, npm et mongodb"
	apt-get update > /dev/null 2>&1 || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : apt-get update" && exit 1) 
	(echo "" | apt-get install git nodejs npm mongodb > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : apt-get install git nodejs npm mongodb" && exit 1) 
	echo -n "Etes vous derriere un proxy ? [y/N] : "
	read proxy_bool
	if [ "$proxy_bool" = "y" ]
		then
		echo -n "Entrez l'adresse du proxy (laissez vide pour le proxy par defaut => $default_proxy) : "
		read proxy_name
		if [ "$proxy_name" = "" ]
			then
			echo "Le proxy par defaut sera utilise ($default_proxy)"
			http_proxy=$default_proxy
		fi
		echo -n "=> Configuration des regles pour le proxy web"
		npm config set https-proxy "$http_proxy" || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : npm config set https-proxy $http_proxy" && exit 1) 
		npm config set proxy "$http_proxy" || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : npm config set proxy $http_proxy" && exit 1)
		export http_proxy
		export https_proxy="$http_proxy" 
		export HTTP_PROXY="$http_proxy"
		export HTTPS_PROXY="$http_proxy"
		(git config --global http.proxy "$http_proxy" && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : git config --global http.proxy $http_proxy" && exit 1) 
	fi
	echo -n "=> Creation du lien symbolique \"node\" vers \"nodejs\""
	(ln -s /usr/bin/nodejs /usr/bin/node > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 3)attention$(tput sgr0) : un fichier/lien symbolique \"/usr/bin/node\" existe deja verifiez qu'il renvoie bien vers \"/usr/bin/nodejs\"")
	
	if [ -d "ezTHEQUE" ]
		then
		echo -n "=> Mise a jour du projet"
		cd ezTHEQUE
		(git pull > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : impossible de mettre a jour du projet" && exit 1) 
	else
		echo -n "=> Recuperation des sources du projet"
		(git clone https://github.com/Caes-project/ezTHEQUE.git ezTHEQUE > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : impossible de recuperer les sources du projet via git clone" && exit 1) 
		cd ezTHEQUE
	fi
	echo -n "=> Installation de bower, MEAN et grunt dans le repertoire de l'application"
	(npm install -g bower meanio@latest grunt-cli > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : npm install bower meanio@latest grunt-cli" && exit 1)
	
	echo -n "=> Configuration redirection de git://github.com vers https://github.com" 
	(git config --global url.https://github.com/.insteadOf git://github.com/ > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : ajout redirection git://github.com vers https://github.com")	
	echo -n "=> Installation des dependances"
	npm install > /dev/null 2>&1 || (echo "" echo "$(tput setaf 1)echec$(tput sgr0) : installation des dependances" && exit 1)
	(bower --allow-root install > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : execution du gestionnaire bower" && exit 1)	
	echo -n "=> Test de fonctionnement de l'application"
	(npm test > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || ((npm test > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : un ou plusieurs tests ont echoue" && exit 1))
	if [ -f "data_set.sh" ]
		then
		echo -n "Un jeu de donnees est disponible voulez vous l'importer ? [y/N] : "
		read data_import
		if [ "$data_import" = "y" ]
			then
			echo -n "=> Inportation du jeu de donnees"
			./data_set.sh > /dev/null 2>&1 || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : impossible d'importer les donnees" && exit 1)
			cd jeu-test
			(tar xvf image.tar.gz -C ../packages/livres/upload > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : impossible d'extraire les images" && exit 1)
			cd ..
			echo "par defaut l'application est en mode developpement, pour utiliser le jeu de donnees passer l'application en mode production grace à \"export NODE_ENV=production\""
			echo "le compte administrateur a pour email : admin@admin.com et comme mot de passe : password"
		fi
	fi
	echo -n "=> changement du proprietaire du repertoire : $SUDO_USER"	
	(chown -R $SUDO_USER . > /dev/null 2>&1 && echo "$(tput setaf 2) ✓$(tput sgr0)") || (echo "" && echo "$(tput setaf 1)echec$(tput sgr0) : changement de proprietaire" && exit 1)
	echo "L'installation et tous les tests sont reussis."
	echo "Vous pouvez des maintenant utiliser ezTHEQUE."
	echo "Faites \"cd ezTHEQUE\",puis la commande \"./node_modules/.bin/grunt\" dans le dossier de l'application."
	echo "Une fois lancer vous pourrez y acceder via http://localhost:3000"
fi				
