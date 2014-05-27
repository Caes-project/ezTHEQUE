# ezTHEQUE's Makefile

SHELL:=/bin/bash


#install all you need
all: nvm nodejs npm bower mongodb mean npm-install

nvm:

	curl https://raw.githubusercontent.com/creationix/nvm/v0.7.0/install.sh | sh

nodejs: 

	@if which node > /dev/null; \
	then echo 'nodejs déjà installé'; \
	else echo 'installation de node ...'; \
	nvm install 0.10.28 & nvm use 0.10.28; \
	fi 
	@if which node > /dev/null; \
	then echo ''; \
	else sudo ln -s /usr/bin/nodejs /usr/bin/node & echo 'création lien symbolique ...'; \
	fi

npm:
	
	@if which npm > /dev/null;\
	then echo 'npm déjà installé';\
	else sudo apt-get install npm & echo 'installation de npm ...'; fi

bower:

	@if which bower > /dev/null; \
	then echo 'bower déjà installé'; \
	else sudo npm i -g bower & echo 'installation de bower ...'; fi

mongodb:

	@if which mongo > /dev/null; \
	then echo 'mongo déjà installé';\
	else sudo apt-get install mongodb & echo 'installation de mongo ...'; fi

mean:

	@if which mean > /dev/null; \
	then echo 'mean déjà installé'; \
	else sudo npm i -g mean@latest & echo 'installation de mean ...'; fi
 	
npm-install:

	@if [ `pwd | tail -c 9` != 'ezTHEQUE' ]; \
	then cd ezTHEQUE & npm install; \
	else npm install; fi

