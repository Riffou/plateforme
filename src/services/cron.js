var CronJob = require('cron').CronJob;
var exec = require('child_process').exec;
var async = require('async');

// Check the page every 4 seconds

module.exports = {
    start: function() {
        var conteneurArray;
        new CronJob('00 */2 * * * *', function () {
            exec('docker ps --format "{{.Names}}"', function (error, stdout, stderr) {
                // mettre les noms dans un tableau
                conteneurArray = stdout.split("\n");
                console.log(conteneurArray);
                // parcours du tableau
                async.each(conteneurArray, function(nomConteneur, callbackAsync) {
                    // pour chaque conteneur
                    if (nomConteneur != '') {
                        // inspection
                        exec('docker inspect --format=\'{{.State.StartedAt}}\' ' + nomConteneur + ' | xargs date +%s -d ', function(error, stdout, stderr) {
                            if (error == null) {
                                // Si le conteneur a été lancé il y a plus de deux heures
                                if ((Date.now() - parseInt(stdout)) > 2*3600*1000) {
                                    exec('docker stop ' + nomConteneur, function (error, stdout, stderr) {
                                        if (error == null) {
                                            exec('docker rm -f ' + nomConteneur, function (error, stdout, stderr) {
                                                if (error != null) {
                                                    console.log("Erreur : " + error);
                                                }
                                            });
                                        }
                                        else {
                                            console.log("Erreur : " + error);
                                        }
                                    });
                                }
                            }
                            else {
                                console.log("Erreur : " + error);
                            }
                        });
                    }
                });
            });
        }, null, true, 'America/Los_Angeles');
    }
}