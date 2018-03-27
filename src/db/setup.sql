CREATE TABLE Unites (
   id SERIAL NOT NULL CHECK (id >= 0),
   nom VARCHAR(50) NOT NULL,
   ordre INT CHECK (ordre >= 0),
   PRIMARY KEY(id)
);

CREATE TABLE Cours (
   id SERIAL NOT NULL CHECK (id >= 0),
   idUnite INT NOT NULL CHECK (idUnite >= 0),
   nom VARCHAR(50) NOT NULL,
   ordre INT CHECK (ordre >= 0),
   PRIMARY KEY(id),
   FOREIGN KEY(idUnite) REFERENCES Unites(id)
);

CREATE TABLE Challenges (
    id SERIAL NOT NULL CHECK (id >= 0),
    nom VARCHAR(50) NOT NULL,
    ordre INT CHECK (ordre >= 0),
    flag VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Utilisateurs (
   pseudo VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL UNIQUE,
   mdp VARCHAR(100) NOT NULL,
   PRIMARY KEY(pseudo)
);

CREATE TABLE SuiviUtilisateursCours (
    id SERIAL NOT NULL CHECK (id >= 0),
    pseudo VARCHAR(50) NOT NULL,
    idCours INT NOT NULL CHECK (idCours >= 0),
    PRIMARY KEY(id),
    FOREIGN KEY(pseudo) REFERENCES Utilisateurs(pseudo),
    FOREIGN KEY (idCours) REFERENCES Cours(id)
);

CREATE TABLE SuiviUtilisateursChallenges (
    id SERIAL NOT NULL CHECK (id >= 0),
    pseudo VARCHAR(50) NOT NULL,
    idChallenge INT NOT NULL CHECK (idChallenge >= 0),
    PRIMARY KEY(id),
    FOREIGN KEY(pseudo) REFERENCES Utilisateurs(pseudo),
    FOREIGN KEY (idChallenge) REFERENCES Challenges(id)
);

INSERT INTO Unites (nom, ordre) VALUES ('Unité 1', 1);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 2', 2);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 3', 3);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 4', 4);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (1, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (1, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (1, 'Partie 3', 3);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (1, 'Partie 4', 4);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (2, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (2, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (2, 'Partie 3', 3);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (3, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (3, 'Partie 2', 2);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Partie 3', 3);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Partie 4', 4);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Partie 5', 5);

INSERT INTO Challenges (nom, ordre, flag) VALUES ('Challenge 1', 1, 'easypass');
INSERT INTO Challenges (nom, ordre, flag) VALUES ('Challenge 2', 2, 'middlepass');
INSERT INTO Challenges (nom, ordre, flag) VALUES ('Challenge 3', 3, 'hardpass');

INSERT INTO Utilisateurs (pseudo, mdp, email) VALUES ('nico', 'a2fc0754adb89e0b268fcaa6e1438c85906a37a883b639b2ae1878622f72ffb2', 'nico@hotmail.fr');
INSERT INTO Utilisateurs (pseudo, mdp, email) VALUES ('nicolas', '1f0826184880fe739c0b2c483f420a35c5893ac056fba18f3adfb3424a1d088f', 'nicolas@hotmail.fr');

INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nico', 2);
INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nico', 3);
INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nico', 7);

INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nicolas', 2);
INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nicolas', 3) ;
INSERT INTO SuiviUtilisateursCours(pseudo, idCours) VALUES ('nicolas', 7);

INSERT INTO SuiviUtilisateursChallenges(pseudo, idChallenge) VALUES ('nico', 2);
INSERT INTO SuiviUtilisateursChallenges(pseudo, idChallenge) VALUES ('nico', 3);
INSERT INTO SuiviUtilisateursChallenges(pseudo, idChallenge) VALUES ('nicolas', 2);