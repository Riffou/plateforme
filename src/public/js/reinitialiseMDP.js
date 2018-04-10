$("document").ready(function () {
    $('#reinitialiseMDP').click(function (e) {

        $('#champManquant').css("display", "none");
        if ($('#resetMDP').val() == "") {
            e.preventDefault();
            $('#champManquant').show();
        }
    });
});