'use strict';

module.exports = {
  forgot_password_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      'Bonjour ' + user.name + ',',
      'Nous avons bien reçu votre requête pour réinitialiser votre mot de passe.',
      'Si vous avez émis cette requête, cliquez sur le lien ci-dessous:',
      'http://' + req.headers.host + '/#!/reset/' + token,
      'Ce lien sera actif une heure.',
      'Si vous n\'avez pas émis cette requête, ignorez là.'
    ].join('\n\n');
    mailOptions.subject = 'Reset le mot de passe - EZthèque';
    return mailOptions;
  },
  prevenir_retard : function(user, req, mailOptions,emprunts, message_perso){
    console.log(emprunts);
    mailOptions.html = [
      'Bonjour ' + user.name + ',',
      'Vous avez les emprunts suivants en retards'
    ];
    emprunts.forEach(function(emprunt){
      mailOptions.html.push(
        emprunt.title + ' emprunté le ' + emprunt.emprunt.date_debut.toISOString().substring(0, 10) + ' qu\' il fallait rendre le ' + emprunt.emprunt.date_fin.toISOString().substring(0, 10) + '\n'
        );
    });
    mailOptions.html.join('\n\n');
    console.log(mailOptions.html);
    mailOptions.subject = 'Vous avez des retards !';
    return mailOptions;
  }
};
