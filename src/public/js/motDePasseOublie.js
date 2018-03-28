$("document").ready(function () {
    $('#reinitialisation').click(function (e) {

        $('#champManquant').css("display", "none");
        if ($('#erreurServeur')) {
            $('#erreurServeur').css("display", "none");
        }
        if ($('#emailInput').val() == "") {
            e.preventDefault();
            $('#champManquant').show();
        }
    });
});