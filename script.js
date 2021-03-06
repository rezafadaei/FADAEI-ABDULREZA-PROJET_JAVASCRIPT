/* VARIABLES GLOBALES */
let produits;
var tableau = document.getElementById("tableau_commande");
var nombre_lignes = 0;
var somme =0;
var tva = 0;
var total_a_payer = 0;
var compteur = 0;
var i = 1;
var stmsg=true;
var tableau_boutons_ajouter = document.getElementsByClassName("btn_ajouter");

//récuperre liste des produits
$(function() {
    $.ajax({
        url : 'listesprd.json',
        type : 'GET',
        dataType : 'JSON',
        success : function(resultat, statut) {
            produits = resultat;
            let trois=produits.length;
            let compteurdiv=0;
            let divplus=0;
            for (let i = 0; i < produits.length; i++) {
                let prd = produits[i];
                compteurdiv+=1;
                let s='#divrayon'+divplus;
                $('#search').clear;
                $(s).append('<div class="col-md-4 produits">'+
                    '<figure><img src="'+prd.image+'" alt="'+prd.nom+'" class="img_products"><figcaption>'+
                    prd.nom+'<p class="prix_article"></p></figcaption></figure>'+
                    '<div class="prix_boutons">'+
                    '<div class="button_class">'+
                    '<button onclick="affichageButton(this,'+i+',0)" type="button" class="btn_ajouter" data-nom="'+prd.nom+'" data-prix ="'+prd.prix+' €" data-description="'+prd.nom+'">Ajouter au panier</button>'+
                    '<button onclick="affichageButton(this,'+i+',1)" type="button" class="btn_retirer" data-nom="'+prd.nom+'" data-prix ="'+prd.prix+' €" data-description="'+prd.nom+'">Retirer du panier</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>'
            );

                $('#resulist').append('<option value="' + prd.nom + '">' + prd.nom + '</option>');
                $('figcaption').css({"font-family": "Arial", "color": "#0966ff","font-size": "20px"});
                $('.prix_article').css({"color":"#0966ff",  "width": "75px","height": "30px","font-family": "Arial",
                "font-size": "18px", "text-align": "center", "margin": "10px 20px","margin-left":"auto","margin-right":"auto"});
                if(compteurdiv>2){
                    divplus+=1;
                    compteurdiv=0;
                    //alert(trois+"et "+compteurdiv);
                }
                trois-=1;

            }
        },
        error : function(resultat, statut, erreur) {
            $("#erreur-search").empty
            $("#erreur-search").append('<h4>erreur de serveur se produit : ' + erreur+'</h4>');
        },
        complete: function() {

        }
    });
});
function notifQnt() {
    stmsg?document.getElementById("qnt_message").style.display = "block":document.getElementById("qnt_message").style.display = "none";
}
function desactiveNotif() {
    document.getElementById("msgst").checked ?stmsg=false:stmsg=true;
}
/* FONCTION PRINCIPALE 
*  Permet de changer le type de bouton (Ajouter ou Retirer) et de modifier le tableau de "Ma commande"
*/

function affichageButton(bouton, emplacement_bouton,type_bouton){
    var tableau_boutons_ajouter = document.getElementsByClassName("btn_ajouter");
    var tableau_boutons_retirer = document.getElementsByClassName("btn_retirer");
    var reverse_bouton;
    var test;

    if(type_bouton%2==0){
        reverse_bouton = tableau_boutons_retirer[emplacement_bouton]; 
        ajouterLigneTableau(bouton);
        notifQnt();
        taillePanier();
    }else{
        reverse_bouton = tableau_boutons_ajouter[emplacement_bouton];
        retirerLigneTableau(bouton);
        taillePanier();
    }    
    
    if(bouton.style.display == "none"){
        bouton.style.display = "block";
        reverse_bouton.style.display = "none";
    }else{
        bouton.style.display = "none";
        test = reverse_bouton.style.display = "block";
    }
    
    affichageTotal();
    
}
function taillePanier() {
        if(tableau.rows.length<=4){
            document.getElementById("zone_commande").style.height="400px";
            document.getElementById("zone_commande").style.top="20%";
        }else if(tableau.rows.length>=5)
        {
            document.getElementById("zone_commande").style.height="800px";
            document.getElementById("zone_commande").style.top="-60px";

        }
}
/* Permet d'afficher l'ensemble des prix des articles au chargement de la page */

function affichagePrix(){
    var tableau_tarifs = document.getElementsByClassName("prix_article");
    
    for(let i = 0; i <9; i++){
        tableau_tarifs[i].innerHTML = $(tableau_boutons_ajouter[i]).data("prix");
    }
}
function  affichagePanier() {
        document.getElementById("zone_commande").style.display = "block";
}
function  hidePanier() {
    document.getElementById("zone_commande").style.display="none";
}



