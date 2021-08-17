/********************************************************************************************************
* Google Summer of Code 2021 Project for Wikimedia Foundation                                           *
* Project Name : WikidataComplete                                                                       *
* Mentors: Dennis Diefenbatch,Andreas Both,Aleksandr Pervalov,Kunpeng Guo                               *
* Participant: Dhairya Khanna                                                                           *                        *                                                           
*                                                                                                       *
********************************************************************************************************/

(function(mw, $, wb) {
    "use strict";

    if (mw.config.get('wgNamespaceNumber') !== 0 || !mw.config.exists('wbEntityId')) {
        return;
    }

    var lang = mw.config.get('wgUserLanguage');
    var messages, entityid = mw.config.get('wbEntityId'), api = new mw.Api();

    messages = (function () {
        var translations = {
            de: {
                'title': 'Anweisungen aktualisieren',
                'more': 'mehr',
                'inverse': 'invers',
                'show-inverse': 'geholte Anweisungen anzeigen',
                'no-result': 'kein Ergebnis',
                'loading': 'laden...'
            },
            en: {
                'title1': 'You have these number of statements to approve',
                'title2': 'No statements to approve',
                'more': 'more',
                'inverse': 'inverse',
                'show-inverse': 'show fetched statements',
                'no-result': 'no result',
                'loading': 'loading...'
            },
            fr: {
                'title': 'Mettre à jour les relevés',
                'more': 'plus',
                'inverse': 'inverse',
                'show-inverse': 'afficher les déclarations récupérées',
                'no-result': 'pas de résultats',
                'loading': 'chargement...'
           },
           'zh-hans': {
                'title': '更新声明',
                'more': '更多',
                'inverse': '反向',
                'show-inverse': '显示获取的语句',
                'no-result': '无结果',
                'loading': '加载中...'
            },
            es:{
                'title': 'Actualizar declaraciones',
                'more': 'más',
                'inverse': 'inverso',
                'show-inverse': 'mostrar declaraciones recuperadas',
                'no-result': 'sin resultados',
                'loading': 'cargando...'

            },           
        },
        chain = mw.language.getFallbackLanguageChain(),
        len = chain.length,
        ret = {},
        i = len - 1;
        while (i >= 0) {
            if (translations.hasOwnProperty(chain[i])) {
                $.extend(ret, translations[chain[i]]);
            }
            i = i - 1;
        }
        return ret;
    }());
    //The length of the facts generated from the dataset.
    var facts_length = {};
    $.ajax({
        url: 'https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=' + entityid + '&format=json',
        async: false,
        dataType: 'json',
        success: function (data) {
        facts_length = data.length;
        }
    });
    //Function for generating message for the available facts 
    function start_menu(facts_length){
    var final_message = '';
        if(facts_length>0){
            final_message = (messages.title1 + ':  ' + String(facts_length));
    }
    else{
        final_message = (messages.title2);
    }
    return final_message;
    }
	//Generating a new random item to approve
	var newitem = {};
    $.ajax({
        url: "https://qanswer-svc3.univ-st-etienne.fr/fact/get?id=EMPTY&category=EMPTY&property=EMPTY",
        async: false,
        dataType: 'json',
        success: function(data) {
            newitem = data.wikidataLink;
        }
    });
    //Html for showcasing the facts
    var html = '\
        <h2 class="wb-section-heading section-heading wikibase-statements" dir="auto"><span id="inverseclaims" class="mw-headline"></span></h2>\
        <div class="wikibase-statementgrouplistview" id="inversesection" > \
             <div class="wikibase-listview"></div> \
             <div class="wikibase-showinverse" style="padding:10px;overflow:hidden;"></div> \
             <div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="'+ newitem +'" title="Find a new item"><span class="wb-icon"></span>New Item</a></span></div>\
        </div>';
        /*
        The following function is used to create claim using Wikidata APIs. 
        Want know about them? Check out the documentation: https://www.wikidata.org/w/api.php 
        */
        function createclaim(qid,pid,snak,sourceSnaks,snaksorder){
            var api = new mw.Api();
            api.get( { action: 'query', meta: 'tokens'}).then(
                function(aw) {
                    var token = aw.query.tokens.csrftoken;
                 return  api.post( { 
                        action: 'wbcreateclaim',    //Calling API to craete the claim
                        entity: qid,
                        property: pid,
                        snaktype: 'value',
                        value: snak,
                        summary : "[Edited with Recoin] (Wikidata:Recoin)",
                        token: token
                        }).then(function (data) {
                            var api = new mw.Api();
                            var token = mw.user.tokens.values.csrfToken;
                            return  api.post({

                                action: 'wbsetreference',   //Calling API to craete the reference
                                statement: data.claim.id,
                                snaks: JSON.stringify(sourceSnaks),
                                snaksorder: JSON.stringify(snaksorder),
                                token: token,
                                summary: "WIKIDATA_API_COMMENT"
                                })
                            }

                        ).then(
                               function(data2){
                                       console.log(data2);
                                       if(data2.success == 1)
                                         location.reload();
                               });       
                        });
                    }
    /*
    The main function for loading the data to the gadget.
    */    
    function loaditems() {
        var fetchurl = 'https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=' + entityid + '&format=json';
        $.getJSON(fetchurl,
        function( result1 ){
        for (var i=0; i< result1.length; i++){ 
        	        var statementgroup = '\
	                        <div id= "'+result1[i].id+ '" class="wikibase-statementgroupview listview-item" style = "border:5px solid #8F00FF;"> \
	                            <div class="wikibase-statementgroupview-property"> \
	                                <div class="wikibase-statementgroupview-property-label" dir="auto"> \
                                    <a href="https://www.wikidata.org/wiki/Property:' + result1[i].property + '">' + result1[i].question + '</a>\
	                                </div> \
	                            </div> \
	                            <div class="wikibase-statementlistview"> \
	                                <div class="wikibase-statementlistview-listview"> \
	                                </div> \
	                            </div> \
                 <div class="wikibase-statementview wb-normal listview-item wikibase-toolbar-item"> \
					<div class="wikibase-statementview-rankselector"><div class="wikibase-rankselector ui-state-disabled"> \
						<span class="ui-icon ui-icon-rankselector wikibase-rankselector-' + 'Normal Rank' + '"></span> \
					</div></div>  \
                    <div class="wikibase-statementview-mainsnak-container"> \
                        <div class="wikibase-statementview-mainsnak" dir="auto"> \
                            <div class="wikibase-snakview"> \
                                <div class="wikibase-snakview-property-container"> \
                                    <div class="wikibase-snakview-property" dir="auto"> \
                                    </div> \
                                </div> \
                                <div class="wikibase-snakview-value-container" dir="auto"> \
                                    <div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"> \
                                        <a href="' + result1[i].object[0].object + '" >' + result1[i].text + '</a>\
                                    </div> \
                                    </div>\
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <span class="wikibase-toolbar-container wikibase-edittoolbar-container">\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-save"><a class = "f2w-button f2w-property f2w-approve" href="#" title="" text-id = "' + result1[i].text + '" data-id = "'+ result1[i].property +'" url-id = "' + result1[i].object[0].object + '" " qualifier-id = "' + result1[i].evidence + '" " ref-id = "' + result1[i].wikipediaLink + '"><span class="wb-icon"></span>publish    </a></span></span></span>\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-cancel"><a class="f2w-button f2w-property f2w-reject" href = "#" title="" reject-id = "'+ result1[i].id +'"><span class="wb-icon"></span>reject</a></span></span></span>\
                    </span> \
                    <div class = wikibase-statementview-references-container>\
                        <div class = wikibase-statementview-references-heading>\
                            <a class="ui-toggler ui-toggler-toggle ui-state-default">\
                            <span class="ui-toggler-icon ui-icon ui-icon-triangle-1-s ui-toggler-icon3dtrans"></span>\
                            <span class="ui-toggler-label">1 reference</span>\
                            </a>\
                            <div class="wb-tr-app"><!----></div>\
                            </div>\
                            <div class="wikibase-statementview-references wikibase-initially-collapsed" style="display: block;"><div class="wikibase-listview2"><div class="wikibase-referenceview wikibase-referenceview-d5847b9b6032aa8b13dae3c2dfd9ed5d114d21b3">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-5a343e7e758a4282a01316d3e959b6e653b767fc">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P4656" href="/wiki/Property:P4656">Wikimedia import URL</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="' + entityid + '" href="' + result1[i].wikipediaLink + '">' + result1[i].wikipediaLink + '</a></div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div></div>\
<div class="wikibase-referenceview wikibase-referenceview-d4bd87b862b12d99d26e86472d44f26858dee639">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-f30cbd35620c4ea6d0633aaf0210a8916130469b">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P143" href="/wiki/Property:P143">evidence</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="Q8447" href="/wiki/Q8447">'+result1[i].evidence+'</a></div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div>\
<div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="#" title=""><span class="wb-icon"></span>add reference</a></span></div></div>\
                        </div>\
                    </div>\
                    </div>';
                    //To append the statements to the html.
                    $('#inversesection').find('.wikibase-listview').parent().append(statementgroup);    
                $('.f2w-approve').unbind('click').on('click',function(e){
                    //e.preventDefault();
                    e.stopPropagation();
                    let arg1 = e.target.getAttribute('data-id');    
                    let arg2 = e.target.getAttribute('text-id');    
                    let arg3 = e.target.getAttribute('url-id');
                    let arg4 = e.target.getAttribute('qualifier-id');
                    let arg5 = e.target.getAttribute('ref-id');
                    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": arg3.substring(32) });
                    var snaksorder = ["P4656","P1683"];
                    var sourceSnaks = {
                        "P4656": [
                            {
                                "snaktype": "value",
                                "property": "P4656",
                                "datavalue": {
                                    "value": arg5,
                                    "type": "string"
                                },
                                "datatype": "url"
                            }
                        ],
                        "P1683": [
                            {
                                "snaktype": "value",
                                "property": "P1683",
                                "datavalue": {
                                    "value": {
                                        "text": arg4,
                                        "language": "en"
                                    },
                                    "type": "monolingualtext"
                                },
                                "datatype": "monolingualtext"
                            }
                        ]
                    };
                    
                    createclaim(entityid, arg1,snak,sourceSnaks,snaksorder);
                    mw.notify ('You have successfully added the claim',
					{
						title: 'WikidataComplete-info',
						autoHide: true,
						type: 'info'
					}
				);
                    
                })
                $('.f2w-reject').unbind('click').on('click',function(e){
                    e.preventDefault();
                    mw.notify ('You have successfully rejected the claim',
					{
						title: 'WikidataComplete-info',
						autoHide: true,
						type: 'info'
					}
                    
				);

                let rej = e.target.getAttribute('reject-id');
                var settings = {
                    "url": "https://qanswer-svc3.univ-st-etienne.fr/fact/correct?userCookie=c51f3c6f-ef1c-41ff-b1ca-7a994666b93e&factId="+rej+"&correction=2",
                    "method": "POST",
                    "timeout": 0,
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                    location.reload();
                  });
                });
                

               
            }
        });
    }
    function init() {
        $('.wikibase-entitytermsview-heading').append(html);
        $('#inversesection').find('.wikibase-showinverse').append(
            $( '<a>' )
            .attr( 'href', '#' )
            .attr( 'style', 'border:2px solid #8F00FF;padding:10px 80px;' )
            .text(start_menu(facts_length))
            .click( function ( event ) {
                event.preventDefault();
                loaditems();
            })
        );
    }

    $(init);

}(mediaWiki, jQuery, wikibase));

