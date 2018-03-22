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

