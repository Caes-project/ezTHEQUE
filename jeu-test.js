var db = connect('localhost/mean-dev');
var cursor = db.livres.find();
while ( cursor.hasNext() ) {
   printjson( cursor.next() );
}