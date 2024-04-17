/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

GM Commands
!store - Pulls up the Menu and allows the GM to create and modify Stores
    --reset
    Resets all Stores (Caution: This will delete all Stores!)
    --new --{Insert Name}
    Creates a new Store.
    --{Insert existing Store name/number}
    Shows the GM all Information about a certain Store.
        --inv --view/edit/generate/reset
        Allows the GM to edit, generate or reset the Inventory of the selected Store or view a specific item.
            Edit & View Only
            --add --type --{Insert Type} --item --{Insert Item ID}
            Adds an Item to the Store
            --item --{Insert Item name/number}
            Select a specific Item that you wish to edit/view.
                Edit Only
                --del
                Deletes the selected Item
                --name --{Insert new Name}
                Sets the Name of the Item
                --desc --{Insert new Description}
                Sets the Description of the Item (Check the Wiki to see how a Description is structured)
                --mods --{Insert new Modifiers}
                Sets the Modifiers of the Item (separated by comma, check the Wiki to see how Modifiers work)
                --props --{Insert new Properties}
                Sets the Properties of the Item (separted by comma, e.g. Light, Heavy, Two-Handed, ...)
                --price --{Insert Number}
                Sets the Price (GP) of the Item (Must be >= 0)
                --weight --{Insert Number}
                Sets the Weight (lbs) of the Item (Must be >= 0)
                --stock --{Insert Number}
                Sets the stocked amount of the Item (Must be >= 1)
                --amount --{Insert Number}
                Set the Amount of Items you will receive upon buying (Must be >= 1, no fractions!) Default: 1
            Generate Only
            --type --{Insert Item Type} --amount --{Insert Number} --minrare --{Insert minimum Rarity} --maxrare --{Insert maximum Rarity}
            Generate a random Inventory based on Item Type and Rarity. (For a list of available Types and Rarities, check the Wiki)
                --overwrite true/false
                Select whether it should overwrite an already existing Inventory. (Put true if so, put false if not) Default: true
        --show
        Shows the Store to the Players.
        --name --{Insert Name}
        Changes the Name of the Store.
        --hdc --{Insert Number}
        Sets the Haggle DC for the Store. (Default: 10)
        --inflate --{Insert Number}
        Set a Percentage of Inflation to increase prices (from 0.1 to Infinity)
        --deflate --{Insert Number}
        Set a Percentage of Deflation to decrease prices (from 0.1 to Infinity)
        --activate
        Activates the Store and makes it visible for Players.
        --deactivate
        Deactivates the Store and makes it visible to only the GM.
        --reset
        Resets the Store (Applies base values)
        --delete
        Deletes the selected Store.

