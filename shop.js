/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:
GM ONLY
!store - Pulls up the Menu and allows the GM to create and modify Stores
    --create - Allows the GM to create a Store.
        --name {Insert Name} - sets the Name of a Store (required)
    --inv view/edit/generate/reset - allows the GM to view, edit or generate the Inventory of a certain Store.
        --{Insert existing Store name/number} - specifies which Store's inventory you will view/edit/generate by name. Alternatively specifies the Store by number (the order you have created the stores in, starting at 1)
            Edit Only
            --item {Insert existing Item name/number} - edit a specific Item
                --name {Insert new Name} - change the Name of an Item
                --desc {Insert new Description} - change the Description of an Item
                --mods {Insert new Modifiers} - change the Modifiers of an Item. (If you are unsure what to put, check the Wiki)
                --prop {Insert new Properties} - change the Properties of an Item. (E.g. Light, Heavy, Two-Handed)
                --price {Insert new Price} - change the Price (GP) of an Item. (Must be positive Number)
                --amount {Insert new Item amount} - change the Amount of Items you will receive upon buying. (Must be a positive, whole number and at least 1)
            View Only
            --item {Insert existing Item name/number} - view a specific Item (leave empty to view all items)
        Generate Only
        --type {Insert Item Type} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity} - generate a random Inventory based on Item Type and Rarity. (A list of available Types and Rarities can be found in the Wiki.)
    --{Insert existing Store name/number} - shows you all Informations about a certain Store
        --players - add this option if you want to show a certain Store to the Players
        --hdc {Insert new Haggle DC} - sets the Haggle DC for a certain Store
        --inflate {Insert number from 1-100} - set a percentage of Inflation for higher prices.
        --deflate {Insert number from 1-100} - set a percentage of Deflation for lower prices.
    --activate {Insert exisiting Store name/number} - activates a certain Store and makes it visible to Players.
    --deactivate {Insert existing Store name/number} - deactivates a certain Store and makes it visible to the GM only.
GM & Players
!shop - Pulls up a Menu where all active Stores and Options are displayed
    --{Insert existing Shop name/number} - selects a certain Shop
        --buy {Insert Item name/number} - allows you to buy a certain item.
            --amount {Insert amount} - increases the amount of Items you buy
        --haggle - Pulls up the Haggling menu
            --amount - sets the amount you want to haggle for
                --{Insert Skill} - sets the skill used in haggling (Persuasion or Intimidation)
*/

