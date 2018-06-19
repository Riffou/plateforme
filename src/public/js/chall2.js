function connexion(){
    var a = prompt("Nom d'utilisateur :", "");
    var b = prompt("Mot de passe :", "");
    var o = ["si:facileadecoder"];
    var i;
    for (i = 0; i < o.length; i++)
    {
        if (o[i].indexOf(a) == 0)
        {
            var s = o[i].split(":");
            var c = s[0];
            var d = s[1];
            if (a == c && b == d)
            {
                alert("Bravo, ce mot de passe est aussi le flag du challenge pour le valider !");
            }
            else
            {
                alert("L'identifiant ou le mot de passe sont incorrects...")
            }
        }
        else
        {
            alert("L'identifiant ou le mot de passe sont incorrects...")
        }
    }
}
