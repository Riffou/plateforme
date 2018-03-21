var db = require("../models/base").db;

module.exports = {
    getUnites: function(callback) {
        db.any('SELECT nom, id from public.unites ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getMenuCours: function(idUnite, callback) {
        db.any('SELECT nom, id from public.cours WHERE idunite = $1 ORDER BY ordre', [idUnite])
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
            .then(function(data) {
                callback(data.id, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    }
}