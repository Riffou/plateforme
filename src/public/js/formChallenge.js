$("document").ready(function () {
    $('#ajouterChallenge').click(function (e) {
        $('#error').css("display", "none");
        if ($('#titleInput').val() == ""
            || $('#descriptionInput').val() == ""
            || $('#flagInput').val() == ""
            || $('#solutionInput').val() == "") {
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

    $('#modifierChallenge').click(function (e) {
        $('#error').css("display", "none");
        if ($('#titleInput').val() == ""
            || $('#descriptionInput').val() == ""
            || $('#flagInput').val() == ""
            || $('#solutionInput').val() == "") {
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