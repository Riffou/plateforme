$("document").ready(function () {
    $('#addButtonCours').click(function() {
        window.location.href = "/admin/dashboard/cours/form/" + $('#nomCategorieInput').val();
    });

    $('#sauvegarderCategories').click(function() {
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

    $('#sauvegarderCours').click(function() {

        var sendBoolean = true;
        var dataCours = {};
        var keys = [];
        $(".p-cours").each(function(){
            keys.push($(this).text());
            dataCours[$(this).text()] = [];
        });

        var i = 0;
        var index = 0;
        $("#formCours input").each(function() {
            if ($.trim($(this).val()).length == 0) {
                $('#pErrorCours').text("Veuillez renseigner tous les champs !");
                $('#errorCours').show();
                sendBoolean = false;
            }
            dataCours[keys[index]].push($(this).val());
            i = i+1;
            if ((i % 2 == 0) && i > 0) {
                index = index + 1;
            }
        });
        // check if order is OK
        var order = [];
        var length = Object.keys(dataCours).length;
        for (var key in dataCours) {
            var number = dataCours[key][0];
            if (number > length) {
                $('#pErrorCours').text("L'ordre n'est pas correct !");
                $('#errorCours').show();
                sendBoolean = false;
            }
            order.push(parseInt(dataCours[key][0]));
        }
        for (i = 0; i < order.length; i++) {
            if (!(order.includes(i+1))) {
                $('#pErrorCours').text("L'ordre n'est pas correct !");
                $('#errorCours').show();
                sendBoolean = false;
            }
        }
        // order is OK send AJAX
        if (sendBoolean) {
            $.ajax({
                url: '/admin/dashboard/cours/update',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                data: 'json=' + JSON.stringify(dataCours),
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
        var nomCategorie = $(this).attr('name');
        $('#messageModal').text("Souhaitez vous vraiment supprimer la catégorie ainsi que les cours associés à : " + nomCategorie + "  ?");
        $('#confirmerModal').click(function () {
            window.location.href = targetURL;
        });
    });

    $('.supprimerButtonCours').click(function () {
        var targetURL = $(this).attr('href');
        var nomCours = $(this).attr('name');
        console.log("coucou hibou");
        $('#messageModal').text("Souhaitez vous vraiment supprimer le cours : " + nomCours + "  ?");
        $('#confirmerModal').click(function () {
            window.location.href = targetURL;
        });
    });

    $('#nomCategorieInput').change(function() {
       // alert($('#nomCategorieInput').val());
        $.ajax({
            url: '/admin/dashboard/cours/',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            data: 'idUnite=' + $('#nomCategorieInput').val(),
            success: function (data) {
                $('#coursHTML').html("");
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';
                    html += '<td>';
                    html += '<p style="display:none" id="pCours' + i + '" class="p-cours">' + data[i].id  + '</p>';
                    html += '<input class="form-control col-sm-6" style="text-align: center;" value="' + data[i].ordre + '"></td>';
                    html += '<td><input class="form-control col-sm-12" value="' + data[i].nom + '"></td>';
                    html += '<td style="text-align: center;">' +
                        '<a role="button" class="editButton" href="/admin/dashboard/cours/form/modify/' + data[i].id + '"><img src="/images/edit.png" alt="" width="30px"></a>' +
                        '<a role="button" class="supprimerButtonCours" data-toggle="modal" name="' + data[i].nom + '" data-target="#confirmModal" href="/admin/dashboard/cours/delete/' + $('#nomCategorieInput').val() + '/' + data[i].id + '"><img src="/images/bin.png" alt="" width="30px"></a></td>';
                    html += '</tr>';
                }
                $('#coursHTML').append(html);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});

$(document).on("click", '.supprimerButtonCours', function() {
    var targetURL = $(this).attr('href');
    var nomCours = $(this).attr('name');
    console.log("coucou hibou");
    $('#messageModal').text("Souhaitez vous vraiment supprimer le cours : " + nomCours + "  ?");
    $('#confirmerModal').click(function () {
        window.location.href = targetURL;
    });
});