var ItemStore = ItemStore || (function() {
    'use strict';
    
    var version = '1.5a',
    
    setDefaults = function() {
        state.store = [];
    },

    handleInput = function(msg) {
        var args=msg.content.split(/\s+--/);
        if (msg.type!=="api") {
            return;
        }
        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case '!store':
                    if (args[1]==undefined) {
                        storeMenu();
                    } else if (args[1]=="create") {
                        if (args[2]==undefined) {
                            sendChat("Item Store","/w gm You must define a name when creating a new Store.");
                        } else {
                            createStore(args[2]);
                        }
                    } else if (args[1].includes("inv")) {
                        let option=args[1].replace("inv ","");
                        if (option=="view") {
                            if (args[2]==undefined) {
                                sendChat("Item Store","/w gm You must specify a Store when viewing the Inventory.");
                            } else {
                                if (args[3]==undefined) {
                                    showInv(args[2],args[3]);
                                } else {
                                    showInv(args[2],args[3].replace("item ",""));
                                }
                            }
                        } else if (option=="edit") {
                            if (args[2]==undefined) {
                                sendChat("Item Store","/w gm You must specify a Store when editing the Inventory.");
                            } else {
                                if (args[3].replace("item ","")=="") {
                                    sendChat("Item Store","/w gm You must specify an Item that you wish to edit.");
                                } else {
                                    editInv(args[3],args[4],args[5],args[6],args[7],args[8],args[9]);
                                }
                            }
                        } else if (option=="generate"||option=="gen") {
                            if (args[2]==undefined) {
                                sendChat("Item Store","/w gm You must specify the type of Items that should be generated.");
                            } else if (args[2].replace("type ","")=="" || !typelist.includes(args[2].replace("type ",""))) {
                                sendChat("Item Store","/w gm The specified Type does not exist, please refer to the Wiki to see which Types are available!");
                            } else if (typelist.includes(args[2].replace("type ",""))) {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w gm You must specify a minimum rarity for generated Items!");
                                } else if (args[3].replace("minrare ","")=="" || !rarelist.includes(args[3].replace("minrare ",""))) {
                                    sendChat("Item Store","/w gm The specified Minimum Rarity does not exist, please refer to the Wiki to see which Rarities are available!");
                                } else if (rarelist.includes(args[3].replace("minrare",""))) {
                                    if (args[4]==undefined) {
                                        sendChat("Item Store","/w gm You must specify a maximum rarity for generated Items!");
                                    } else if (args[4].replace("maxrare ","")=="" || !rarelist.includes(args[4].replace("maxrare ",""))) {
                                        sendChat("Item Store","/w gm The specified Maximum Rarity does not exist, please refer to the Wiki to see which Rarities are available!");
                                    } else if (rarelist.includes(args[4].replace("maxrare ",""))) {
                                        createInv(args[2].replace("type ",""),args[3].replace("minrare ",""),args[4].replace("maxrare ",""));
                                    }
                                }
                            }
                        } else if (option=="reset") {
                            if (args[2]==undefined) {
                                sendChat("Item Store","/w gm You must specify a Store that you want to reset.");
                            } else {
                                resetInv(args[2])
                            }
                        }
                    } else if (args[1].includes("activate")) {
                        if (args[1].replace("activate ","")=="") {
                            sendChat("Item Store","/w gm You must specify a Store that you want to activate.");
                        } else {
                            activateStore(args[1].replace("activate ",""));
                        }
                    } else if (args[1].includes("deactivate")) {
                        if (args[1].replace("activate ","")=="") {
                            sendChat("Item Store","/w gm You must specify a Store that you want to deactivate.");
                        } else {
                            deactivateStore(args[1].replace("activate ",""));
                        }
                    } else {
                        if (args[2]==undefined) {
                            storeMenu(args[1]);
                        } else if (args[2]=="players" || args[2]=="player") {
                            showStore(args[1])
                        } else if (args[2].includes("inflate")) {
                            if (args[2].replace("inflate ","")!==Number) {
                                sendChat("Item Store","/w gm You must specify an amount to inflate prices by.");
                            } else if (Number(args[2].replace("inflate ",""))<1 || Number(args[2].replace("inflate ",""))>100) {
                                sendChat("Item Store","/w gm The Inflation amount must be a Number between 1 and 100!");
                            } else {
                                inflatePrice(args[1],Number(args[2].replace("inflate ","")));
                            }
                        } else if (args[2].includes("deflate")) {
                            if (args[2].replace("deflate ","")!==Number) {
                                sendChat("Item Store","/w gm You must specify an amount to deflate prices by.");
                            } else if (Number(args[2].replace("deflate ",""))<1 || Number(args[2].replace("deflate ",""))>100) {
                                sendChat("Item Store","/w gm The Deflation amount must be a Number between 1 and 100!");
                            } else {
                                deflatePrice(args[1],Number(args[2].replace("deflate ","")));
                            }
                        }
                    }
                return;
            }
        }
        switch (args[0]) {
            case '!shop':
                if (args[2]==undefined) {
                    shopMenu(args[1],msg);
                } else if (args[2].includes("buy")) {
                    purchaseItem(args[1],args[2].replace("buy ",""),args[3],msg);
                } else if (args[2]=="haggle") {
                    if (args[3]==undefined) {
                        haggleMenu(msg);
                    } else {
                        if (args[4]==undefined) {
                            sendChat("Item Store","/w "+msg.who+" You must specify a skill to use in Haggling!")
                        } else if (args[4].toLowerCase()!=="persuasion" || args[4].toLowerCase()!=="intimidation") {
                            sendChat("Item Store","/w "+msg.who+" Please select either Persuasion or Intimidation as your Skill used for Haggling!");
                        } else if (args[4].toLowerCase()=="persuasion" || args[4].toLowerCase()=="intimidation") {
                            haggle(args[1],args[3].replace("amount ",""),args[4],msg);
                        }
                    }
                }
            return;
        }
    },

    storeMenu = function(store) {

    },

    createStore = function(name) {

    },

    showInv = function(store,item) {

    },

    editInv = function(store,item,name,desc,mods,prop,price,weight,amount) {

    },

    createInv = function(type,minrare,maxrare) {

    },

    resetInv = function(store) {

    },

    activateStore = function(store) {

    },

    deactivateStore = function(store) {

    },

    showStore = function(store) {

    },

    inflatePrice = function(store,amount) {

    },

    deflatePrice = function(store,amount) {

    },

    shopMenu = function(store,msg) {

    },

    purchaseItem = function(store,item,amount,msg) {

    },

    haggleMenu = function(msg) {

    },

    haggle = function(store,amount,skill) {

    },
    
    checkInstall = function() {
        if (!state.store) {
            setDefaults();
        }
    },
    
    registerEventHandlers = function() {
        on('chat:message', handleInput);
	};


	return {
	    CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
	
}());
on("ready",function(){
	'use strict';
	ItemStore.CheckInstall();
	ItemStore.RegisterEventHandlers();
});
