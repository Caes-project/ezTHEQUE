mongo mean-dev --quiet --eval "db.livres.find({'test':1},{'_id':0,'code_barre':1}).forEach(function(value){print(tojson(value))})" > .temp
while read line
	do
	echo "db.livres.remove($line)"
	mongo mean-dev --quiet --eval "db.livres.remove($line)"
done < .temp
rm .temp

mongo mean-prod --quiet --eval "db.livres.find({'test':1},{'_id':0,'code_barre':1}).forEach(function(value){print(tojson(value))})" > .temp
while read line
	do
	echo "db.livres.remove($line)"
	mongo mean-prod --quiet --eval "db.livres.remove($line)"
done < .temp
rm .temp

mongo mean-dev --quiet --eval "db.users.find({'test':1},{'_id':0,'email':1}).forEach(function(value){print(tojson(value))})" > .temp
while read line
	do
	echo "db.users.remove($line)"
	mongo mean-dev --quiet --eval "db.users.remove($line)"
done < .temp
rm .temp

mongo mean-prod --quiet --eval "db.users.find({'test':1},{'_id':0,'email':1}).forEach(function(value){print(tojson(value))})" > .temp
while read line
	do
	echo "db.users.remove($line)"
	mongo mean-prod --quiet --eval "db.users.remove($line)"
done < .temp
rm .temp
