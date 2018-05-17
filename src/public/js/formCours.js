$("document").ready(function () {
    $('#nomCategorieInput').change(function() {
        var idCategorie = $('#nomCategorieInput').val();
        $.ajax({
            url: '/admin/dashboard/cours/form/ordre/' + $('#nomCategorieInput').val(),
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function (numberOfCours) {
                var html = "";

                if ($('#modifierCours') && parseInt(idCategorie) == parseInt($('#idUniteOrigine').text())) {
                    numberOfCours -= 1;
                }
                if (numberOfCours > 0) {
                    html += "<select class=\"custom-select mr-sm-2\" id=\"ordreInput\" name=\"ordreInput\" style=\"margin-top: 10px;\">";
                    html += "<option value=\"default\" selected>Choisissez l'ordre...</option>";
                    for (var i = 0; i <= numberOfCours; i++) {
                        html += "<option value=\"" + (i + 1) + "\">" + (i+1) + "</option>";
                    }
                    html += "</select";
                }
                $('#ordreHTML').html(html);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#ajouterCours').click(function (e) {
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

    $('#modifierCours').click(function (e) {
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