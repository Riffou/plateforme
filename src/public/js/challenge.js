$("document").ready(function () {
    $('#voirSolution').click(function () {
        var idChallenge = $('#pId').text();
        $('#pasDroitAcces').css("display", "none");
        $('#divSolution').css("display", "none");
        $('#solutionText').text("");

        if ($('#voirSolution').text() == 'Voir les solutions') {
            if ($('#solutionText').text() == "") {
                $.ajax({
                    url: '/api/challenges/solution/' + idChallenge,
                    type: 'POST',
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (data) {
                        // afficher solution
                        if (data.erreur) {
                            $('#pasDroitAcces').show();
                        }
                        else {
                            $('#solutionText').html(data);
                            $('#divSolution').show();
                            $('#voirSolution').text("Cacher les solutions");
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            else {
                $('#divSolution').show();
                $('#voirSolution').text("Cacher les solutions");
            }
        }
        else {
            $('#voirSolution').text("Voir les solutions")
        }

    });


    $('#voirIndice').click(function () {
        if ($('#voirIndice').text() == "Voir l\'indice") {
            $('#indiceDiv').show();
            $('#voirIndice').text('Cacher l\'indice');
        }
        else {
            $('#indiceDiv').css("display", "none");
            $('#voirIndice').text('Voir l\'indice');
        }
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
                        $("#img").attr("src","/images/green-check-circle.png");
                        $('#divProposer').show();
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

    $('#proposerSolution').click(function () {
        $(this).css("display", "none");
        $('#envoyerSolution').show();
        $('#solutionTextArea').show();
    });

    $('#envoyerSolution').click(function () {
        var solution = $('#solutionTextArea').val();
        var idChallenge = $('#pId').text();
        $('#solutionProposeeSuccess').css('display', 'none');
        $('#solutionProposeeFail').css('display', 'none');
        if (solution != "") {
            $.ajax({
                url: '/api/challenges/proposerSolution/' + idChallenge,
                type: 'POST',
                dataType: 'json',
                data: 'solution=' + solution,
                contentType: 'application/x-www-form-urlencoded',
                success: function () {
                    $('#solutionProposeeSuccess').show();
                    $('#proposerSolution').show();
                    $('#envoyerSolution').css('display', 'none');
                    $('#solutionTextArea').css('display', 'none');
                },
                error: function () {
                    $('#message').text('Il y a eu une erreur lors de la soumission de la proposition. Assurez-vous d\'avoir validé le challenge avant de proposer une solution !');
                    $('#solutionProposeeFail').show();
                }
            });
        }
        else {
            $('#message').text('Veuillez renseigner une solution !');
            $('#solutionProposeeFail').show();
        }
    });
});