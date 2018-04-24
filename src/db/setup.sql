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
   difficulte INT CHECK(difficulte >= 0) DEFAULT 0,
   PRIMARY KEY(id),
   FOREIGN KEY(idUnite) REFERENCES Unites(id)
);

CREATE TABLE Challenges (
    id SERIAL NOT NULL CHECK (id >= 0),
    nom VARCHAR(50) NOT NULL,
    ordre INT CHECK (ordre >= 0),
    flag VARCHAR(50) NOT NULL,
    solution VARCHAR(10000),
    indice VARCHAR(10000),
    difficulte INT CHECK (difficulte >= 0),
    PRIMARY KEY(id)
);

CREATE TABLE Utilisateurs (
   identifiant VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL UNIQUE,
   mdp VARCHAR(100) NOT NULL,
   dateInscription BIGINT NOT NULL,
   lastConnection BIGINT,
   lastFailedConnection BIGINT,
   resetToken VARCHAR(100),
   expiryDate BIGINT,
   PRIMARY KEY(identifiant)
);

CREATE TABLE Administrateurs (
   identifiant VARCHAR(50) NOT NULL,
   email VARCHAR(50) NOT NULL UNIQUE,
   mdp VARCHAR(100) NOT NULL,
   dateInscription BIGINT NOT NULL,
   lastConnection BIGINT,
   lastFailedConnection BIGINT,
   PRIMARY KEY(identifiant)
);

CREATE TABLE SuiviUtilisateursCours (
    id SERIAL NOT NULL CHECK (id >= 0),
    identifiant VARCHAR(50) NOT NULL,
    idCours INT NOT NULL CHECK (idCours >= 0),
    PRIMARY KEY(id),
    FOREIGN KEY(identifiant) REFERENCES Utilisateurs(identifiant),
    FOREIGN KEY (idCours) REFERENCES Cours(id)
);

CREATE TABLE SuiviUtilisateursChallenges (
    id SERIAL NOT NULL CHECK (id >= 0),
    identifiant VARCHAR(50) NOT NULL,
    idChallenge INT NOT NULL CHECK (idChallenge >= 0),
    PRIMARY KEY(id),
    FOREIGN KEY(identifiant) REFERENCES Utilisateurs(identifiant),
    FOREIGN KEY (idChallenge) REFERENCES Challenges(id)
);

CREATE TABLE solutionsChallengesUtilisateurs (
    id SERIAL NOT NULL CHECK (id >= 0),
    idChallenge INT NOT NULL CHECK (idChallenge >= 0),
    identifiant VARCHAR(50) NOT NULL,
    solution VARCHAR(10000),
    PRIMARY KEY (id),
    FOREIGN KEY(idChallenge) REFERENCES Challenges(id),
    FOREIGN KEY(identifiant) REFERENCES Utilisateurs(identifiant)
);

INSERT INTO Unites (nom, ordre) VALUES ('Unité 1', 1);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 2', 2);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 3', 3);
INSERT INTO Unites (nom, ordre) VALUES ('Unité 4', 4);

INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Partie 1', 1, 0);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Partie 2', 2, 1);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Partie 3', 3, 1);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Partie 4', 4, 2);

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

INSERT INTO Challenges (nom, ordre, flag, solution, indice, difficulte) VALUES ('Challenge 1', 1, 'easypass', 'Ceci est la solution du challenge 1', 'Ceci est un indice pour le challenge 1', 0);
INSERT INTO Challenges (nom, ordre, flag, solution, indice, difficulte) VALUES ('Challenge 2', 2, 'middlepass', 'Ceci est la solution du challenge 2', 'Ceci est un indice pour le challenge 2', 1);
INSERT INTO Challenges (nom, ordre, flag, solution, indice, difficulte) VALUES ('Challenge 3', 3, 'hardpass', 'Ceci est la solution du challenge 3', 'Ceci est un indice pour le challenge 3', 2);

INSERT INTO Utilisateurs (identifiant, mdp, email, dateInscription) VALUES ('nico', 'a2fc0754adb89e0b268fcaa6e1438c85906a37a883b639b2ae1878622f72ffb2', 'nico@hotmail.fr', 1524237393762);
INSERT INTO Utilisateurs (identifiant, mdp, email, dateInscription) VALUES ('nicolas', '1f0826184880fe739c0b2c483f420a35c5893ac056fba18f3adfb3424a1d088f', 'nicolas@hotmail.fr', 1524237440676);

INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 2);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 3);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 7);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 1);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 10);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 11);
INSERT INTO SuiviUtilisateursCours(identifiant, idCours) VALUES ('nico', 13);

INSERT INTO SuiviUtilisateursChallenges(identifiant, idChallenge) VALUES ('nico', 2);
INSERT INTO SuiviUtilisateursChallenges(identifiant, idChallenge) VALUES ('nico', 3);
INSERT INTO SuiviUtilisateursChallenges(identifiant, idChallenge) VALUES ('nicolas', 2);

INSERT INTO solutionsChallengesUtilisateurs(idChallenge, identifiant, solution) VALUES(1, 'nicolas', 'Ceci est la solution que propose nicolas');

INSERT INTO Administrateurs (identifiant, mdp, email, dateInscription) VALUES ('admin', 'e140b8f9a3f6235f1cc8f44b3204126078a5228385b244433737de635f4c79c3', 'admin@hotmail.fr', 1524237393762);
