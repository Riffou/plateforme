CREATE TABLE Unites (
   id SERIAL NOT NULL CHECK (id >= 0),
   nom VARCHAR(50) NOT NULL,
   description VARCHAR(1000) NOT NULL,
   ordre INT CHECK (ordre >= 0),
   PRIMARY KEY(id)
);

CREATE TABLE Cours (
   id SERIAL NOT NULL CHECK (id >= 0),
   idUnite INT CHECK (idUnite >= 0),
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
    description VARCHAR(10000),
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

INSERT INTO Unites (nom, ordre, description) VALUES ('Introduction', 1, 'Introduction au web et à la sécurité web.');
INSERT INTO Unites (nom, ordre, description) VALUES ('Failles web et bonnes pratiques', 2, 'Présentation des failles les plus connues et des bonnes pratiques de développement.');
INSERT INTO Unites (nom, ordre, description) VALUES ('Revue de code', 3, 'Utilisation de SonarQube pour de la revue de code statique sur la sécurité des applications web.');
INSERT INTO Unites (nom, ordre, description) VALUES ('Pentesting', 4, 'Attaques de sites web avec ZAP.');

INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Le web', 1, 0);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'La sécurité web', 2, 1);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (1, 'Top 10 des failles web', 3, 1);

INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'XSS', 1, 0);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'Injections SQL', 2, 1);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'CSRF', 3, 1);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'CRLF', 4, 2);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'XXE', 5, 2);
INSERT INTO Cours (idUnite, nom, ordre, difficulte) VALUES (2, 'Upload', 6, 2);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (3, 'SonarQube', 1);

INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Configuration de ZAP', 1);
INSERT INTO Cours (idUnite, nom, ordre) VALUES (4, 'Pentesting', 2);

INSERT INTO Utilisateurs (identifiant, mdp, email, dateInscription) VALUES ('nico', 'a2fc0754adb89e0b268fcaa6e1438c85906a37a883b639b2ae1878622f72ffb2', 'nico@hotmail.fr', 1524237393762);
INSERT INTO Utilisateurs (identifiant, mdp, email, dateInscription) VALUES ('nicolas', '1f0826184880fe739c0b2c483f420a35c5893ac056fba18f3adfb3424a1d088f', 'nicolas@hotmail.fr', 1524237440676);

INSERT INTO Administrateurs (identifiant, mdp, email, dateInscription) VALUES ('admin', 'e140b8f9a3f6235f1cc8f44b3204126078a5228385b244433737de635f4c79c3', 'admin@hotmail.fr', 1524237393762);