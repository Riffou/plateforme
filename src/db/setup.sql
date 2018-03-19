CREATE TABLE Unites (
   id SERIAL NOT NULL CHECK (id >= 0),
   nomUnite VARCHAR(50) NOT NULL,
   ordreUnite INT CHECK (ordreUnite >= 0),
   PRIMARY KEY(id)
);

CREATE TABLE Cours (
   id SERIAL NOT NULL CHECK (id >= 0),
   idUnite INT NOT NULL CHECK (idUnite >= 0),
   nomCours VARCHAR(50) NOT NULL,
   ordreCours INT CHECK (ordreCours >= 0),
   PRIMARY KEY(id),
   FOREIGN KEY(idUnite) REFERENCES Unites(id)
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

ALTER TABLE Unites RENAME nomUnites TO nomUnite;
ALTER TABLE Unites RENAME ordreUnites TO ordreUnite;
ALTER TABLE Cours RENAME idUnites TO idUnite;