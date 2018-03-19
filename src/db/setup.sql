CREATE TABLE Unites (
   id SERIAL NOT NULL CHECK (id >= 0),
   nomUnites VARCHAR(50) NOT NULL,
   ordreUnites INT CHECK (ordreUnites >= 0),
   PRIMARY KEY(id)
);

CREATE TABLE Cours (
   id SERIAL NOT NULL CHECK (id >= 0),
   idUnites INT NOT NULL CHECK (idUnites >= 0),
   nomCours VARCHAR(50) NOT NULL,
   ordreCours INT CHECK (ordreCours >= 0),
   PRIMARY KEY(id),
   FOREIGN KEY(idUnites) REFERENCES Unites(id)
);

INSERT INTO Unites (nomUnites, ordreUnites) VALUES ('Unité 1', 1);
INSERT INTO Unites (nomUnites, ordreUnites) VALUES ('Unité 2', 2);
INSERT INTO Unites (nomUnites, ordreUnites) VALUES ('Unité 3', 3);
INSERT INTO Unites (nomUnites, ordreUnites) VALUES ('Unité 4', 4);

INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (1, 'Partie 1', 1);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (1, 'Partie 2', 2);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (1, 'Partie 3', 3);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (1, 'Partie 4', 4);

INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (2, 'Partie 1', 1);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (2, 'Partie 2', 2);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (2, 'Partie 3', 3);

INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (3, 'Partie 1', 1);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (3, 'Partie 2', 2);

INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (4, 'Partie 1', 1);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (4, 'Partie 2', 2);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (4, 'Partie 3', 3);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (4, 'Partie 4', 4);
INSERT INTO Cours (idUnites, nomCours, ordreCours) VALUES (4, 'Partie 5', 5);