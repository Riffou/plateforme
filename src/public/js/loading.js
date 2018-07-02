$("document").ready(function () {
    var idChallenge = $('#pId').text();
    $.ajax({
        url: '/challenges/start/' + idChallenge,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // afficher solution
            if (data.port) {
                window.location.replace('http://' + data.adresse + ':' + data.port);
            }
        },
        error: function (error) {
            $('#pError').show();
            $('#loader').css("display", "none");
        }
    });
});