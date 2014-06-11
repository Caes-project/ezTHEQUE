# Tests #

Les tests de l'application permettent de vérifier avant de la lancer si tous les services et toutes les fonctionnalitées de l'application fonctionne 

#### Body ####

### Les tests Mocha ###

Les tests mocha sont les tests unitaires, dans l'application ces tests vérifie que la base de données fonctionne et accepte les requêtes de consultation, de création, de modification et de suppression.
Ils vérifie surtout le coté serveur de l'application et la gestion de la base de donnée (mongoDB)

Ils ne vérifie pas le comportement souhaité de l'application dans le sens où ces tests n'ont pas de contexte d'exécution.

### Les tests Karma ###

Les tests avec Karma permettent de vérifier le coté client de l'application, ils sont adaptés aux tests avec Angular.js

Ces tests permettent de créer un contexte d'exécution à nos requêtes et de vérifier le comportement de nos formulaires, de nous routes ...

Ils sont assez similaires à des tests sur une application RESTful car on exécute des requêtes et vérifie que selon le contexte le serveur nous renvoie les bon statut de retour + les bonnes informations.


    /**
    Création des données que le souhaite recevoir 
    **/
    var putLivreData = function() {
      return {
          _id: '525a8422f6d0f87f0e407a33',
          title: 'An Livre about MEAN',
          auteur: 'MEAN rocks!',
          ref: 1,
          dewey: 808,
          date_acquis: '2014-06-03',
          emprunt : {"user":"525a8422f6d0f87f0e419933","date_debut":"2016-06-10","date_fin":"2016-06-24"}
      };
    };

    
    /**
    Requête de type GET attendu dans la fonction qui sera appelé
    .respond(content) vérifie que le contenu renvoyer par le serveur est celui voulu
    **/
    $httpBackend.expectGET(/admin\/users\/([0-9a-fA-F]{24})$/).respond(putUserData());

    // appel de la fonction à tester (la même que dans notre application)
    scope.rendreLivre(livre);
    //Récupération et vérification de toutes les requêtes attendues.
    $httpBackend.flush();

    // Ici on vérifie que la redirection suite à notre requête à fonctionner
    expect($location.path()).toBe('/livres/' + putLivreData()._id);

[Doc utile](https://docs.angularjs.org/api/ngMock/service/$httpBackend)