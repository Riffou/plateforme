$("document").ready(function () {
    $('#ajouterCategorie').click(function (e) {
        $('#error').css("display", "none");
        if ($('#titleInput').val() == "" || $('#descriptionInput').val() == "") {
            e.preventDefault();
            $("#pError").text('Veuillez renseigner tous les champs !');
            $('#error').show();
        }
        if ($('#ordreInput').val() == 'default') {
            e.preventDefault();
            $("#pError").text('Veuillez choisir l\'ordre de la catégorie !');
            $('#error').show();
        }
    });

    $('#modofierCategorie').click(function (e) {
        $('#error').css("display", "none");
        if ($('#titleInput').val() == "" || $('#descriptionInput').val() == "") {
            e.preventDefault();
            $("#pError").text('Veuillez renseigner tous les champs !');
            $('#error').show();
        }
        if ($('#ordreInput').val() == 'default') {
            e.preventDefault();
            $("#pError").text('Veuillez choisir l\'ordre de la catégorie !');
            $('#error').show();
        }
    });
});