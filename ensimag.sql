--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: administrateurs; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.administrateurs (
    identifiant character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    mdp character varying(100) NOT NULL,
    dateinscription bigint NOT NULL,
    lastconnection bigint,
    lastfailedconnection bigint
);


ALTER TABLE public.administrateurs OWNER TO ensimag;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.challenges (
    id integer NOT NULL,
    nom character varying(50) NOT NULL,
    ordre integer,
    flag character varying(50) NOT NULL,
    solution character varying(10000),
    indice character varying(10000),
    difficulte integer,
    description character varying(10000),
    CONSTRAINT challenges_difficulte_check CHECK ((difficulte >= 0)),
    CONSTRAINT challenges_id_check CHECK ((id >= 0)),
    CONSTRAINT challenges_ordre_check CHECK ((ordre >= 0))
);


ALTER TABLE public.challenges OWNER TO ensimag;

--
-- Name: challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.challenges_id_seq OWNER TO ensimag;

--
-- Name: challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;


--
-- Name: cours; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.cours (
    id integer NOT NULL,
    idunite integer,
    nom character varying(50) NOT NULL,
    ordre integer,
    difficulte integer DEFAULT 0,
    CONSTRAINT cours_difficulte_check CHECK ((difficulte >= 0)),
    CONSTRAINT cours_id_check CHECK ((id >= 0)),
    CONSTRAINT cours_idunite_check CHECK ((idunite >= 0)),
    CONSTRAINT cours_ordre_check CHECK ((ordre >= 0))
);


ALTER TABLE public.cours OWNER TO ensimag;

--
-- Name: cours_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.cours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cours_id_seq OWNER TO ensimag;

--
-- Name: cours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.cours_id_seq OWNED BY public.cours.id;


--
-- Name: playground; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.playground (
    equip_id integer NOT NULL,
    type character varying(50) NOT NULL,
    color character varying(25) NOT NULL,
    location character varying(25),
    install_date date,
    CONSTRAINT playground_location_check CHECK (((location)::text = ANY (ARRAY[('north'::character varying)::text, ('south'::character varying)::text, ('west'::character varying)::text, ('east'::character varying)::text, ('northeast'::character varying)::text, ('southeast'::character varying)::text, ('southwest'::character varying)::text, ('northwest'::character varying)::text])))
);


ALTER TABLE public.playground OWNER TO ensimag;

--
-- Name: playground_equip_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.playground_equip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.playground_equip_id_seq OWNER TO ensimag;

--
-- Name: playground_equip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.playground_equip_id_seq OWNED BY public.playground.equip_id;


--
-- Name: solutionschallengesutilisateurs; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.solutionschallengesutilisateurs (
    id integer NOT NULL,
    idchallenge integer NOT NULL,
    identifiant character varying(50) NOT NULL,
    solution character varying(10000),
    CONSTRAINT solutionschallengesutilisateurs_id_check CHECK ((id >= 0)),
    CONSTRAINT solutionschallengesutilisateurs_idchallenge_check CHECK ((idchallenge >= 0))
);


ALTER TABLE public.solutionschallengesutilisateurs OWNER TO ensimag;

--
-- Name: solutionschallengesutilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.solutionschallengesutilisateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solutionschallengesutilisateurs_id_seq OWNER TO ensimag;

--
-- Name: solutionschallengesutilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.solutionschallengesutilisateurs_id_seq OWNED BY public.solutionschallengesutilisateurs.id;


--
-- Name: suiviutilisateurschallenges; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.suiviutilisateurschallenges (
    id integer NOT NULL,
    identifiant character varying(50) NOT NULL,
    idchallenge integer NOT NULL,
    CONSTRAINT suiviutilisateurschallenges_id_check CHECK ((id >= 0)),
    CONSTRAINT suiviutilisateurschallenges_idchallenge_check CHECK ((idchallenge >= 0))
);


ALTER TABLE public.suiviutilisateurschallenges OWNER TO ensimag;

--
-- Name: suiviutilisateurschallenges_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.suiviutilisateurschallenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suiviutilisateurschallenges_id_seq OWNER TO ensimag;

--
-- Name: suiviutilisateurschallenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.suiviutilisateurschallenges_id_seq OWNED BY public.suiviutilisateurschallenges.id;


