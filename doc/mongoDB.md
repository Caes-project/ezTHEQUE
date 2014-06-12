##### Introduction #####

MongoDB est une base de donnée de type noSQL (Not Only SQL) et plus précisement mongoDB est une base de donnée de type document.
C'est à dire qu'elle stock des documents dans son propre format le BSON. 
Le BSON est très proche du JSON il a des des fonctions de mongoDB rattaché en plus, comme la méthode save qui permet de faire une requête au serveur et de sauvegarder le document (ou le mettre à jour).

Donc avec mongoDB nous n'avons pas de MCD (modèle conceptuel des donnée) comme avec les base SQL classique. il y a bien sur des tables (appelé collection)
Mais les collections différent des tables SQL. Les documents qui compose une collection peuvent contenir contrairement à SQL des tableaux, des listes. Chose impossible en SQl.

##### MongoDB sur ezTHEQUE #####

Comme dit ci-dessus il n'a pas de MCD avec mongo mais je vais vous présenter l'implémentation de mongo sur ezTHEQUE.

Nous avons d'abord deux schémas (users et livres) qui vérifie que les documents que l'on créer son correct.

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
      <td>Contient la liste des rôles de l'utilisateur (différent du SQL pour le tableau !)
      	<br> Par défaut l'user n'est qu'authentifié<td>
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
      <td>emprunt.date_debut et emprunt.date_fin</td>
      <td>Date</td>
      <td>Date de début et fin de l'emprunt</td>
    </tr>
</table>