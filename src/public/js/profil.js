$("document").ready(function () {
    $('#envoiNouveauMDP').click(function (e) {

        $('#champManquant').css("display", "none");
        if ($('#erreurServeur')) {
            $('#erreurServeur').css("display", "none");
        }
        if ($('#ancienMDP').val() == "" || $('#nouveauMDP').val() == "" || $('#confirmationNouveauMDP').val() == "") {
            e.preventDefault();
            $('#champManquant').show();
        }
        if ($('#nouveauMDP').val() !=  $('#confirmationNouveauMDP').val()) {
            e.preventDefault();
            $('#champNonCorrespondant').show();
        }
    });

    window.setTimeout(function() {
        $("#alertSuccess").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
        });
    }, 2000);
});