--
-- Name: suiviutilisateurscours; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.suiviutilisateurscours (
    id integer NOT NULL,
    identifiant character varying(50) NOT NULL,
    idcours integer NOT NULL,
    CONSTRAINT suiviutilisateurscours_id_check CHECK ((id >= 0)),
    CONSTRAINT suiviutilisateurscours_idcours_check CHECK ((idcours >= 0))
);


ALTER TABLE public.suiviutilisateurscours OWNER TO ensimag;

--
-- Name: suiviutilisateurscours_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.suiviutilisateurscours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suiviutilisateurscours_id_seq OWNER TO ensimag;

--
-- Name: suiviutilisateurscours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.suiviutilisateurscours_id_seq OWNED BY public.suiviutilisateurscours.id;


--
-- Name: unites; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.unites (
    id integer NOT NULL,
    nom character varying(50) NOT NULL,
    description character varying(1000) NOT NULL,
    ordre integer,
    CONSTRAINT unites_id_check CHECK ((id >= 0)),
    CONSTRAINT unites_ordre_check CHECK ((ordre >= 0))
);


ALTER TABLE public.unites OWNER TO ensimag;

--
-- Name: unites_id_seq; Type: SEQUENCE; Schema: public; Owner: ensimag
--

CREATE SEQUENCE public.unites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unites_id_seq OWNER TO ensimag;

--
-- Name: unites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ensimag
--

ALTER SEQUENCE public.unites_id_seq OWNED BY public.unites.id;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: ensimag
--

CREATE TABLE public.utilisateurs (
    identifiant character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    mdp character varying(100) NOT NULL,
    dateinscription bigint NOT NULL,
    lastconnection bigint,
    lastfailedconnection bigint,
    resettoken character varying(100),
    expirydate bigint
);


ALTER TABLE public.utilisateurs OWNER TO ensimag;

--
-- Name: challenges id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);


--
-- Name: cours id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.cours ALTER COLUMN id SET DEFAULT nextval('public.cours_id_seq'::regclass);


--
-- Name: playground equip_id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.playground ALTER COLUMN equip_id SET DEFAULT nextval('public.playground_equip_id_seq'::regclass);


--
-- Name: solutionschallengesutilisateurs id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.solutionschallengesutilisateurs ALTER COLUMN id SET DEFAULT nextval('public.solutionschallengesutilisateurs_id_seq'::regclass);


--
-- Name: suiviutilisateurschallenges id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurschallenges ALTER COLUMN id SET DEFAULT nextval('public.suiviutilisateurschallenges_id_seq'::regclass);


--
-- Name: suiviutilisateurscours id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurscours ALTER COLUMN id SET DEFAULT nextval('public.suiviutilisateurscours_id_seq'::regclass);


--
-- Name: unites id; Type: DEFAULT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.unites ALTER COLUMN id SET DEFAULT nextval('public.unites_id_seq'::regclass);


