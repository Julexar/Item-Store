/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:
GM ONLY
!store - Pulls up the Menu and allows the GM to create and modify Stores
    --create - Allows the GM to create a Store.
        --name {Insert Name} - sets the Name of a Store (required)
    --inv edit/generate/reset - allows the GM to view, edit or generate the Inventory of a certain Store.
        --{Insert existing Store name/number} - specifies which Store's inventory you will edit/generate/reset by name. Alternatively specifies the Store by number (the order you have created the stores in, starting at 1)
            Edit Only
            --item {Insert existing Item name/number} - edit a specific Item
                --add - Adds a new Item
                    --name {Insert new Name} - change the Name of an Item
                    --desc {Insert new Description} - change the Description of an Item
                    --mods {Insert new Modifiers} - change the Modifiers of an Item. (If you are unsure what to put, check the Wiki)
                    --prop {Insert new Properties} - change the Properties of an Item. (E.g. Light, Heavy, Two-Handed)
                    --price {Insert new Price} - change the Price (GP) of an Item. (Must be positive Number)
                    --amount {Insert new Item amount} - change the Amount of Items you will receive upon buying. (Must be a positive, whole number and at least 1)
                --remove - Removes an Item
            View Only
            --item {Insert existing Item name/number} - view a specific Item (leave empty to view all items)
        Generate Only
        --type {Insert Item Type} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity} - generate a random Inventory based on Item Type and Rarity. (A list of available Types and Rarities can be found in the Wiki.)
            --overwrite true/false - specify if you wish to Overwrite an already existing Inventory (put true if so, put false if not). Default: true
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
        state.store = [
            {
                name: "Test",
                inv: [
                    {
                        name: "Item",
                        desc: "Wondrous Item (uncommon);This is a Test item",
                        mods: "Item Type: Wondrous Item",
                        props: "",
                        price: 1,
                        weight: 1,
                        amount: 1
                    }    
                ],
                hdc: 10,
                cprice: 0,
                active: true
            }
        ];
    },
    
    setBasics = function() {
        state = {
            cur: "",
            typeList: "Weapon|Armor|Scroll|Potion|Mundane Item|Random",
            rareList: "Common|Uncommon|Rare|Very Rare|Legendary|Random"
        };
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
                        log("Right Way");
                        storeMenu(args[1]);
                    } else if (args[1]=="create") {
                        if (args[2]==undefined || args[2].replace("name ","")=="") {
                            sendChat("Item Store","/w gm You must define a name when creating a new Store.");
                        } else {
                            createStore(args[2]);
                        }
                    } else if (args[1]=="delete") {
                        if (args[2]==undefined || args[2].replace("name ","")=="") {
                            sendChat("Item Store","/w gm You must definie the Store you wish to delete.");
                        } else {
                            deleteStore(args[2]);
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
                                    editInv(args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10]);
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
                                        if (args[5]==undefined) {
                                            
                                        } else {
                                            createInv(args[2].replace("type ",""),args[3].replace("minrare ",""),args[4].replace("maxrare ",""),args[5].replace("overwrite ",""));
                                        }
                                    }
                                }
                            }
                        } else if (option=="reset") {
                            if (args[2]==undefined) {
                                sendChat("Item Store","/w gm You must specify a Store that you want to reset.");
                            } else {
                                resetInv(args[2]);
                            }
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
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        if (state.store.length>=1) {
            let storeList=[];
            for (let i=0;i<state.store.length;i++) {
                let shop=state.store[i];
                storeList[i]=shop.name;
            }
            if (store==undefined) {
                if (state.cur!=="" && state.cur!==undefined) {
                    let shop=state.store.find(s => s.name==state.cur);
                    if (shop!==undefined) {
                        let inv=shop.inv;
                        let invList='';
                        for (let i=0;i<inv.length;i++) {
                            let price=inv[i].price+(shop.cprice*inv[i].price);
                            let desc=inv[i].desc.split(";");
                            invList += '<tr ' + trstyle + '><td>' + inv[i].name + '</td><td>' + desc[0] + '</td><td style="text-align:center;">' +  price + '</td></tr>';
                        }
                        if (shop.active==true) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table>' + //--
                                '<tr><td>Current Store: </td><td><a ' + astyle1 + '" href="!store --?{Store?|' + storeList + '}">' + state.cur + ' (active)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><div style="text-align:center;">Inventory</div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<tr><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>' + //--
                                invList + //--
                                '</table>' + //--
                                '<table>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle1 + '" href="!store --' + state.cur + ' --hdc ?{Haggle DC?|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '<tr><td>Price Change %: ' + shop.cprice + '</td>' + //--
                                '</table>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inflate ?{Inflation Amount?|0}">Inflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --deflate ?{Deflation Amount?|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv edit">Edit Items</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite true">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --deactivate ' + state.cur + '">Deactivate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        } else if (shop.active==false) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table>' + //--
                                '<tr><td>Current Store: </td><td><a ' + astyle1 + '" href="!store --?{Store?|' + storeList + '}">' + state.cur + ' (inactive)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><div style="text-align:center;">Inventory</div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<tr><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>' + //--
                                invList + //--
                                '</table>' + //--
                                '<table>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle1 + '" href="!store --' + state.cur + ' --hdc ?{Haggle DC?|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '<tr><td>Price Change %: ' + shop.cprice + '</td>' + //--
                                '</table>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inflate ?{Inflation Amount?|0}">Inflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --deflate ?{Deflation Amount?|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv edit">Edit Items</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite true">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --activate ' + state.cur + '">Activate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        }
                    }
                } else {
                    for (let i=0;i<state.store.length;i++) {
                        let existing=findObjs({
                            _type: 'handout',
                        });
                        let handid;
                        let handnum;
                        let storeHandout;
                        let count=-1;
                        _.each(existing,function(handout) {
                            let name=handout.get('name');
                            if (name.includes(state.store[i].name)) {
                                count+=1;
                                handnum=Number(name.replace(state.store[i].name+" #",""));
                                if (name.includes(String(count))) {
                                    handid=handout.get('_id');
                                    storeHandout=handout;
                                }
                            }
                        });
                        let inv=state.store[i].inv;
                        let invList='';
                        for (let j=0;j<inv.length;j++) {
                            let price=inv[j].price+(state.store[i].cprice*inv[j].price);
                            let desc=inv[j].desc.split(";");
                            invList += '<tr ' + trstyle + '><td>' + inv[j].name + '</td><td>' + desc[0] + '</td><td style="text-align:center;">' +  price + '</td></tr>';
                        }
                        storeHandout.set("notes",'<div style="text-align:center;">Inventory</div><table '+tablestyle+">"+"<tr><th>Item</th><th>Description</th><th>Price (GP)</th></tr>"+invList+"</table>");
                    }
                    let count=0;
                    storeList=String(storeList).replace(",","|");
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Item Store</div>' + //--
                        '<div ' + substyle + '>GM Menu</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<table>' + //--
                        '<tr><td>Current Store: </td><td><a ' + astyle1 + '" href="!store --?{Store?|' + storeList + '}">' + state.cur + '</a></td></tr>' + //--
                        '</table>' + //--
                        '</div>'
                    );
                }
            } else if (store!==undefined) {
                if (store==Number) {
                    
                } else {
                    state.cur=store;
                    let shop=state.store.find(s => s.name==state.cur);
                    let inv=shop.inv;
                    let invList='';
                    for (let i=0;i<inv.length;i++) {
                        let price=inv[i].price+(shop.cprice*inv[i].price);
                        let desc=inv[i].desc.split(";");
                        invList += '<tr ' + trstyle + '><td>' + inv[i].name + '</td><td>' + desc[0] + '</td><td style="text-align:center;">' +  price + '</td></tr>';
                    }
                    if (shop.active==true) {
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Store</div>' + //--
                            '<div ' + substyle + '>GM Menu</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table>' + //--
                            '<tr><td>Current Store: </td><td><a ' + astyle1 + '" href="!store --?{Store?|' + storeList + '}">' + state.cur + ' (active)</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><div style="text-align:center;">Inventory</div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>' + //--
                            invList + //--
                            '</table>' + //--
                            '<table>' + //--
                            '<tr><td>Haggle DC: </td><td><a ' + astyle1 + '" href="!store --' + state.cur + ' --hdc ?{Haggle DC?|10}">' + shop.hdc + '</a></td></tr>' + //--
                            '<tr><td>Price Change %: ' + shop.cprice + '</td>' + //--
                            '</table>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inflate ?{Inflation Amount?|0}">Inflate Price</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --deflate ?{Deflation Amount?|0}">Deflate Price</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv edit">Edit Items</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite true">Generate Inventory</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv reset">Reset Inventory</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --deactivate ' + state.cur + '">Deactivate Store</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --players">Show to Players</a></div>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name of Store?|Insert Name}">Create new Store</a></div>' + //--
                            '</div>'
                        );
                    } else if (shop.active==false) {
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Store</div>' + //--
                            '<div ' + substyle + '>GM Menu</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table>' + //--
                            '<tr><td>Current Store: </td><td><a ' + astyle1 + '" href="!store --?{Store?|' + storeList + '}">' + state.cur + ' (inactive)</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><div style="text-align:center;">Inventory</div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>' + //--
                            invList + //--
                            '</table>' + //--
                            '<table>' + //--
                            '<tr><td>Haggle DC: </td><td><a ' + astyle1 + '" href="!store --' + state.cur + ' --hdc ?{Haggle DC?|10}">' + shop.hdc + '</a></td></tr>' + //--
                            '<tr><td>Price Change %: ' + shop.cprice + '</td>' + //--
                            '</table>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inflate ?{Inflation Amount?|0}">Inflate Price</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --deflate ?{Deflation Amount?|0}">Deflate Price</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv edit">Edit Items</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite true">Generate Inventory</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --inv reset">Reset Inventory</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --activate ' + state.cur + '">Activate Store</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --' + state.cur + ' --players">Show to Players</a></div>' + //--
                            '</div>'
                        );
                    }
                }
            }
        }
    },

    createStore = function(name) {
        //Creates a new Store
    },
    
    deleteStore = function(name) {
        //Deletes an existing Store
    },

    editInv = function(store,item,option,name,desc,mods,prop,price,weight,amount) {
        //Edit the Items in a Shop's Inventory
    },

    createInv = function(type,minrare,maxrare,overwrite) {
        //Generate a random Inventory
    },

    resetInv = function(store) {
        //Reset a Store's Inventory
    },

    activateStore = function(store) {
        //Activate a Store
    },

    deactivateStore = function(store) {
        //Deaktivate a Store
    },

    showStore = function(store) {
        //Shows a certain Store or all available Stores to Players.
    },

    inflatePrice = function(store,amount) {
        //Increase a Shop's price
    },

    deflatePrice = function(store,amount) {
        //Decrease a Shop's price
    },

    shopMenu = function(store,msg) {
        //Store Menu for Players
    },

    purchaseItem = function(store,item,amount,msg) {
        //Buy an Item and remove it from Inventory
    },

    haggleMenu = function(msg) {
        //Open the Haggling Menu to negotiate price
    },

    haggle = function(store,amount,skill) {
        //Negotiate Price based on Skillchecks
    },
    
    checkInstall = function() {
        if (state.store) {
            setDefaults();
        }
        if (!state) {
            setBasics();
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
