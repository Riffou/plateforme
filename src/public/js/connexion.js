$("document").ready(function () {
    $('#connexion').click(function (e) {
        $('#champManquant').css("display", "none");
        if ($('#erreurServeur')) {
            $('#erreurServeur').css("display", "none");
        }
        if ($('#identifiantInput').val() == "" || $('#passwordInput').val() == "") {
            e.preventDefault();
            $('#champManquant').show();
        }
    });
});