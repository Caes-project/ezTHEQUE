##### Introduction #####

MongoDB est une base de donnée de type noSQL (Not Only SQL), plus précisement de type document.
C'est à dire qu'elle stocke des documents dans un format : BSON, qui lui est propre. 
Le BSON est très proche du JSON. Il a des des fonctions de mongoDB rattaché en plus, par exemple, la méthode save permet de faire une requête au serveur et de sauvegarder le document (ou le mettre à jour).

Donc avec mongoDB nous n'avons pas de MCD (modèle conceptuel des donnée) comme avec les base SQL classique, même si il y a bien sur des tables (appelé collection)
Les collections différent des tables SQL. Les documents qui composent une collection peuvent contenir contrairement à SQL des tableaux, des listes. Chose impossible en SQL.

##### MongoDB sur ezTHEQUE #####

Comme dit ci-dessus il n'a pas de MCD avec mongo mais je vais vous présenter l'implémentation de mongo sur ezTHEQUE.

Nous avons d'abord deux schémas (users et livres) qui vérifient que les documents que l'on crée sont corrects.

Table User

<table>
    <tr>
        <th style="text-align:left;width:140px;">Champ</th>
        <th style="text-align:left;width:80px;">Type</th>
        <th>Commentaire</th>
    </tr>
    <tr>
      <td>name</td>
      <td>String</td>
      <td>Requis</td>
    </tr>
    <tr>
      <td>email</td>
      <td>String</td>
      <td>Requis, sert à l'authentification</td>
    </tr>
    <tr>
      <td>username</td>
      <td>String</td>
      <td>Requis, affiché dans le menu pour gérer son compte</td>
    </tr>
    <tr>
      <td>roles</td>
      <td>Tableau</td>
      <td>Contient la liste des rôles de l'utilisateur
      	<br> (différent du SQL pour le tableau !)
      	<br> Par défaut l'user n'est qu'authentifié</td>
    </tr>
    <tr>
      <td>hashed_password</td>
      <td>String</td>
      <td>Requis, Contient un hash du mot de passe</td>
    </tr>
    <tr>
      <td>emprunt</td>
      <td>Tableau d'objet</td>
      <td>Contient la liste des emprunts de l'utilisateur</td>
    </tr>
    <tr>
      <td>emprunt.id</td>
      <td>type _id mongo</td>
      <td>L'identifiant du livre emprunté</td>
    </tr>
    <tr>
      <td>emprunt.date_debut</td>
      <td>Date</td>
      <td>Date de début</td>
    </tr>
    <tr>
      <td>emprunt.date_fin</td>
      <td>Date</td>
      <td>Date de fin de l'emprunt</td>
    </tr>
</table>

Table Livres
<table>
    <tr>
        <th style="text-align:left;width:140px;">Champ</th>
        <th style="text-align:left;width:80px;">Type</th>
        <th>Commentaire</th>
    </tr>
    <tr>
      <td>title</td>
      <td>String</td>
      <td>Requis</td>
    </tr>
    <tr>
      <td>auteur</td>
      <td>String</td>
      <td>Requis</td>
    </tr>
    <tr>
      <td>dewey</td>
      <td>String</td>
      <td>sert à catégoriser le livre (808, policier)</td>
    </tr>
    <tr>
      <td>date_acquis</td>
      <td>Date</td>
      <td>La date de mise en circulation / achat du livre</td>
    </tr>
    <tr>
      <td>lien_image</td>
      <td>String</td>
      <td>Contient le path vers l'image de couverture du livre</td>
    </tr>
    <tr>
      <td>ref</td>
      <td>Number</td>
      <td>La référence du livre, sert pour les emprunts des livres</td>
    </tr>
    <tr>
      <td>emprunt</td>
      <td>Objet</td>
      <td>user qui contient l'id de l'emprunteur et les dates de début et fin du prêt</td>
    </tr>
</table>


Comme on peux le voir on stocke deux fois les informations liées au prêt. Il y a donc une duplication de donnée qu'il est important de comprendre afin de ne pas faire d'erreur. Il n'y a pas de 3ème "table" prêt par exemple qui ferait le lien entre un livre et son emprunteur.

==== Pourquoi ce choix? ====

J'ai choisi ceci car la duplication n'est génante que si des incohérences viennent se glisser dans la base, par contre les avantages en termes d'accès aux données sont très importants !

Un utilisateur dans la version actuelle de l'application peut consulter la liste des livres disponibles sur le site de la médiathèque et savoir s'ils sont empruntés et quand il seront normalement disponibles. Ici avec notre schéma nous n'avons aucune requête de consultation vers la table prêt pour vérifier si le livre est disponible, nous le savons déjà.

Par contre il faut vraiment faire attention à bien mettre à jour ensemble le livre et son emprunteur. Déjà l'utilisateur (Admin) ne peux pas bidouiller dans les tables et faire n'importe quoi. Il doit forcément passer par les formulaires de l'application pour gérer les emprunts. 
Et pour être sur que les formulaires ont bien leur comportement souhaité nous avons fait plusieurs tests avec [Karma](./test.md)
