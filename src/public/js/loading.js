$("document").ready(function () {
    var idChallenge = $('#pId').text();
    $.ajax({
        url: '/challenges/start/' + idChallenge,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        success: function (port) {
            // afficher solution
            if (port) {
                window.location.replace("http://localhost:" + port);
            }
        },
        error: function (error) {
            $('#pError').show();
            $('#loader').css("display", "none");
        }
    });
});