function ajouterLigneTableau(donnees){
    
    var nouvelle_ligne = tableau.insertRow(-1);
     
    var colonne_une = nouvelle_ligne.insertCell(0);
    colonne_une.innerHTML = $(donnees).data("description");
    
    var colonne_deux = nouvelle_ligne.insertCell(1);
    
    var saisie_quantite = document.createElement("input");
    saisie_quantite.setAttribute("type","number");
    saisie_quantite.setAttribute("name","saisie_quantite");
    saisie_quantite.setAttribute("min","1");
    saisie_quantite.setAttribute("max","10");
    saisie_quantite.setAttribute("class","saisie_quantite");
    saisie_quantite.setAttribute("size","10px");
    saisie_quantite.setAttribute("onchange","affichageTotal()")
    saisie_quantite.value = "1";
    colonne_deux.appendChild(saisie_quantite);
    

    var colonne_trois = nouvelle_ligne.insertCell(2);
    colonne_trois.innerHTML = $(donnees).data("prix");
    
    var colonne_quatre = nouvelle_ligne.insertCell(3);
    colonne_quatre.innerHTML = $(donnees).data("prix");
    
    nombre_lignes++;
}

function retirerLigneTableau(bouton){
    var longueur = tableau.length;
    i=1;
    
    while(i<9){
        if((tableau.rows[i].cells[0].innerHTML) == ($(bouton).data("description"))){
            tableau.deleteRow(i);
            nombre_lignes--;
            return true;
        }
        i++;
    }
}
    
function affichageTotal(){
    i = 1;
    somme = 0;
    tva = 0;
    total_a_payer = 0;
    
    if(nombre_lignes==0){
        document.getElementById("somme_total").innerHTML = "TOTAL &Agrave; PAYER : " + somme +"€"; 
    }
    
    var element = document.getElementsByClassName("saisie_quantite");
    
    while(i<=nombre_lignes){    
        
        if(element[i-1].value >= 11 || element[i-1].value <=0){

            alert("Quantité " + tableau.rows[i].cells[0].innerHTML+ " doit être entre 1 et 10, veuillez corriger sinon ca compte pas!");
        }else{
            var tarif_produit = parseFloat(tableau.rows[i].cells[2].innerHTML);
            tableau.rows[i].cells[3].innerHTML =  (element[i-1].value * tarif_produit).toFixed(2)+"€";
            somme +=  element[i-1].value * tarif_produit;
             }
        i++;
    }
    
    tva=somme*0.2;
    total_a_payer = somme + tva;
    document.getElementById("total_ht").innerHTML = "TOTAL HT : " + somme.toFixed(2);
    document.getElementById("tva_total").innerHTML = "TVA A 20% : " + tva.toFixed(2) + "€";
    document.getElementById("somme_total").innerHTML = "TOTAL &Agrave PAYER : " + total_a_payer.toFixed(2) + "€";
    
    compteurArticles(element);
}       


function compteurArticles(element){
    var compteur = 0;
    i=1;
    while(i<=nombre_lignes){
        if(element[i-1].value >= 11 || element[i-1].value <=0){}
        else{
        compteur += parseInt(element[i-1].value);
        }
        
        i++;
    }
    
    if(compteur==1 || compteur ==0){
        document.getElementById("compteur").innerHTML = "<a href='javascript:affichagePanier()'><i class=\"fas fa-shopping-cart\"></i>  Mon panier : "+ compteur + " article</a>";
    }else{
        document.getElementById("compteur").innerHTML = "<a href='javascript:affichagePanier()'><i class=\"fas fa-shopping-cart\"></i>  Mon panier : "+ compteur + " articles</a>";
    }
    
}


$('#search').on('keyup'||'change',function () {
    let trouve=$('#search').val();
    let res=false;
    $('#divrayon3').empty();
    for (let i = 0; i < produits.length; i++) {
                let prd = produits[i];
                if(prd.nom.match(trouve)){
                    $("#divrayon1").hide();
                    $("#divrayon2").hide();
                    $("#divrayon0").hide();
                    $('#divrayon3').show();
                    $('#divrayon3').append('<div class="col-md-4 produits">'+
                        '<figure><img src="'+prd.image+'" alt="'+prd.nom+'" class="img_products"><figcaption>'+
                         prd.nom+'<p class="prix_article"></p></figcaption></figure>'+
                        '<div class="prix_boutons">'+
                        '<div class="button_class">'+
                        '<button onclick="affichageButton(this,'+i+',0)" type="button" class="btn_ajouter" data-nom="'+prd.nom+'" data-prix ="'+prd.prix+' €" data-description="'+prd.nom+'">Ajouter au panier</button>'+
                        '<button onclick="affichageButton(this,'+i+',1)" type="button" class="btn_retirer" data-nom="'+prd.nom+'" data-prix ="'+prd.prix+' €" data-description="'+prd.nom+'">Retirer du panier</button>'+
                        '</div>'+
                        '</div>'+
                        '</div>');
                    $('figcaption').css({"font-family": "Arial", "color": "#0966ff","font-size": "20px"});
                    $('.prix_article').css({"color":"#0966ff",  "width": "75px","height": "30px","font-family": "Arial",
                        "font-size": "18px", "text-align": "center", "margin": "10px 20px","margin-left":"auto","margin-right":"auto"});
                    res=true;

                }


            }
    if(!res){
        $("#divrayon3").hide();
        $("#divrayon2").show();
        $("#divrayon0").show();
        $("#divrayon1").show();

    }
    }
);

