$("document").ready(function () {
    $('#inscription').click(function (e) {

        $('#champManquant').css("display", "none");
        if ($('#erreurServeur')) {
            $('#erreurServeur').css("display", "none");
        }
        if ($('#emailInput').val() == "" || $('#identifiantInput').val() == "" || $('#passwordInput').val() == "") {
            e.preventDefault();
            $('#champManquant').show();
        }
    });
});