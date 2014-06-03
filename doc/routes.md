# Routes #

## Soumission de log ##
La route principale d'ezThèque, elle correspond à la **racine** de l'application web. La méthode **GET** donne accès au différent menu, et la méthode **POST** permet de créer des médias. 
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
      <td>/admin/users/{username}</td>
      <td>DELETE</td>
      <td>Supprime un utilisateur local</td>
    </tr>
</table>
