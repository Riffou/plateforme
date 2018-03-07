# Pipeline Node JS

![picture](http://10.1.38.31/devops/plateforme/badges/master/build.svg)
[![bugs](http://10.1.48.103:9000/api/badges/measure?key=Plateforme%3Amaster&metric=bugs&blinking=true)](http://10.1.48.103:9000/dashboard?id=Plateforme%3Amaster)
[![cov](http://10.1.48.103:9000/api/badges/measure?key=Plateforme%3Amaster&metric=coverage&blinking=true)](http://10.1.48.103:9000/dashboard?id=Plateforme%3Amaster)
[![smells](http://10.1.48.103:9000/api/badges/measure?key=Plateforme%3Amaster&metric=code_smells&blinking=true)](http://10.1.48.103:9000/dashboard?id=Plateforme%3Amaster)

Ce projet est un template (JS back) pour utiliser plus facilement notre pipeline, il utilisera :

- NPM 
- Express (v4.16.2)
- Mocha + chai + nyc (pour les tests)
- Istanbul (test reports)

Il y a un exemple de test très simple dans le dossier test.

# Intégration continue

L'intégration continue se fait avec GitLab CI. Editer le nom de votre projet dans le fichier .gitlab-ci.yml dans la partie before script :

```
before_script:
- export PROJECT=Nom de votre projet
```

