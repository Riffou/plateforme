var db = require("../models/base").db;

module.exports = {
    getMenu: function (callback) {
        db.any('SELECT nom, id, difficulte, ordre FROM public.challenges ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getOrdreFromId: function (idChallenge, callback) {
        db.one('SELECT ordre FROM challenges WHERE id = $1', [idChallenge])
            .then(function (data) {
                callback(data.ordre, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    // Validation challenge
    validateFlag: function (idChallenge, flagUser, callback) {
        db.one('SELECT flag FROM challenges WHERE id = $1', [idChallenge])
            .then(function (data) {
                if (data.flag == flagUser) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getSolutionsOfChallenge: function(idChallenge, callback) {
        db.one('SELECT solution FROM Challenges WHERE id = $1', [idChallenge])
            .then(function(data1) {
                db.any('SELECT solution, identifiant FROM SolutionsChallengesUtilisateurs WHERE idChallenge = $1', [idChallenge])
                    .then(function(data2) {
                        var data = [data1, data2];
                        callback(data, null);
                    })
                    .catch(function(error) {
                        callback(null, error)
                    })
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getIndiceChallenge: function(idChallenge, callback) {
        db.one('SELECT indice FROM Challenges WHERE id = $1', [idChallenge])
            .then(function(data) {
                callback(data.indice, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getNombreValidations: function(callback) {
        db.any('SELECT COUNT(id), idChallenge FROM suiviUtilisateursChallenges GROUP BY idChallenge')
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getNumberOfChallenges: function(callback) {
        db.one('SELECT count(id) FROM Challenges')
            .then(function(data) {
                callback(data.count, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getAllOfOneChallenge: function(idChallenge, callback) {
        db.one('SELECT * FROM Challenges where id = $1', [idChallenge])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    addChallenge: function(nom, ordre, difficulte, flag, indice, solution, description, callback) {
        db.one('INSERT INTO public.challenges (nom, ordre, difficulte, flag, indice, solution, description) VALUES ($1, $2, $3, $4, $5, $6, $7) returning id', [nom, ordre, difficulte, flag, indice, solution, description])
            .then(function(data) {
                callback(data.id, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    updateOrdreChallenges: function(ordre, id, callback) {
        db.none('UPDATE public.challenges SET ordre = $1 WHERE id = $2', [ordre, id])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    getOrderOfChallenges: function(callback) {
        db.any('SELECT id FROM Challenges ORDER BY ordre')
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getNomChallenge: function(idChallenge, callback) {
        db.one('SELECT nom FROM Challenges WHERE id = $1', [idChallenge])
            .then(function(data) {
                callback(data.nom, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getDescription: function(idChallenge, callback) {
        db.one('SELECT description FROM Challenges WHERE id = $1', [idChallenge])
            .then(function(data) {
                callback(data.description, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    deleteChallenge: function(id, callback) {
        db.none('DELETE FROM public.challenges WHERE id = $1', [id])
            .then(function () {
                callback(null);
            })
            .catch(function (error) {
                callback(error);
            })
    },
    updateChallenge: function(id, ordre, nom, callback) {
        db.none('UPDATE public.challenges SET nom = $1, ordre = $2 WHERE id = $3', [nom, ordre, id])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
}
