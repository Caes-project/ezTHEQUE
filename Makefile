# ezTHEQUE's Makefile

SHELL:=/bin/bash


#install all you need
all: nodejs npm bower mongodb mean npm-install

nodejs: 

	@if which node > /dev/null; \
	then echo 'nodejs déjà installé'; \
	else sudo apt-get install nodejs & echo 'installation de node ...'; \
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

