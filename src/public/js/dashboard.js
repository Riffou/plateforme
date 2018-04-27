$("document").ready(function () {
    $('#sauvegarderCategories').click(function (e) {
        $('#champManquant').css("display", "none");

        var sendBoolean = true;
        var dataCategories = {};
        var keys = [];
        $(".p-categories").each(function(){
            keys.push($(this).text());
            dataCategories[$(this).text()] = [];
        });

        var i = 0;
        var index = 0;
        $("#formCategories input").each(function() {
            if ($.trim($(this).val()).length == 0) {
                $('#pError').text("Veuillez renseigner tous les champs !");
                $('#error').show();
                sendBoolean = false;
            }
            dataCategories[keys[index]].push($(this).val());
            i = i+1;
            if ((i % 2 == 0) && i > 0) {
                index = index + 1;
            }
        });
        // check if order is OK
        var order = [];
        var length = Object.keys(dataCategories).length;
        for (var key in dataCategories) {
            var number = dataCategories[key][0];
            if (number > length) {
                $('#pError').text("L'ordre n'est pas correct !");
                $('#error').show();
                sendBoolean = false;
            }
            order.push(parseInt(dataCategories[key][0]));
        }
        console.log(order.length);
        console.log('test oui : ' + order.includes(1));
        console.log(order);
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
                url: '/admin/dashboard/categories/update',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                data: 'json=' + JSON.stringify(dataCategories),
                success: function () {
                    location.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });

    $('.supprimerButton').click(function (e) {
        var targetURL = $(this).attr('href');
        var nomCategorie = $(this).attr('name');
        $('#messageModal').text("Souhaitez vous vraiment supprimer la catégorie : " + nomCategorie + "  ?");
        $('#confirmerModal').click(function () {
            window.location.href = targetURL;
        });
    });
});