--
-- Data for Name: administrateurs; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.administrateurs (identifiant, email, mdp, dateinscription, lastconnection, lastfailedconnection) FROM stdin;
admin	admin@hotmail.fr	e140b8f9a3f6235f1cc8f44b3204126078a5228385b244433737de635f4c79c3	1524237393762	1529921659379	\N
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.challenges (id, nom, ordre, flag, solution, indice, difficulte, description) FROM stdin;
7	Offuscation	4	facileadecoder	Le tableau définit en début de code [si:facileadecoder] permet de déterminer le nom d'utilisateur valide et le mot de passe. Le nom d'utilisateur est "si", le mot de passe "facileadecoder".	Analysez le code javascript du fichier "chall2.js" grâce à l'outil inspecteur de Google Chrome (Ctrl + Maj + i)	1	Essayez de vous connecter !
4	Become an admin	1	lh456regjduiz	Il suffit de trouver la bonne injection SQL à saisir pour pouvoir s'authentifier en tant qu'administrateur. \r\nDans notre cas, une solution est : ' or '1' = '1.\r\nEn effet, voici à quoi ressemble la requête SQL côté serveur :\r\n"SELECT COUNT(identifiant) FROM Administrateurs WHERE identifiant = '" + identifiant + "' AND mdp = '" + password + "'".\r\nAvec l’injection SQL précédente, cela donne :\r\n"SELECT COUNT(identifiant) FROM Administrateurs WHERE identifiant = 'admin' AND mdp = '' or '1' = '1'"	Les injections SQL vous disent quelque chose ? 	1	Trouvez un moyen de vous connecter au portail en tant qu'administrateur !
6	XSS réfléchi	2	masterzap	Il suffit de taper dans le champ un script Javascript quelconque. Voici une possibilité : \r\n<script>alert("Bonjour")</script>	La réponse est dans le cours !	1	Essayez d'executer du Javascript sur cette page !
5	Formulaire à contourner	3	totalaccess	Utilisez un logiciel tel que ZAP ou WebScarab pour faire des rejeux de requête. (l'outil cURL peut très bien faire l'affaire).\r\nAvec ZAP, effectuez une première requête en remplissant tous les champs du formulaire. \r\nComme expliqué dans le cours, renvoyez la requête HTTP en modifiant les champs de la requête.	Never Trust User Inputs	1	Apprenez à manipuler les requêtes HTTP sans votre navigateur ! 
8	Formulaire bloqué...	5	inspectorIsCool	Il suffit de modifier le code source de la page HTML à l'aide de l'outil inspecteur de Google Chrome (Ctrl + Maj + I). \r\nChercher le bouton "S'inscrire" dans le code et supprimer sa balise "disabled". Vous pouvez alors utiliser le formulaire ! 	Utilisez Google Chrome et son outil inspecteur.	0	Essayez d'utiliser ce challenge même s'il semble bloqué...
9	CRLF	6	encode	Il suffit d'écrire les adresses emails séparées des caractères %0A. \r\nEn hexadécimal 0A vaut 10 et le code ASCII du retour à la ligne est 10. Ainsi le mail de réinitialisation de mot de passe sera envoyé aux deux adresses emails. 	La réponse est dans le cours CRLF !	0	Mettez-vous en copie du mail de réinitialisation de l'utilisateur nicolas@lab-solutec.fr.
10	Upload	7	filterYourUploads	Il suffit de faire un fichier PHP pour récupérer le contenu du fichier flag.txt.\r\nLa première étape consiste à localiser le fichier ciblé. On peut procéder en faisant un locate, find ou en affichant les fichiers d'un dossier à l'aide de la commande ls.\r\nLe script PHP suivant fait l'affaire : \r\n<?php \r\n\t$output = shell_exec('ls ../');\r\n\techo "<pre>$output</pre>";\r\n?>\r\nPuis pour récupérer le fichier il suffit de faire : \r\n<?php \r\n\t$output = shell_exec('cat ../flag.txt');\r\n\techo "<pre>$output</pre>";\r\n?>\r\n	Uploader un fichier PHP pour récupérer le contenu de flag.txt.	1	Essayez de récupérer le contenu du fichier flag.txt pour valider le challenge !
\.


--
-- Data for Name: cours; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.cours (id, idunite, nom, ordre, difficulte) FROM stdin;
11	4	Configuration de ZAP	1	0
12	4	Pentesting	2	0
17	5	Le web	1	0
4	2	XSS	1	0
5	2	Injections SQL	2	1
6	2	CSRF	3	1
7	2	CRLF	4	2
8	2	XXE	5	2
9	2	Upload	6	2
10	3	SonarQube	1	0
3	5	Top 10 des failles web	3	1
2	5	La sécurité web	2	1
\.


--
-- Data for Name: playground; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.playground (equip_id, type, color, location, install_date) FROM stdin;
1	slide	blue	south	2014-04-28
2	swing	yellow	northwest	2010-08-16
\.


--
-- Data for Name: solutionschallengesutilisateurs; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.solutionschallengesutilisateurs (id, idchallenge, identifiant, solution) FROM stdin;
1	4	nicolas	test solution
\.


--
-- Data for Name: suiviutilisateurschallenges; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.suiviutilisateurschallenges (id, identifiant, idchallenge) FROM stdin;
4	nicolas	4
6	nico	4
7	nico	6
\.


--
-- Data for Name: suiviutilisateurscours; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.suiviutilisateurscours (id, identifiant, idcours) FROM stdin;
5	nico	15
6	nico	16
7	nico	17
\.


