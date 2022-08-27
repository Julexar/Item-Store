/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:
GM ONLY
!store - Pulls up the Menu and allows the GM to create and modify Stores
    --create --name {Insert Name} - Allows the GM to create a new Store.
    --store {Insert existing Store name/number} - Shows the GM all Information about a certain Store.
        --inv view/edit/generate/reset - Allows the GM to edit, generate or reset the Inventory of the selected Store or view a specific item.
            Edit & View Only
            --item {Insert Item name/number} - Select a specific Item that you wish to edit/view.
                Edit Only
                --remove - Removes the selected Item
            --add - Adds a new Item
                --name {Insert new Name} - Set the Name of an Item
                --desc {Insert new Description} - Set the Description of an Item (Check the Wiki to see how a Description is structured)
                --mods {Insert new Modifiers} - Set the Modifiers of an Item. (Check the Wiki to see how Modifiers work)
                --props {Insert new Properties} - Set the Properties of an Item. (E.g. Light, Heavy, Two-Handed, etc.)
                --price {Insert new Price} - Set the Price (GP) of an Item. (Must be 0 or above)
                --amount {Insert new Amount} - Set the Amount of Items you will receive upon buying (Must be at least 1 and a whole number - no fractions!)
            Generate Only
            --type {Insert Item Type} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity} - Generate a random Inventory based on Item Type and Rarity. (For a list of available Types and Rarities, check the Wiki)
                --overwrite true/false - Select whether you wish you to Overwrite an already existing Inventory. (Put true if so, put false if not) Default: true
        --players - Add this Option if you want to show the selected Store to the Players.
        --name {Insert new Name} - Changes the Name of the selected Store.
        --hdc {Insert new Haggle DC} - Sets the Haggle DC for the selected Store. (Default: 10)
        --inflate {Insert number from 0.1 to Infinity} - Set a Percentage of Inflation to increase prices.
        --deflate {Insert number from 0.1 to Infinity} - Set a Percentage of Deflation to decrease prices.
        --activate - Activates the selected Store and makes it available for Players.
        --deactivate - Deactivates the selected Store and makes it visible to only the GM.
        --delete - Deletes the selected Store.
GM & Players
!shop - Pulls up a Menu where all active Stores and Options are displayed
    --cart {Insert Cart Number/Name} - Select a Cart to use. (Optional)
    --store {Insert existing Shop name/number} - selects a certain Shop
        --buy {Insert Item name/number} - Pulls up the Purchasing menu
            --amount {Insert amount} - increases the amount of Items you buy (Default: 1)
        --haggle - Pulls up the Haggling menu
            --amount - sets the amount you want to haggle for
                --{Insert Skill} - sets the skill used in haggling (Persuasion or Intimidation)
!cart - Pulls up the Shopping Cart Menu.
    --new - Creates a new Shopping Cart.
    --{Insert Cart Number/Name} - Shows you the content of the selected Cart.
        --rem {Insert Item name/num} - Removes an Item from your Cart.
