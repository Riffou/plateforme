var db = require("../models/base").db;

var self = module.exports = {
    getUnites: function(callback) {
        db.any('SELECT nom, id from public.unites ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getUnitesAll: function(callback) {
        db.any('SELECT * FROM public.unites ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getMenuCours: function(idUnite, callback) {
        db.any('SELECT nom, id, difficulte from public.cours WHERE idunite = $1 ORDER BY ordre', [idUnite])
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getIdCoursAndIdUnites: function(callback) {
        db.any('SELECT id, idunite from public.cours')
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getEverythingCours: function(callback) {
        db.any('SELECT id, idunite, nom, difficulte from public.cours')
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getPrevious: function(idUnite, idCours, callback) {
        var self = this;
        this.getOrdreFromIdCours(idCours, function(ordreCours, error) {
            if (error == null) {
                if (ordreCours == 1) {
                    callback(false, null);
                }
                else {
                    self.getIdFromOrdreCours(idUnite, (ordreCours - 1), function(idCours, error) {
                        if (error == null) {
                            callback(idCours, null);
                        }
                        else {
                            console.log(error);
                        }
                    });
                }
            }
            else {
                console.log(error);
            }
        });
    },
    getNext: function(idUnite, idCours, callback) {
        var self = this;
        this.getOrdreFromIdCours(idCours, function(ordreCours, error){
            if (error == null) {
                db.one('SELECT MAX(ordre) FROM cours WHERE idunite = $1', [idUnite])
                    .then(function (data) {
                        if (ordreCours < data.max) {
                            self.getIdFromOrdreCours(idUnite, (ordreCours + 1), function(idCours, error) {
                                if (error == null) {
                                    callback(idCours, null);
                                }
                                else {
                                    console.log(error);
                                }
                            });
                        }
                        else {
                            callback(false, null);
                        }
                    })
                    .catch(function (error) {
                        callback(null, error);
                    })
            }
            else {
                console.log(error);
            }
        });
    },
    doesLessonExist: function(idCours, callback) {
        db.one('SELECT COUNT(nom) FROM cours WHERE id = $1', [idCours])
            .then(function(data) {
                if (data.count == 1) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getOrdreFromIdUnite: function(idUnite, callback) {
        db.one('SELECT ordre FROM unites WHERE id = $1', [idUnite])
            .then(function(data) {
                callback(data.ordre, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getOrdreFromIdCours: function(idCours, callback) {
        db.one('SELECT ordre FROM cours WHERE id = $1', [idCours])
            .then(function(data) {
                callback(data.ordre, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getIdFromOrdreCours: function(idUnite, ordreCours, callback) {
        db.one('SELECT id FROM cours WHERE ordre = $1 AND idUnite = $2', [ordreCours, idUnite])
            .then(function (data) {
                callback(data.id, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getNumberOfCours: function(callback) {
        db.one('SELECT count(id) FROM Cours')
            .then(function(data) {
                callback(data.count, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getNumberOfUnites: function(callback) {
        db.one('SELECT count(id) FROM Unites')
            .then(function(data) {
                callback(data.count, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getNombreValidations: function(callback) {
        db.any('SELECT COUNT(id), idCours FROM suiviUtilisateursCours GROUP BY idCours')
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getNomOfUnites: function(callback) {
        db.any('SELECT nom, id FROM Unites')
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    getOrderOfUnites: function(callback) {
        db.any('SELECT id FROM Unites ORDER BY ordre')
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    updateCategories: function(id, ordre, nom, callback) {
        db.none('UPDATE public.unites SET nom = $1, ordre = $2 WHERE id = $3', [nom, ordre, id])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    deleteCategorie: function(id, callback) {
        self.deleteCategoriesFromCours(id, function(error) {
            if (error == null) {
                db.none('DELETE FROM public.unites WHERE id = $1', [id])
                    .then(function() {
                        callback(null);
                    })
                    .catch(function(error) {
                        callback(error);
                    })
            }
            else {
                callback(error);
            }
        })
    },
    deleteCategoriesFromCours: function(idUnite, callback) {
        db.none('UPDATE public.cours SET idUnite = null WHERE idUnite = $1', [idUnite])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    addCategorie: function(nomUnite, descriptionUnite, ordre, callback) {
        db.none('INSERT INTO public.unites (nom, description, ordre) VALUES ($1, $2, $3)', [nomUnite, descriptionUnite, ordre])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    updateOrdreCategories: function(ordre, id, callback) {
        db.none('UPDATE public.unites SET ordre = $1 WHERE id = $2', [ordre, id])
            .then(function() {
                    callback(null);
                })
            .catch(function(error) {
                callback(error);
            })
    },
    getAllOfOneUnite: function(id, callback) {
        db.one('SELECT * from public.unites WHERE id = $1', [id])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    }
}