--
-- Data for Name: unites; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.unites (id, nom, description, ordre) FROM stdin;
2	Failles web et bonnes pratiques	Présentation des failles les plus connues et des bonnes pratiques de développement.	2
3	Revue de code	Utilisation de SonarQube pour de la revue de code statique sur la sécurité des applications web.	3
4	Pentesting	Attaques de sites web avec ZAP.	4
5	Introduction	Introduction au web et à la sécurité web.	1
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: ensimag
--

COPY public.utilisateurs (identifiant, email, mdp, dateinscription, lastconnection, lastfailedconnection, resettoken, expirydate) FROM stdin;
nico	nico@hotmail.fr	a2fc0754adb89e0b268fcaa6e1438c85906a37a883b639b2ae1878622f72ffb2	1524237393762	1530196904115	1528189302162	\N	\N
nicolas	nicolas@hotmail.fr	1f0826184880fe739c0b2c483f420a35c5893ac056fba18f3adfb3424a1d088f	1524237440676	1529052252725	1529052249840	\N	\N
\.


--
-- Name: challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.challenges_id_seq', 10, true);


--
-- Name: cours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.cours_id_seq', 17, true);


--
-- Name: playground_equip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.playground_equip_id_seq', 2, true);


--
-- Name: solutionschallengesutilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.solutionschallengesutilisateurs_id_seq', 1, true);


--
-- Name: suiviutilisateurschallenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.suiviutilisateurschallenges_id_seq', 7, true);


--
-- Name: suiviutilisateurscours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.suiviutilisateurscours_id_seq', 7, true);


--
-- Name: unites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ensimag
--

SELECT pg_catalog.setval('public.unites_id_seq', 5, true);


--
-- Name: administrateurs administrateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_email_key UNIQUE (email);


--
-- Name: administrateurs administrateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_pkey PRIMARY KEY (identifiant);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: cours cours_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.cours
    ADD CONSTRAINT cours_pkey PRIMARY KEY (id);


--
-- Name: playground playground_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.playground
    ADD CONSTRAINT playground_pkey PRIMARY KEY (equip_id);


--
-- Name: solutionschallengesutilisateurs solutionschallengesutilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.solutionschallengesutilisateurs
    ADD CONSTRAINT solutionschallengesutilisateurs_pkey PRIMARY KEY (id);


--
-- Name: suiviutilisateurschallenges suiviutilisateurschallenges_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurschallenges
    ADD CONSTRAINT suiviutilisateurschallenges_pkey PRIMARY KEY (id);


--
-- Name: suiviutilisateurscours suiviutilisateurscours_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurscours
    ADD CONSTRAINT suiviutilisateurscours_pkey PRIMARY KEY (id);


--
-- Name: unites unites_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.unites
    ADD CONSTRAINT unites_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (identifiant);


--
-- Name: cours cours_idunite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.cours
    ADD CONSTRAINT cours_idunite_fkey FOREIGN KEY (idunite) REFERENCES public.unites(id);


--
-- Name: solutionschallengesutilisateurs solutionschallengesutilisateurs_idchallenge_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.solutionschallengesutilisateurs
    ADD CONSTRAINT solutionschallengesutilisateurs_idchallenge_fkey FOREIGN KEY (idchallenge) REFERENCES public.challenges(id);


--
-- Name: solutionschallengesutilisateurs solutionschallengesutilisateurs_identifiant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.solutionschallengesutilisateurs
    ADD CONSTRAINT solutionschallengesutilisateurs_identifiant_fkey FOREIGN KEY (identifiant) REFERENCES public.utilisateurs(identifiant);


--
-- Name: suiviutilisateurschallenges suiviutilisateurschallenges_idchallenge_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurschallenges
    ADD CONSTRAINT suiviutilisateurschallenges_idchallenge_fkey FOREIGN KEY (idchallenge) REFERENCES public.challenges(id);


--
-- Name: suiviutilisateurschallenges suiviutilisateurschallenges_identifiant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurschallenges
    ADD CONSTRAINT suiviutilisateurschallenges_identifiant_fkey FOREIGN KEY (identifiant) REFERENCES public.utilisateurs(identifiant);


--
-- Name: suiviutilisateurscours suiviutilisateurscours_identifiant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ensimag
--

ALTER TABLE ONLY public.suiviutilisateurscours
    ADD CONSTRAINT suiviutilisateurscours_identifiant_fkey FOREIGN KEY (identifiant) REFERENCES public.utilisateurs(identifiant);


--
-- PostgreSQL database dump complete
--

