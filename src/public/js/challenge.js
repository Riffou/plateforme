$("document").ready(function () {

    $('#voirSolution').click(function () {
        var idChallenge = $('#pId').text();
        $('#pasDroitAcces').css("display", "none");
        $('#divSolution').css("display", "none");
        $('#solutionText').text("");
        $.ajax({
            url: '/api/challenges/solution/' + idChallenge,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                // afficher solution
                console.log(data);
                console.log(data.solution);
                console.log(data.erreur);
                if (data.solution) {
                    $('#solutionText').text(data.solution);
                    $('#divSolution').show();
                }
                else if (data.erreur) {
                    $('#pasDroitAcces').show();
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
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