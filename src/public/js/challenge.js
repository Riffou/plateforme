$("document").ready(function () {

    $('#voirSolution').click(function () {
        $('#divSolution').show();
    });

    $('#flagSubmit').click(function () {
        // Réinitialisation
        $('#goodFlag').css("display", "none");
        $('#wrongFlag').css("display", "none");
        $('#emptyFlag').css("display", "none");
        var flag = $('#flagInput').val();

        if (flag != '') {
            var idChallenge = $('#pId').text();
            $.ajax({
                url: '/api/challenges/' + idChallenge,
                type: 'POST',
                dataType: 'json',
                data: 'flag=' + flag,
                contentType: 'application/x-www-form-urlencoded',
                success: function (data) {
                    if (data.flag) {
                        $('#goodFlag').show();
                    }
                    else {
                        $('#wrongFlag').show();
                    }
                },
                error: function (error) {
                    console.log(error);
                }

            });
        }
        else {
            $('#emptyFlag').show();
        }
    });
});