!checkout --cart {Insert Cart #} - Purchase the Items in your Cart.
    --store {Insert Store Number/Name} --item {Insert Item Name/Number} - Purchase a specific item
*/

var ItemStore = ItemStore || (function() {
    'use strict';
    
    var version = '1.5',
    
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
                        amount: 1,
                        sellam: 1
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

    setCartDefault = function() {
        state.cart = [];
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
                        storeMenu(args[1]);
                    } else if (args[1]=="create") {
                        if (args[2]==undefined) {
                            sendChat("Item Store","/w gm Incorrect usage. The correct usage is `!store --create --name {Insert Name}`");
                        } else if (args[2].replace("name ","")=="" || args[2].replace("name ","")==" ") {
                            sendChat("Item Store","/w gm Please define a name for the Store you wish to create!");
                        } else {
                            createStore(args[2].replace("name ",""));
                        }
                    } else if (args[1].includes("store")) {
                        let store=args[1].replace("store ","");
                        if (store=="" || store==" ") {
                            sendChat("Item Store","/w gm Invalid Name/Number. Please check the existing Store Handouts to find out a Store's name/number.");
                        } else {
                            if (args[2]==undefined) {
                                storeMenu(args[1].replace("store ",""));
                            } else if (args[2].includes("inv")) {
                                let option=args[2].replace("inv ","");
                                if (option=="view") {
                                    if (args[3]==undefined) {
                                        itemMenu(store);
                                    } else if (args[3].replace("item ","")=="" || args[3].replace("item ","")==" ") {
                                        itemMenu(store);
                                    } else {
                                        let item=args[3].replace("item ","");
                                        itemMenu(store,item);
                                    }
                                } else if (option=="edit") {
                                    if (args[3]==undefined) {
                                        sendChat("Item Store","/w gm You must specify which Item you would like to edit.");
                                    } else if (args[3].includes("item")) {
                                        let item=args[3].replace("item ","");
                                        if (item=="" || item==" ") {
                                            sendChat("Item Store","/w gm You must specify which Item you would like to edit!");
                                        } else {
                                            if (args[4]==undefined) {
                                                editInv(store,item,undefined);
                                            } else if (args[4]=="remove") {
                                                editItem(store,item,args[4]);
                                            } else if (args[4].includes("name")) {
                                                let name=args[4].replace("name ","");
                                                if (name=="" || name==" ") {
                                                    sendChat("Item Store","/w gm The name of an Item cannot be empty!");
                                                } else {
                                                    if (args[5]==undefined) {
                                                        editInv(store,item,option,name);
                                                    } else if (args[5].includes("desc")) {
                                                        let desc=args[5].replace("desc ","");
                                                        if (args[6]==undefined) {
                                                            editInv(store,item,option,name,desc);
                                                        } else if (args[6].includes("mods")) {
                                                            let mods=args[6].replace("mods ","");
                                                            if (args[7]==undefined) {
                                                                editInv(store,item,option,name,desc,mods);
                                                            } else if (args[7].includes("props")) {
                                                                let props=args[7].replace("props ","");
                                                                if (args[8]==undefined) {
                                                                    editInv(store,item,option,name,desc,mods,props);
                                                                } else if (args[8].includes("price")) {
                                                                    let price=Number(args[8].replace("price ",""));
                                                                    if (args[9]==undefined) {
                                                                        editInv(store,item,option,name,desc,mods,props,price);
                                                                    } else if (args[9].includes("weight")) {
                                                                        let weight=Number(args[9].replace("weight ",""));
                                                                        if (args[10]==undefined) {
                                                                            editInv(store,item,option,name,desc,mods,props,price,weight);
                                                                        } else if (args[10].includes("amount")) {
                                                                            let amount=Number(args[10].replace("amount ",""));
                                                                            editInv(store,item,option,name,desc,mods,props,price,weight,amount);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        sendChat("/w gm Invalid Item. Please use the name/number of an existing Item");
                                    } else if (args[3].includes("add")) {
                                        addMenu(store,args[4],args[5],args[6],args[7],args[8],args[9],args[10]);
                                    }
                                } else if (option=="generate" || option=="gen") {
                                    if (args[3]==undefined) {
                                        sendChat("Item Store","/w gm You must define what Type and Rarity of Items you want to have in the Inventory!");
                                    } else if (args[3].includes("type")) {
                                        let type=args[3].replace("type ","");
                                        if ((type=="" || type==" ") || !state.typeList.includes(type)) {
                                            sendChat("Item Store","/w gm You must define the Type of Item you want in the Store. For a List of available Types, please check the [Wiki]()");
                                        } else if (state.typeList.includes(type)) {
                                            if (args[4]==undefined) {
                                                sendChat("Item Store","/w gm You must define a minimum Rarity!");
                                            } else if (args[4].includes("minrare")) {
                                                let minrare=args[4].replace("minrare ","");
                                                if ((minrare=="" || minrare==" ") || !state.rareList.includes(minrare)) {
                                                    sendChat("Item Store","/w gm You must define the minimum Rarity of Item you want in the Store. For a List of available Rarities, please check the [Wiki]()");
                                                } else if (state.rareList.includes(minrare)) {
                                                    if (args[5]==undefined) {
                                                        sendChat("Item Store","/w gm You must define a maximum Rarity!");
                                                    } else if (args[5].includes("maxrare")) {
                                                        let maxrare=args[5].replace("maxrare ","");
                                                        if ((maxrare=="" || maxrare==" ") || !state.rareList.includes(maxrare)) {
                                                            sendChat("Item Store","/w gm You must define the maximum Rarity of Item you want in the Store. For a List of available Rarities, please check the [Wiki]()");
                                                        } else if (state.rareList.includes(maxrare)) {
                                                            if (args[6]==undefined) {
                                                                createInv(type,minrare,maxrare,args[6]);
                                                            } else if (args[6].includes("overwrite")) {
                                                                let overwrite=args[6].replace("overwrite ","");
                                                                createInv(type,minrare,maxrare,overwrite);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (option=="reset") {
                                    resetInv(store);
                                }
                            } else if (args[2]=="player" || args[2]=="players") {
                                showStore(store);
                            } else if (args[2].includes("hdc")) {
                                let hdc=Number(args[2].replace("hdc ",""));
                                editStore(store,"hdc",hdc);
                            } else if (args[2].includes("name")) {
                                let name=args[2].replace("name ","");
                                if (name=="" || name==" ") {
                                    sendChat("Item Store","/w gm The new name of a Store cannot be empty!");
                                } else {
                                    editStore(store,"name",name);
                                }
                            } else if (args[2].includes("inflate")) {
                                let num=Number(args[2].replace("inflate ",""));
                                editStore(store,"cprice",num);
                            } else if (args[2].includes("deflate")) {
                                let num=Number(args[2].replace("deflate ",""));
                                editStore(store,"cprice",num);
                            } else if (args[2]=="activate") {
                                editStore(store,"active",true);
                            } else if (args[2]=="deactivate") {
                                editStore(store,"active",false);
                            } else if (args[2]=="delete") {
                                deleteStore(store);
                            }
                        } 
                    }
                return;
            }
        }
        switch (args[0]) {
            case '!shop':
                if (args[1]==undefined) {
                    shopMenu(args[1],undefined,msg);
                } else if (args[1].includes("cart")) {
                    let cart=args[1].replace("cart","");
                    if (cart=="" || cart==" ") {
                        cartMenu(undefined,msg);
                    } else {
                        cart=cart.replace(" ","");
                        if (args[2]==undefined) {
                            sendChat("Item Store","/w "+msg.who+" Please select a Store!");
                        } else if (args[2].includes("store")) {
                            let store=args[2].replace("store ","");
                            if (store=="" || store==" ") {
                                sendChat("Item Store","/w "+msg.who+" Please select a valid Store!");
                            } else {
                                if (args[3]==undefined) {
                                    shopMenu(store,cart,msg);
                                } else if (args[3].includes("buy")) {
                                    let item=args[3].replace("buy ","");
                                    if (item=="" || item==" ") {
                                        sendChat("Item Store","/w "+msg.who+" Please select a valid Item!");
                                    } else {
                                        if (args[4]==undefined) {
                                            addToCart(cart,store,item,args[4],msg);
                                        } else if (args[4].includes("amount")) {
                                            let amount=Number(args[4].replace("amount ",""));
                                            addToCart(cart,store,item,amount,msg);
                                        }
                                    }
                                } else if (args[3].includes("haggle","")) {
                                    if (args[4]==undefined) {
                                        haggleMenu(store,args[4],args[5],msg);
                                    } else if (args[4].includes("amount")) {
                                        let amount=Number(args[4].replace("amount ",""));
                                        if (args[5]==undefined) {
                                            haggleMenu(store,amount,args[5],msg);
                                        } else {
                                            let skill=args[5];
                                            if (skill.toLowerCase()!=="persuasion" || skill.toLowerCase()!=="intimidation") {
                                                sendChat("Item Store","/w "+msg.who+" You must select either Persuasion or Intimidation to Haggle!");
                                            } else {
                                                haggleMenu(store,amount,skill,msg);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (args[1].includes("store")) {
                    let store=args[1].replace("store ","");
                    if (store=="" || store==" ") {
                        sendChat("Item Store","/w "+msg.who+" Please select a valid store!");
                    } else {
                        if (args[2]==undefined) {
                            shopMenu(store,undefined,msg);
                        } else if (args[2].includes("buy")) {
                            let item=args[2].replace("buy ","");
                            if (item=="" || item==" ") {
                                sendChat("Item Store","/w "+msg.who+" Please select a valid Item!");
                            } else {
                                if (args[3]==undefined) {
                                    purchaseMenu(store,item,1,undefined,msg);
                                } else if (args[3].includes("amount")) {
                                    let amount=Number(args[3].replace("amount ",""));
                                    purchaseMenu(store,item,amount,undefined,msg);
                                }
                            }
                        } else if (args[2].includes("haggle")) {
                            if (args[3]==undefined) {
                                haggleMenu(store,args[3],args[4],msg);
                            } else if (args[3].includes("amount")) {
                                let amount=Number(args[3].replace("amount ",""));
                                if (args[4]==undefined) {
                                    haggleMenu(store,amount,args[4],msg);
                                } else {
                                    let skill=args[4].toLowerCase();
                                    if (skill!=="persuasion" || skill!=="intimidation") {
                                        sendChat("Item Store","/w "+msg.who+" You must select either Persuasion or Intimidation to Haggle!");
                                    } else {
                                        haggleMenu(store,amount,skill,msg);
                                    }
                                }
                            }
                        }
                    }
                }
            return;
            case '!cart':
                if (args[1]==undefined) {
                    cartMenu(args[1],msg);
                } else if (args[1]=="new") {
                    createCart(msg);
                } else {
                    if (args[2]==undefined) {
                        cartMenu(args[1],msg);
                    } else if (args[2].includes("rem")) {
                        let item=args[2].replace("rem ","");
                        removeItem(args[1],item);
                    }
                }
            return;
            case '!haggle':
                if (args[1]==undefined) {
                    sendChat("Item Store","/w "+msg.who+" You must select a valid Store!");
                } else if (args[1].includes("store")) {
                    let store=args[1].replace("store ","");
                    if (args[2]==undefined) {
                        sendChat("Item Store","/w "+msg.who+" You must select an amount to wish to haggle for!");
                    } else if (args[2].includes("amount")) {
                        let amount=Number(args[2].replace("amount ",""));
                        if (args[3]==undefined) {
                            sendChat("Item Store","/w "+msg.who+" You must select either Persuasion or Intimidation to Haggle!");
                        } else if (args[3].includes("skill")) {
                            let skill=args[3].replace("skill ","");
                            haggle(store,amount,skill);
                        }
                    }
                }
            return;
            case '!checkout':
                if (args[1].includes("cart")) {
                    let cart=Number(args[1].replace("cart ",""));
                    purchase("cart",cart);
                } else if (args[1].includes("item")){
                    purchase("item",args[1].replace("item ",""),args[2].replace("amount ",""),args[3].replace("store ",""));
                }
            return;
        }
    },

    storeMenu = function(store) {
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        if (store==undefined) {
            if (state.store.length==undefined || state.store.length==0) {
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Item Store</div>' + //--
                    '<div ' + headstyle + '>GM Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td>Current Store: </td><td>No existing Stores!</td></tr>' + //--
                    '</table>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                    '</div>'
                );
            } else if (state.store.length>=1) {
                let shopList=[];
                for (let i=0;i<state.store.length;i++) {
                    shopList[i]=state.store[i].name;
                }
                shopList=String(shopList).replace(",","|");
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Item Store</div>' + //--
                    '<div ' + substyle + '>GM Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table>' + //--
                    '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Select a Store|' + shopList + '}">None</a></td></tr>' + //--
                    '</table>' + //--
                    '<br><div style="text-align:center;">Inventory</div>' + //--
                    '<br><div style="text-align:center;">Unavailable</div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                    '</div>'
                );
            }
        } else {
            if (Number(store)) {
                if (state.store.length==undefined || state.store.length==0) {
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Item Store</div>' + //--
                        '<div ' + substyle + '>GM Menu</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<table>' + //--
                        '<tr><td>Current Store: </td><td>No existing Stores!</td></tr>' + //--
                        '</table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                        '</div>'
                    );
                } else if (state.store.length>=1) {
                    let shop=state.store[Number(store)];
                    let shopList=[];
                    let count=-1;
                    for (let i=0;i<state.store.length;i++) {
                        shopList[i]=state.store[i].name;
                    }
                    shopList=String(shopList);
                    for (let i=0;i<state.store.length;i++) {
                        shopList=shopList.replace(",","|");
                    }
                    if (shop==undefined) {
                        sendChat("Item Store","/w gm Could not find a Store with that Number!")
                    } else {
                        let inv=shop.inv;
                        let invList="";
                        let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                        for (let i=0;i<inv.length;i++) {
                            let price=inv[i].price+(shop.cprice*inv[i].price);
                            let desc=inv[i].desc.split(";");
                            if (i>=1) {
                                border="border-bottom: 1px solid #cccccc; ";
                            }
                            invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">'+ inv[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center;">' + price + '</td></tr>';
                        }
                        if (shop.active==true) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Select a Store|' + shopList + '}">' + shop.name + ' (active)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --hdc ?{Haggle DC|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br>Price Change %: ' + shop.cprice + '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --inflate ?{Inflation %|0}">Inflate Price</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --deflate ?{Deflation %|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv view">Item Menu</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity?|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --deactivate">Deactivate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle1 + '" href="!store --create --name ?{Shop name?|Insert Name}">Create Store</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --delete">Delete Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        } else if (shop.active==false) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Select a Store|' + shopList + '}">' + shop.name + ' (active)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --hdc ?{Haggle DC|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br>Price Change %: ' + shop.cprice + '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --inflate ?{Inflation %|0}">Inflate Price</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --deflate ?{Deflation %|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv view">Item Menu</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity?|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --deactivate">Deactivate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle1 + '" href="!store --create --name ?{Shop name?|Insert Name}">Create Store</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --delete">Delete Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        }
                    }
                }
            } else {
                if (state.store.length==undefined || state.store.length==0) {
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Item Store</div>' + //--
                        '<div ' + substyle + '>GM Menu</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<table>' + //--
                        '<tr><td>Current Store: </td><td>No existing Stores!</td></tr>' + //--
                        '</table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                        '</div>'
                    );
                } else if (state.store.length>=1) {
                    let shop;
                    let shopList;
                    for (let i=0;i<state.store.length;i++) {
                        if (state.store[i].name==store) {
                            shop=state.store[i];
                        }
                    }
                    if (shop==undefined) {
                        sendChat("Item Store","/w gm Could not find a Store with that Number!")
                    } else {
                        for (let i=0;i<state.store.length;i++) {
                            if (state.store[i].name!==shop.name) {
                                count++;
                                shopList[count]=state.store[i].name;
                            }
                        }
                        shopList=String(shopList);
                        for (let i=0;i<state.store.length;i++) {
                            shopList=shopList.replace(",","|");
                        }
                        let inv=shop.inv;
                        let invList="";
                        let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                        for (let i=0;i<inv.length;i++) {
                            let price=inv[i].price+(shop.cprice*inv[i].price);
                            let desc=inv[i].desc.split(";");
                            if (i>=1) {
                                border="border-bottom: 1px solid #cccccc; ";
                            }
                            invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">' + i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center;">' + price + '</td></tr>';
                        }
                        if (shop.active==true) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Select a Store|' + shopList + '}">' + shop.name + ' (active)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --hdc ?{Haggle DC|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br>Price Change %: ' + shop.cprice + '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --inflate ?{Inflation %|0}">Inflate Price</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --deflate ?{Deflation %|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv view">Item Menu</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity?|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --deactivate">Deactivate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle1 + '" href="!store --create --name ?{Shop name?|Insert Name}">Create Store</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --delete">Delete Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        } else if (shop.active==false) {
                            sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>GM Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Select a Store|' + shopList + '}">' + shop.name + ' (active)</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<table' + tablestyle + '>' + //--
                                '<tr><td>Haggle DC: </td><td><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --hdc ?{Haggle DC|10}">' + shop.hdc + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br>Price Change %: ' + shop.cprice + '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + shop.name + ' --inflate ?{Inflation %|0}">Inflate Price</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --deflate ?{Deflation %|0}">Deflate Price</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv view">Item Menu</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity?|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv reset">Reset Inventory</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --deactivate">Deactivate Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle1 + '" href="!store --create --name ?{Shop name?|Insert Name}">Create Store</a>' + //--
                                '<a ' + astyle3 + '" href="!store --store ' + shop.name + ' --delete">Delete Store</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --players">Show to Players</a></div>' + //--
                                '</div>'
                            );
                        }
                    }
                }
            }
        }
    },

    createStore = function(name) {
        //Creates a new Store
        let store=[
            {
                name: name,
                inv: [],
                hdc: 10,
                cprice: 0,
                active: true
            }
        ];
        let len=state.store.length+1;
        state.store[len]=store[0];
        sendChat("Item Store","/w gm Store with the name \""+name+"\" created!");
    },
    
    deleteStore = function(store) {
        //Deletes an existing Store
        let list=state.store;
        let num;
        for (let i=0;i<list.length;i++) {
            if (list[i].name==store) {
                state.store.splice(i);
                num=i;
            }
        }
        sendChat("Item Store","/w gm Store #"+num+" (\""+store+"\") deleted!");
    },
    
    itemMenu = function(store,item) {
        //Pulls up the Item Menu
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        store=state.store.find(s => s.name==store);
        if (store==undefined) {
            sendChat("Item Store","/w gm Could not find that Store, please input a valid Store!");
        } else {
            if (item==undefined) {
                let inv=store.inv;
                let itemList=[];
                let invList="";
                let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                for (let i=0;i<inv.length;i++) {
                    itemList[i]=inv[i].name;
                    let price=inv[i].price+(store.cprice*inv[i].price);
                    let desc=inv[i].desc.split(";");
                    if (i>=1) {
                        border="border-bottom: 1px solid #cccccc; ";
                    }
                    invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">' + i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center;">' + price + '</td></tr>';
                }
                itemList=String(itemList);
                for (let i=0;i<inv.length;i++) {
                    itemList=itemList.replace(",","|");
                }
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Store Inventory</div>' + //--
                    '<div ' + substyle + '>Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<div style="text-align:center;"><b>Inventory</b></div>' + //--
                    '<br>' + //--
                    '<table ' + tablestyle + '>' + //--
                    '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                    '<tbody>' + invList + '</tbody>' + //--
                    '</table>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv edit --add">Add Item</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv edit --item ?{Item?|' + itemList + '} --remove">Remove Item</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv view --item ?{Item?|' + itemList + '}">View Item</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv gen --type ?{Item Type?|' + state.typeList + '} --minrare ?{Minimum Rarity?|' + state.rareList + '} --maxrare ?{Maximum Rarity?|' + state.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                    '</div>'
                );
            } else {
                
            }
        }
    },
    
    addMenu = function(shop,name,desc,mods,props,price,amount,sellam) {
        //Pulls up Menu where you can add Items
    },

    editInv = function(store,item,option,name,desc,mods,prop,price,weight,amount) {
        //Edit the Items in a Shop's Inventory
    },

    createInv = function(type,minrare,maxrare,overwrite) {
        //Generate a random Inventory
    },

    resetInv = function(store) {
        //Reset a Store's Inventory
        let shop=state.store.find(s => s.name==store);
        shop.inv=[];
        let num;
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                num=i;
            }
        }
        state.store[i].inv=shop.inv;
        sendChat("Item Store","/w gm Inventory of Store \""+store+"\" has been reset!");
    },

    editStore = function(store,attr,val) {
        //Edit Store Settings
    },

    showStore = function(store,msg) {
        //Shows a certain Store or all available Stores to Players.
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
    },

    shopMenu = function(store,cart,msg) {
        //Store Menu for Players
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        if (Number(store)) {
            shop=state.store[store];
            if (shop==undefined) {
                sendChat("Item Store","/w "+msg.who+" Could not find that Store, please select an existing Store!");
            } else {
                let inv=shop.inv;
                let shopList=[];
                let itemList=[];
                let invList="";
                for (let i=0;i<state.store.length;i++) {
                    shopList[i]=state.store[i].name;
                }
                let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                for (let i=0;i<inv.length;i++) {
                    itemList[i]=inv[i].name;
                    let price=inv[i].price+(shop.cprice*inv[i].price);
                    let desc=inv[i].desc.split(";");
                    if (i>=1) {
                        border="border-bottom: 1px solid #cccccc; "
                    }
                    invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">' + i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center;">' + price + '</td></tr>';
                }
                for (let i=0;i<state.store.length;i++) {
                    shopList=String(shopList).replace(",","|");
                }
                for (let i=0;i<inv.length;i++) {
                    itemList=String(itemList).replace(",","|");
                }
                if (cart==undefined) {
                    let cartList=[];
                    let count=0;
                    if (state.cart.length==undefined) {

                    } else {
                        for (let i=0;i<state.cart.length;i++) {
                            if (state.cart[i].id==msg.playerid) {
                                cartList[count]=state.cart[i];
                                count++;
                            }
                        }
                        let num=cartList.length;
                        for (let i=0;i<num;i++) {
                            cartList=String(cartList).replace(",","|");
                        }
                        sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Store</div>' + //--
                            '<div ' + substyle + '>Player Menu</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ?{Store?|' + shopList + '}">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ?{Cart?|' + cartList + '} --store ' + shop.name + '">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                            '<tbody>' + invList + '</tbody>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --store ' + shop.name + ' --buy ?{Item?|' + itemList + '} --amount ?{Amount?|1}">Purchase Item</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --store ' + shop.name + ' --haggle">Haggle Price</a></div>' + //--
                            '</div>'
                        );
                    }
                } else {
                    if (Number(cart)) {
                        cart=state.cart[cart];
                        if (cart==undefined) {
                            cartMenu(undefined);
                        } else if (cart.id!==msg.playerid) {
                            sendChat("Item Store","/w "+msg.who+" You do not own that Cart! Please select a Cart that you own!");
                        } else if (cart.id==msg.playerid) {
                            let cartList=[];
                            let count=0;
                            for (let i=0;i<state.cart.length;i++) {
                                if (state.cart[i].id==msg.playerid) {
                                    cartList[count]=state.cart[i].name;
                                    count++;
                                }
                            }
                            sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>Player Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ' + cart.name + ' --shop ?{Shop?|' + shopList + '}">' + shop.name + '</a></td></tr>' + //--
                                '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ?{Cart?|' + cartList + '} --shop '+ shop.name + '">' + cart.name + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart.name + ' --store ' + shop.name + ' --buy ?{Item?|' + itemList + '} --amount ?{Amount?|1}">Add Item to Cart</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --' + cart.name + '">View Cart Content</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart.name + ' --store ' + shop.name + ' --haggle">Haggle Price</a></div>' + //--
                                '</div>'
                            );
                        }
                    } else {
                        cart=state.cart.find(c => c.name==cart);
                        if (cart==undefined) {
                            sendChat("Item Store","/w "+msg.who+" Could not find that Cart, please select an existing Cart or create a new one!");
                        } else if (cart.id!==msg.playerid) {
                            sendChat("Item Store","/w "+msg.who+" You do not own that Cart! Please select a Cart that you own!");
                        } else if (cart.id==msg.playerid) {
                            let cartList=[];
                            let count=0;
                            for (let i=0;i<state.cart.length;i++) {
                                if (state.cart[i].id==msg.playerid) {
                                    cartList[count]=state.cart[i].name;
                                    count++;
                                }
                            }
                            sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                                '<div ' + headstyle + '>Item Store</div>' + //--
                                '<div ' + substyle + '>Player Menu</div>' + //--
                                '<div ' + arrowstyle + '></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ' + cart + ' --shop ?{Shop?|' + shopList + '}">' + shop.name + '</a></td></tr>' + //--
                                '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ?{Cart?|' + cartList + '} --shop '+ shop.name + '">' + cart + '</a></td></tr>' + //--
                                '</table>' + //--
                                '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                                '<table ' + tablestyle + '>' + //--
                                '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                                '<tbody>' + invList + '</tbody>' + //--
                                '</table>' + //--
                                '<br><br>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart + ' --store ' + shop.name + ' --buy ?{Item?|' + itemList + '} --amount ?{Amount?|1}">Add Item to Cart</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --' + cart + '">View Cart Content</a></div>' + //--
                                '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart + ' --store ' + shop.name + ' --haggle">Haggle Price</a></div>' + //--
                                '</div>'
                            );
                        }
                    }
                }
            }
        } else {
            let shop=state.store.find(s => s.name==store);
            if (shop==undefined) {
                sendChat("Item Store","/w "+msg.who+" Could not find that Store, please select an existing Store!");
            } else {
                let inv=shop.inv;
                let shopList=[];
                let itemList=[];
                let invList="";
                for (let i=0;i<state.store.length;i++) {
                    shopList[i]=state.store[i].name;
                }
                let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                for (let i=0;i<inv.length;i++) {
                    itemList[i]=inv[i].name;
                    let price=inv[i].price+(shop.cprice*inv[i].price);
                    let desc=inv[i].desc.split(";");
                    if (i>=1) {
                        border="border-bottom: 1px solid #cccccc; "
                    }
                    invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">' + i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + inv[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center;">' + price + '</td></tr>';
                }
                shopList=String(shopList);
                for (let i=0;i<state.store.length;i++) {
                    shopList=shopList.replace(",","|");
                }
                itemList=String(itemList);
                for (let i=0;i<inv.length;i++) {
                    itemList=itemList.replace(",","|");
                }
                if (cart==undefined) {
                    let cartList=[];
                    let count=0;
                    if (state.cart.length==undefined || state.cart.length==0) {
                        cartMenu(undefined,msg);
                    } else {
                        for (let i=0;i<state.cart.length;i++) {
                            if (state.cart[i].id==msg.playerid) {
                                cartList[count]=state.cart[i];
                                count++;
                            }
                        }
                        cartList=String(cartList);
                        for (let i=0;i<count;i++) {
                            cartList=cartList.replace(",","|");
                        }
                        sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Store</div>' + //--
                            '<div ' + substyle + '>Player Menu</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ?{Store?|' + shopList + '}">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ?{Cart?|' + cartList + '} --store ' + shop.name + '">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                            '<tbody>' + invList + '</tbody>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --store ' + shop.name + ' --buy ?{Item?|' + itemList + '} --amount ?{Amount?|1}">Purchase Item</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --store ' + shop.name + ' --haggle">Haggle Price</a></div>' + //--
                            '</div>'
                        );
                    }
                } else {
                    cart=state.cart.find(c => c.name==cart);
                    if (cart==undefined) {
                        sendChat("Item Store","/w "+msg.who+" Could not find that Cart, please select an existing Cart or create a new one!");
                    } else if (cart.id!==msg.playerid) {
                        sendChat("Item Store","/w "+msg.who+" You do not own that Cart! Please select a Cart that you own!");
                    } else if (cart.id==msg.playerid) {
                        let cartList=[];
                        let count=0;
                        for (let i=0;i<state.cart.length;i++) {
                            if (state.cart[i].id==msg.playerid) {
                                cartList[count]=state.cart[i].name;
                                count++;
                            }
                        }
                        cartList=String(cartList);
                        for (let i=0;i<count;i++) {
                            cartList=cartList.replace(",","|");
                        }
                        sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Store</div>' + //--
                            '<div ' + substyle + '>Player Menu</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ' + cart + ' --shop ?{Shop?|' + shopList + '}">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --cart ?{Cart?|' + cartList + '} --shop '+ shop.name + '">' + cart + '</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br><div style="text-align:center;"><b>Inventory</b></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
                            '<tbody>' + invList + '</tbody>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart + ' --store ' + shop.name + ' --buy ?{Item?|' + itemList + '} --amount ?{Amount?|1}">Add Item to Cart</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --' + cart + '">View Cart Content</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --cart ' + cart + ' --store ' + shop.name + ' --haggle">Haggle Price</a></div>' + //--
                            '</div>'
                        );
                    }
                }
            }
        }
    },

    purchaseMenu = function(store,item,amount,char,msg) {
        //Pull up the Purchasing Menu
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        let invList="";
        if (amount==undefined) {
            amount=1;
        }
        store=state.store.find(s => s.name==store);
    },

    addToCart = function(cart,store,item,msg) {
        //Add Items to a Shopping Cart
    },

    cartMenu = function(cart,msg) {
        //Pull up Shopping Cart Menu
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        if (cart==undefined || cart=="" || cart==" ") {
            if (state.cart.length==undefined || state.cart.length==0) {
                sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Shopping Cart</div>' + //--
                    '<div ' + substyle + '>Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<div style="text-align:center;"><b>No existing Carts!</b></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --new">Create new Cart</a></div>' + //--
                    '</div>'
                );
            } else {
                let cartList=[];
                let count=0;
                for (let i=0;i<state.cart.length;i++) {
                    if (state.cart[i].id==msg.playerid) {
                        cartList[count]=state.cart[i].name;
                        count++;
                    }
                }
                cartList=String(cartList);
                for (let i=0;i<count;i++) {
                    cartList=cartList.replace(",","|");
                }
                sendChat("Item Store","/w " + msg.who + " <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Shopping Cart</div>' + //--
                    '<div ' + substyle + '>Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table ' + tablestyle + '>' + //--
                    '<tr><td>Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cart --?{Cart?|' + cartList + '}">None</a></td></tr>' + //--
                    '</table>' + //--
                    '</div>'
                );
            }
        } else {
            for (let i=0;i<state.cart.length;i++) {
                if (state.cart[i].name==cart) {
                    cart=state.cart[i];
                }
            }
            let cartList=[];
            let count=0;
            for (let i=0;i<state.cart.length;i++) {
                if (state.cart[i].id==msg.playerid) {
                    cartList[count]=state.cart[i].name;
                    count++;
                }
            }
            if (cart==undefined) {
                sendChat("Item Store","/w "+msg.who+" No such Cart exists!");
            } else {
                let invList="";
                let itemList=[]
                let border="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; ";
                if (cart.content.length==undefined || cart.content.length==0) {
                    invList='<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;"> </td><td style="border-right: 1px solid #cccccc; text-align:center;"> </td><td style="border-right: 1px solid #cccccc; text-align:center;"> </td><td style="border-right: 1px solid #cccccc; text-align:center;"> </td><td style="text-align:center; border-right: 1px solid #cccccc;"> </td><td style="text-align:center;"> </td></tr>';
                } else {
                    for (let i=0;i<cart.content.length;i++) {
                        let price=cart.content[i].price;
                        let desc=cart.content[i].desc.split(";");
                        if (i>=1) {
                            border="border-bottom: 1px solid #cccccc; "
                        }
                        invList += '<tr style="'+border+'border-left:1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc; text-align:center;">'+ i + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + cart.content[i].amount + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + cart.content[i].name + '</td><td style="border-right: 1px solid #cccccc; text-align:center;">' + desc[0] + '</td><td style="text-align:center; border-right: 1px solid #cccccc;">' + price + '</td><td style="text-align:center;">' + cart.content[i].shop + '</td></tr>';
                        itemList[i]=cart.content[i].name;
                    }
                }
                itemList=String(itemList);
                for (let i=0;i<cart.content.length;i++) {
                    itemList=itemList.replace(",","|");
                } 
                cartList=String(cartList);
                for (let i=0;i<count;i++) {
                    cartList=cartList.replace(",","|");
                }
                sendChat("Item Store","/w "+msg.who+" <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Shopping Cart</div>' + //--
                    '<div ' + substyle + '>Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table' + tablestyle + '>' + //--
                    '<tr><td>Current Cart: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!cart --?{Cart?|' + cartList + '}">' + cart.name + '</a></td></tr>' + //--
                    '</table>' + //--
                    '<br><div style="text-align:center;">Content</div>' + //--
                    '<table ' + tablestyle + '>' + //--
                    '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th><th style="border-right: 1px solid #cccccc; text-align:center;">Shop</th></tr></thead>' + //--
                    invList + //--
                    '</table>' + //--
                    '<br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --new">Create new Cart</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!cart --' + cart.name + ' --rem ?{Item?|' + itemList + '}">Remove Item</a></div>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!checkout --cart ' + cart.name + '">Checkout</a></div>' + //--
                    '</div>'
                );
            }
        }
    },

    createCart = function(msg) {
        //Creates a new Shopping Cart
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        let carttotal=state.cart.length;
        let player=findObjs({
            _type: "player",
            id: msg.playerid
        }, {caseInsensitive: true})[0];
        let name=player.get("_displayname");
        let cartNum;
        if (carttotal==undefined || carttotal==0) {
            cartNum=0;
            let cart=[
                {
                    name: name+" Cart #"+cartNum,
                    id: player.id,
                    content: []
                }
            ];
            state.cart[carttotal]=cart[0];
            let invList='<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>';
            let hand=createObj('handout',{
                name: cart[0].name,
                inplayerjournals: msg.playerid
            });
            hand.set("notes",'<table><tr><th>Pos.</th><th>Amount</th><th>Item Name</th><th>Description</th><th>Price (GP)</th><th>Shop</th></tr></thead>'+invList+"</table>");
            sendChat("Item Store","/w "+name+" Created \""+cart[0].name+"\"!");
            cartMenu(cart[0].name,msg);
        }
    },
    
    purchase = function(type,cart,amount,store) {
        //Purchase either individual Item or a bunch of Items from a cart.
    },

    haggleMenu = function(store,amount,skill,msg) {
        //Open the Haggling Menu to negotiate price
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
    },

    haggle = function(store,amount,skill) {
        //Negotiate Price based on Skillchecks
    },
    
    checkInstall = function() {
        if (!state.store) {
            setDefaults();
        }
        if (!state) {
            setBasics();
        }
        if (!state.cart) {
            setCartDefault();
        }
    },
    
    checkStores = function() {
        //Checks if each Store has a Handout
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        let storeList=state.store;
        for (let i=0;i<storeList.length;i++) {
            let existing=findObjs({
                _type: 'handout',
                name: 'Handout of Store \"'+storeList[i].name+'\" (#'+i+')'
            }, {caseInsensitive: true})[0];
            if (!existing) {
                let handout=createObj('handout',{
                    name: 'Handout of Store \"'+storeList[i].name+'\" (#'+i+')'
                });
                let inv=storeList[i].inv;
                let invList="";
                for (let j=0;j<inv.length;j++) {
                    let price=inv[j].price;
                    let desc=inv[j].desc.split(";");
                    invList += '<tr><td>' + j + '</td><td>' + inv[j].amount + '</td><td>' + inv[j].name + '</td><td>' + desc[0] + '</td><td>' + price + '</td></tr>';
                }
                handout.set("notes","Name: "+storeList[i].name+"<br><br>Active: "+storeList[i].active+"<br><br>Haggle DC: "+storeList[i].hdc+"<br><br>Price Change %: "+storeList[i].cprice+'<br><br><br><table><tr><th>Pos.</th><th>Amount</th><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>'+invList+"</table>");
            } else {
                let inv=storeList[i].inv;
                let invList="";
                for (let j=0;j<inv.length;j++) {
                    let price=inv[j].price;
                    let desc=inv[j].desc.split(";");
                    invList += '<tr><td>' + j + '</td><td>' + inv[j].amount + '</td><td>' + inv[j].name + '</td><td>' + desc[0] + '</td><td>' + price + '</td></tr>';
                }
                existing.set("notes","Name: "+storeList[i].name+"<br><br>Active: "+storeList[i].active+"<br><br>Haggle DC: "+storeList[i].hdc+"<br><br>Price Change %: "+storeList[i].cprice+'<br><br><br><table><tr><th>Pos.</th><th>Amount</th><th>Item Name</th><th>Description</th><th>Price (GP)</th></tr>'+invList+"</table>");
            }
        }
    },
    
    checkCarts = function() {
        //Checks if each Cart has a Handout
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        let cartList=state.cart;
        for (let i=0;i<cartList.length;i++) {
            let existing=findObjs({
                _type: 'handout',
                name: cartList[i].name
            }, {caseInsensitive: true})[0];
            if (!existing) {
                let handout=createObj("handout",{
                    name: cartList[i].name
                });
                let inv=cartList[i].content;
                let invList="";
                if (inv.length==undefined || inv.length==0) {
                    invList="<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
                } else {
                    for (let j=0;j<inv.length;i++) {
                        let price=inv[j].price;
                        let desc=inv[j].desc.split(';');
                        invList += '<tr><td>' + j + '</td><td>' + inv[j].amount + '</td><td>' + inv[j].name + '</td><td>' + desc[0] + '</td><td>' + price + '</td><td>' + inv[j].shop + '</td></tr>';
                    }
                }
                hand.set("notes",'<table><tr><th>Pos.</th><th>Amount</th><th>Item Name</th><th>Description</th><th>Price (GP)</th><th>Shop</th></tr></thead>'+invList+"</table>");
            } else {
                let hand=findObjs({
                    _type: 'handout',
                    name: cartList[i].name
                }, {caseInsensitive: true})[0];
                let inv=cartList[i].content;
                let invList="";
                if (inv.length==undefined || inv.length==0) {
                    invList="<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
                } else {
                    for (let j=0;j<inv.length;i++) {
                        let price=inv[j].price;
                        let desc=inv[j].desc.split(';');
                        invList += '<tr><td>' + j + '</td><td>' + inv[j].amount + '</td><td>' + inv[j].name + '</td><td>' + desc[0] + '</td><td>' + price + '</td><td>' + inv[j].shop + '</td></tr>';
                    }
                }
                hand.set("notes",'<table><tr><th>Pos.</th><th>Amount</th><th>Item Name</th><th>Description</th><th>Price (GP)</th><th>Shop</th></tr></thead>'+invList+"</table>");
            }
        }
    },
    
    registerEventHandlers = function() {
        on('chat:message', handleInput);
	};

	return {
	    CheckInstall: checkInstall,
	    CheckStores: checkStores,
	    CheckCarts: checkCarts,
		RegisterEventHandlers: registerEventHandlers
	};
	
}());
on("ready",function(){
	'use strict';
	ItemStore.CheckInstall();
	ItemStore.CheckStores();
	ItemStore.CheckCarts();
	ItemStore.RegisterEventHandlers();
});