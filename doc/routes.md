# Routes #

La route principale d'ezThèque, elle correspond à la **racine** de l'application web. 
ezThèque est une single-page-application, c'est à dire qu'a aucun moment elle ne se rechargera. Ceci est possible grâce à Angular.js

#### Body ####

### Réponse à une requête POST ###

#### Status code ####

-   **200 OK:** requête effectuées avec  succès.
-   **400 Bad Request:** un élément de la requête rend impossible le traitement.
-   **401 Unauthorized:** Une authentification est nécessaire pour accéder à la ressource.


## Administration ##
Ces routes servent à administrer ezThèque, et sont pour la plupart utilisables via la page admin de l'appplication. Elles requièrent toutes une authentification, à l'exception de /signin.

<table>
    <tr>
        <th style="text-align:left;width:140px;">PATH</th>
        <th style="text-align:left;width:80px;">Méthode</th>
        <th>Utilisation</th>
    </tr>
    <tr>
      <td>/signin</td>
      <td>POST</td>
      <td>Permet de créer un user. 
        <br/>Paramètres: <strong>username</strong>, <strong>password</strong></td> 
    </tr>
    <tr>
      <td>/admin/users</td>
      <td>GET</td>
      <td>Retourne la liste des utilisateurs locaux</td>
    </tr>
    <tr>
      <td>/admin/users/:userId</td>
      <td>GET</td>
      <td>Retourne l'utilisateur en fonction de son id'</td>
    </tr>
    <tr>
      <td>/admin/users/:userId</td>
      <td>PUT</td>
      <td>Modifie l'utilisateur et retourne l'user modifié</td>
    </tr>
    <tr>
      <td>/admin/users/{username}</td>
      <td>DELETE</td>
      <td>Supprime un utilisateur local</td>
    </tr>
</table>

<table>
    <tr>
        <th style="text-align:left;width:140px;">PATH</th>
        <th style="text-align:left;width:80px;">Méthode</th>
        <th>Utilisation</th>
    </tr>
    <tr>
      <td>/livres</td>
      <td>GET</td>
      <td>Retourne la liste des livres</td>
    </tr> 
    <tr>
      <td>/livres/:livreId</td>
      <td>GET</td>
      <td>Retourne le livre en fonction de son id</td>
    </tr>
    <tr> 
      <td>/livres/:livreId</td>
      <td>DELETE</td>
      <td>Permet de supprimer un livre et retourne le livre supprimé.</td> 
    </tr>
    <tr> 
      <td>/livres/:livreId</td>
      <td>PUT</td>
      <td>Permet de modifier un livre et retourne le nouveau livre.</td> 
    </tr>
</table>   


Dans l'application, lors de la gestion des emprunts est toujours appelé la méthode PUT sur l'user et le livre pour les mettre à jour en même temps. Les tests karma vérifie ceci afin d'être sur que les emprunts sont correctement gérés.
