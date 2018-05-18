$("document").ready(function () {
    $('#sauvegarderChallenges').click(function() {
        var sendBoolean = true;
        var dataChallenges = {};
        var keys = [];
        $(".p-challenges").each(function(){
            keys.push($(this).text());
            dataChallenges[$(this).text()] = [];
        });

        var i = 0;
        var index = 0;
        $("#formChallenges input").each(function() {
            if ($.trim($(this).val()).length == 0) {
                $('#pError').text("Veuillez renseigner tous les champs !");
                $('#error').show();
                sendBoolean = false;
            }
            dataChallenges[keys[index]].push($(this).val());
            i = i+1;
            if ((i % 2 == 0) && i > 0) {
                index = index + 1;
            }
        });
        // check if order is OK
        var order = [];
        var length = Object.keys(dataChallenges).length;
        for (var key in dataChallenges) {
            var number = dataChallenges[key][0];
            if (number > length) {
                $('#pError').text("L'ordre n'est pas correct !");
                $('#error').show();
                sendBoolean = false;
            }
            order.push(parseInt(dataChallenges[key][0]));
        }
        for (i = 0; i < order.length; i++) {
            if (!(order.includes(i+1))) {
                $('#pError').text("L'ordre n'est pas correct !");
                $('#error').show();
                sendBoolean = false;
            }
        }
        // order is OK send AJAX
        if (sendBoolean) {
            $.ajax({
                url: '/admin/challenges/update',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                data: 'json=' + JSON.stringify(dataChallenges),
                success: function () {
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    $('.supprimerButton').click(function () {
        var targetURL = $(this).attr('href');
        var nomChallenge = $(this).attr('name');
        $('#messageModal').text("Souhaitez vous vraiment supprimer le challenge : " + nomChallenge + "  ?");
        $('#confirmerModal').click(function () {
            window.location.href = targetURL;
        });
    });
});