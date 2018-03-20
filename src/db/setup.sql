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
    PRIMARY KEY(id)
);

INSERT INTO Unites (nomUnite, ordreUnite) VALUES ('Unité 1', 1);
INSERT INTO Unites (nomUnite, ordreUnite) VALUES ('Unité 2', 2);
INSERT INTO Unites (nomUnite, ordreUnite) VALUES ('Unité 3', 3);
INSERT INTO Unites (nomUnite, ordreUnite) VALUES ('Unité 4', 4);

INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (1, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (1, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (1, 'Partie 3', 3);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (1, 'Partie 4', 4);

INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (2, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (2, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (2, 'Partie 3', 3);

INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (3, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (3, 'Partie 2', 2);

INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (4, 'Partie 1', 1);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (4, 'Partie 2', 2);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (4, 'Partie 3', 3);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (4, 'Partie 4', 4);
INSERT INTO Cours (idUnite, nomCours, ordreCours) VALUES (4, 'Partie 5', 5);

INSERT INTO Challenges (nom, ordre) VALUES ('Challenge 1', 1);
INSERT INTO Challenges (nom, ordre) VALUES ('Challenge 2', 2);
INSERT INTO Challenges (nom, ordre) VALUES ('Challenge 3', 3);

ALTER TABLE Unites RENAME nomUnites TO nomUnite;
ALTER TABLE Unites RENAME ordreUnites TO ordreUnite;
ALTER TABLE Cours RENAME idUnites TO idUnite;

ALTER TABLE Challenges RENAME nomChallenge TO nom;
ALTER TABLE Challenges RENAME ordreChallenge TO ordre;

ALTER TABLE Unites RENAME nomUnite TO nom;
ALTER TABLE Unites RENAME ordreUnite TO ordre;

ALTER TABLE Cours RENAME nomCours TO nom;
ALTER TABLE Cours RENAME cours TO ordre;