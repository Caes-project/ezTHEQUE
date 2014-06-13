#!/bin/sh
if [ "$(id -u)" != "0" ]
	then
	echo "Ce script a besoin des droits sudo => sudo ./install.sh"
  	exit 1
else
	apt-get update	
	apt-get install git nodejs npm mongodb
	echo "Etes vous derriere un proxy ? [y/N] : "
	read proxy_bool
	if [ "$proxy_bool" = "y" ]
		then
		echo "Entrez l'adresse du proxy (laissez vide pour le proxy par defaut) : "
		read proxy_name
		if [ "$proxy_name" = "" ]
			then
			echo "Le proxy par defaut sera utilise (proxyout.inist.fr:8080)"
			proxy_name="proxyout.inist.fr"
			proxy_port=8080
		else
			echo "Entrez le port du proxy : "
			read proxy_port
		fi
		npm config set https-proxy "http://$proxy_name:$proxy_port"
		npm config set proxy "http://$proxy_name:$proxy_port"
		git config --global http.proxy "http://$proxy_name:$proxy_port"
	fi
	
	ln -s /usr/bin/nodejs /usr/bin/node
	git clone https://github.com/Caes-project/ezTHEQUE.git ezTHEQUE
	path=`pwd`
	cd ezTHEQUE
	npm install bower meanio@latest grunt-cli
	if [ "$proxy_bool" = "y" ]
		then
		echo "{" > .bowerrc
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
	git config --global url.https://github.com/.insteadOf git://github.com/
	npm install
	./node_modules/bower/bin/bower --allow-root install wd=./
	npm test
	chown -R `whoami` .
	echo "Si l'installation et tous les tests sont reussis vous pouvez des maintenant utiliser ezTHEQUE en utilisant la commande \"./node_modules/.bin/grunt\" dans le dossier de l'application, une fois lancer vous pourrez y acceder via http://localhost:3000"
	cd "$path"
fi				