!item
Pulls up the Item Menu
    --reset
    Resets all Items (Caution: This will delete all created Items!)
    --new
    Creates a new Item (all Options below must be used, order doesn't matter)
        --type --{Insert Type}
        Sets the Type of the Item
        --name --{Insert Name}
        Sets the Name of the Item
        --desc --{Insert Desc}
        Sets the Description of the Item
        --mods --{Insert Modifiers}
        Sets the Modifiers of the Item (separated by comma)
        --props --{Insert Properties}
        Sets the Properties of the Item (separated by comma)
        --price --{Insert Number}
        Sets the Price (GP) of the Item (must be >= 0)
        --weight --{Insert Number}
        Sets the Weight (lbs) of the Item (must be >= 0)
        --amount --{Insert Number}
        Sets the Amount of Items you receive upon buying (must be >= 0, no fractions!)
        --rarity --{Common|Uncommon|Rare|Very Rare|Legendary}
        Sets the Rarity of the Item
    --item 
        --id --{Insert Item ID}
        Shows Info about the selected Item
            --settype --{Insert Type}
            Changes the Type of the Item
            --setname --{Insert Name}
            Changes the Name of the Item
            --setdesc --{Insert Description}
            Changes the Description of the Item
            --setmods --{Insert Modifiers}
            Changes the Modifiers of the Item (separated by comma)
            --setprops --{Insert Properties}
            Changes the Properties of the Item (separated by comma)
            --setprice --{Insert Number}
            Changes the Price (GP) of the Item (must be >= 0)
            --setweight --{Insert Number}
            Changes the Weight (lbs) of the Item (must be >= 0)
            --setamount --{Insert Number}
            Changes the Amount of Items you receive upon buying (must be >= 0, no fractions)
            --setrarity --{Common|Uncommon|Rare|Very Rare|Legendary}
            Changes the Rarity of the Item
            --reset
            Resets the Item (Applies base values)
            --del
            Deletes the Item

Players Commands
!shop
Pulls up a Menu where all active Stores and Options are displayed
    --store --{Insert existing Shop Name}
    Selects a certain Shop
        --char --{Insert Character Name/ID}
        Select a Character you want to use
            --buy --{Insert Item Name}
            Pulls up the Purchasing menu
                --amount --{Insert Number}
                Purchases the inserted amount of the Item (immediate checkout if --atc is not supplied)
                    --atc
                    Adds the Item to your Cart
            --cart
            Pulls up your Shopping cart
                --reset
                Removes all Items from your Cart
                --checkout
                Buys all Items in your Cart
                --item --{Insert Item # or Name}
                Selects an Item in your Cart
                    --haggle --{Insert Number} --{Intimidation/Persuasion}
                    Attempts to haggle the Price to the inserted Number, using either Intimidation or Persuasion
                    --amount --{Insert Number}
                    Changes the quantity of the Item in your Cart
                    --remove
                    Removes the Item from your Cart
*/

const styles = {
	divMenu: 'style="width: 300px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
	divButton: 'style="text-align:center;"',
	buttonSmall: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
	buttonMedium: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
	buttonLarge: 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
	table: 'style="text-align:center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
	arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
	header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
	sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
	tdReg: 'style="text-align: right;"',
	trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
	tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
	span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
};

const typeList = ['Weapon', 'Armor', 'Scroll', 'Potion', 'Misc', 'Mundane'];

const rarityList = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'];

class ItemStore {
    constructor() {
        this.style = styles;
        this.types = typeList;
        this.rarities = rarityList;
    }

    handleInput(msg) {
        const args = msg.content.split(/\s+--/);

        if (msg.type !== 'api') return;

        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case '!store':
                    switch (args[1]) {
                        default:
                            const store = isNaN(args[1]) ? state.stores.find(s => s.name.toLowerCase() === args[1].toLowerCase()) : state.store[args[1]-1];
                            let val;
                            switch (args[2]) {
                                default:
                                    storeMenu(store);
                                break;
                                case 'inv':
                                    switch (args[3]) {
                                        default:
                                            invMenu(store);
                                        break;
                                        case 'view':
                                            switch (args[4]) {
                                                default:
                                                    invMenu(store);
                                                break;
                                                case 'item':
                                                    const item = isNaN(args[4]) ? store.items.find(i => i.name.toLowerCase() === args[4].toLowerCase()) : store.items[args[4]-1];
                                                    invMenu(store, item);
                                                break;
                                            }
                                        break;
                                        case 'edit':
                                            let item;
                                            switch (args[4]) {
                                                default:
                                                    sendChat('Item-Store', 'Invalid Syntax! You need to select an Item to use edit!');
                                                break;
                                                case 'item':
                                                    item = isNaN(args[5]) ? store.items.find(i => i.name.toLowerCase() === args[5].toLowerCase()) : store.items[args[5]-1];
                                                    
                                                    if (args[6] === 'del') removeInvItem(store, item);
                                                    else if (args[6]) editInvHandler(store, item, args[6]);
                                                    else editInvMenu(store, item);
                                                break;
                                                case 'add':
                                                    const type = args[6].toLowerCase();
                                                    if (!type) return sendChat('Item Store', '/w gm Invalid Syntax, you must provide the Type of the Item!');

                                                    if (!args[8]) return sendChat('Item Store', '/w gm Invalid Syntax, you must provide the ID or the Name of an Item!');
                                                    item = isNaN(args[8]) ? state.items.find(i => i.type === type && i.name.toLowerCase() === args[8].toLowerCase()) : state.items[args[8]];

                                                    if (!item) return sendChat('Item Store', '/w gm Could not find that Item! Make sure you inserted the correct ID/Name!');

                                                    addInvItem(store, item);
                                                break;
                                            }
                                        case 'gen' || 'generate':
                                            const type = args[5].toLowerCase();
                                            const amount = args[7].toLowerCase();
                                            const minrare = args[9].toLowerCase();
                                            const maxrare = args[11].toLowerCase();
                                            const overwrite = args[13] ? Boolean(args[13]) : true;
                                            if (!type || !typeList.toString().toLowerCase().includes(type)) return sendChat('Item Store', '/w gm Invalid Type! Make sure to check the Wiki to see a list of all valid Types!');
                                            if (isNaN(amount) || Number(amount)<=0) return sendChat('Item Store', '/w gm Invalid Amount! You must provide a Number that is greater than or equal to 1!');
                                            if (!minrare ^ (!rarityList.toString().toLowerCase().includes(minrare) && minrare.toLowerCase() !== 'random')) return sendChat('Item Store', 'Invalid minimum Rarity! Make sure to check the Wiki to see a list of all valid Rarities!');
                                            if (!maxrare ^ (!rarityList.toString().toLowerCase().includes(maxrare) && maxrare.toLowerCase() !== 'random')) return sendChat('Item Store', 'Invalid maximum Rarity! Make sure to check the Wiki to see a list of all valid Rarities!');

                                            generateInv(store, amount, type, minrare, maxrare, overwrite);
                                        break;
                                        case 'reset':
                                            resetStoreInv(store);
                                        break;
                                    }
                                break;
                                case 'show':
                                    showStore(store);
                                break;
                                case 'name':
                                    val = args[3];
                                    editStore(store, args[2], val);
                                    storeMenu(val);
                                break;
                                case 'hdc':
                                    val = args[3];
                                    editStore(store, args[2], val);
                                    storeMenu(store);
                                break;
                                case 'inflate' || 'deflate':
                                    val = Number(args[3]);
                                    changeStorePrice(store, args[2], val);
                                    storeMenu(store);
                                break;
                                case 'activate':
                                    toggleStoreOn(store);
                                    storeMenu(store);
                                break;
                                case 'deactivate':
                                    toggleStoreOff(store);
                                    storeMenu(store);
                                break;
                                case 'delete':
                                    removeStore(store);
                                break;
                                case 'reset':
                                    resetStore(store);
                                    storeMenu(store);
                                break;
                            }
                        break;
                        case 'new':
                            createStore(store, args[3]);
                            storeMenu(args[3]);
                        break;
                        case 'reset':
                            setStoreDefaults();
                        break;
                    }
                break;
                case '!item':
                    switch (args[1]) {
                        default:
                            const item = state.items[args[2]];

                            if (!item) return sendChat('Item Store', 'Could not find that Item based on the ID. Please double check if you inserted the correct ID!');

                            if (!args[3]) itemMenu(item);
                            else if (args[3] === 'del') removeItem(item);
                            else if (args[3] === 'reset') resetItem(item);
                            else editItemHandler(item, args[3], args[4]);
                        break;
                        case 'new':
                            let type, name, desc, mods, props, price, weight, amount, rarity;
                            
                            if (args.length < 19) return sendChat('Item Store', '/w gm Invalid Sytax, all Options must be included to create a new Item!')
                            
                            for (let i=2; i<args.length; i+=2) {
                                switch (args[i]) {
                                    case 'type':
                                        type = args[i+1].toLowerCase();
                                        if (!typeList.toString().toLowerCase().includes(type)) return sendChat('Item Store', '/w gm Invalid Type! Please check the Wiki for a List of valid Types!');
                                    break;
                                    case 'name':
                                        name = args[i+1];
                                    break;
                                    case 'desc':
                                        desc = args[i+1];
                                    break;
                                    case 'mods':
                                        mods = args[i+1];
                                    break;
                                    case 'props':
                                        props = args[i+1];
                                    break;
                                    case 'price':
                                        price = parseFloat(args[i+1]);
                                        if (isNaN(price) || price < 0) return sendChat('Item Store', '/w gm Invalid Number! You must provide a Number greater than or equal to 0!');
                                    break;
                                    case 'weight':
                                        weight = parseFloat(args[i+1]);
                                        if (isNaN(weight) || weight < 0) return sendChat('Item Store', '/w gm Invalid Number! You must provide a Number greater than or equal to 0!');
                                    break;
                                    case 'amount':
                                        amount = parseInt(args[i+1]);
                                        if (isNaN(amount) || amount < 1) return sendChat('Item Store', '/w gm Invalid Number! You must provide a Number greater than or equal to 1!');
                                    break;
                                    case 'rarity':
                                        rarity = args[i+1].toLowerCase();
                                        if (!rarityList.toString().toLowerCase().includes(rarity)) return sendChat('Item Store', '/w gm Invalid Rarity! Please check the Wiki for a List of valid Rarities!');
                                    break;
                                }
                            }

                            createItem(type, name, desc, mods, props, price, weight, amount, rarity);
                        break;
                        case 'reset':
                            setItemDefaults();
                        break;
                    }
                break;
            }
        }

        const store = args[1] 
        ? (
            isNaN(args[2])
            ? state.stores.find(s => s.name.toLowerCase() === args[2].toLowerCase())
            : state.stores[args[2]]
          )
        : undefined;

        if (!store) shopMenu()
        else {
            if (!args[3]) shopMenu(store);
            else {
                const char = isNaN(args[4]) ? getCharByName(msg.playerid, args[4]) : getCharById(msg.playerid, parseInt(args[4]));

                switch (args[5]) {
                    case undefined:
                        shopMenu(store, char);
                    break;
                    case 'buy':
                        const item = isNaN(args[6]) ? store.items.find(i => i.name.toLowerCase() === args[6].toLowerCase()) : store.items[args[6]];

                        if (!item) return sendChat('Item Store', `/w ${msg.playerid} Invalid Item! Make sure you insert the correct Item ID/Name from the Store Inventory!`);

                        if (!args[7] || (isNaN(args[8]) || parseInt(args[8])) < 0) return sendChat('Item Store', `/w ${msg.playerid} Invalid Amount! Please insert a Number greater than or equal to 1!`);
                        const amount = parseInt(args[8]);

                        if (!args[9]) buyItem(char, store, item, amount);
                        else addToCart(char, store, item, amount);
                    break;
                    case 'cart':
                        const cart = state.carts.find(c => c.charid === char.id)
                        switch (args[6]) {
                            case undefined:
                                cartMenu(cart);
                            break;
                            case 'item':
                                const item = isNaN(args[7]) ? cart.items.find(i => i.name.toLowerCase() === args[7].toLowerCase()) : cart.items[args[7]];

                                let amount;
                                switch (args[8]) {
                                    case undefined:
                                        cartItemMenu(cart, item);
                                    break;
                                    case 'haggle':
                                        const store = state.stores[item.storeId-1];
                                        
                                        amount = parseInt(args[9]);
                                        if (!amount || isNaN(amount)) return sendChat('Item Store', `/w ${msg.playerid} Invalid Amount! Please insert a Number greater than or equal to 1!`);
                                        
                                        const skill = args[10].toLowerCase();
                                        if (!['intimidation', 'persuasion'].includes(skill)) return sendChat('Item Store', `/w ${msg.playerid} Invalid Skill! Please choose either Intimidation or Persuasion!`);
                                        
                                        haggleCartItem(cart, store, item, amount, skill);
                                    break;
                                    case 'amount':
                                        amount = parseInt(args[9]);
                                        if (!amount || isNaN(amount)) return sendChat('Item Store', `/w ${msg.playerid} Invalid Amount! Please insert a Number greater than or equal to 1!`);

                                        setCartItemAmount(cart, item, amount);
                                    break;
                                    case 'remove' || 'rem':
                                        removeCartItem(cart, item);
                                    break;
                                }
                            break;
                            case 'checkout':
                                buyItemsInCart(char, cart);
                            break;
                            case 'reset':
                                resetCart(cart);
                            break;
                        }
                    break;
                }
            }
        }
    }
}