/*
Item Store Generator for D&D 5e (Roll20)
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated by Julexar (https://app.roll20.net/users/9989180/julexar)

GM Commands:
!store
Pulls up the Store Menu
    --reset
    Resets all stores
    --create --{Insert Name}
    Creates a new Store and selects it
    --{Insert Name}
    Selects a Store and displays it
        --inv
        Displays the Store's Inventory
            --add --{Insert Item Name} --{Insert Item Type} --amount --{Insert Number}
            Adds the inserted Amount of the Item to the Inventory
            --item --{Insert Item Pos}
            Selects and displays a specific Item in the Store
                --rem
                Removes the Item from the Inventory
                --edit
                Pulls up the Item Editor
                    --name --{Insert Name}
                    Sets the Name of the Item
                    --desc --{Insert Description}
                    Sets the Description of the Item
                    --mods
                    Edits the Modifiers of an Item
                        --set --{Insert Modifiers}
                        Sets the Modifiers of the Item (this overwrites any existing modifiers)
                        --add --{Insert Modifier}
                        Adds a Modifier to the Item
                        --rem --{Insert Modifier}
                        Removes a Modifier from the Item
                    --props
                    Edits the Properties of the Item
                        --set --{Insert Properties}
                        Sets the Properties of the Item (this overwrites any existing properties)
                        --add --{Insert Property}
                        Adds a Property to the Item
                        --rem --{Insert Property}
                        Removes a Property from the Item
                    --price --{Insert Number}
                    Sets the Price (GP) of the Item (must be 0 or above)
                    --amount --{Insert Number}
                    Sets the Amount of Items present in the Inventory
                    --bundle --{Insert Number}
                    Sets the Amount of Items you receive upon buying (Default: 1; Must be at least 1; No Fractions)
            --gen --amount --{Insert Number} --type --{Insert Type} --minrare --{Insert min Rarity} --maxrare --{Insert max Rarity}
            Generates a random Inventory based on Type and Rarity (check the Wiki for a list of valid Types and Rarities)
                Optional:
                --overwrite --true/false
                This will overwrite the existing Inventory with the generated Inventory (Default: true)
        --show
        Shows the Store to the Players
        --setname --{Insert Name}
        Sets the Name of the Store
        --sethdc --{Insert Number}
        Sets the Haggle DC for the Store (Default: 10)
        --inflate --{Insert Number from 0.1 to Infinity}
        Sets the percentage with which the prices of the Items in the Store will be increased
        --deflate --{Insert Number from 0.1 to Infinity}
        Sets the percentage with which the prices of the Items in the Store will be decreased
        --toggle
        Toggles the Store to be un-/available to Players (Default: available)
        --del
        Deletes the Store

!items
Pulls up the Item Menu
    --new 
    Pulls up the Item Creator
        --name --{Insert Name}
        Sets the Name of the Item
        --desc --{Insert Description}
        Sets the Description of the Item
        --type --{Insert Type}
        Sets the Type of the Item
        --rarity --{Insert Rarity}
        Sets the Rarity of the Item
        --mods
        Lets you set the Modifiers of the Item
            --set --{Insert Modifiers}
            Sets the Modifiers of the Item (overwrites existing modifiers)
            --add --{Insert Modifier}
            Adds a Modifier to the Item
            --rem --{Insert Modifier}
            Removes a Modifier from the Item
        --props
        Lets you set the Properties of the Item
            --set --{Insert Properties}
            Sets the Properties of the Item (overwrites existing properties)
            --add --{Insert Property}
            Adds a Property to the Item
            --rem --{Insert Property}
            Removes a Property from the Item
        --price --{Insert Number}
        Sets the Price (GP) of the Item (Must be 0 or above)
        --amount --{Insert Number}
        Sets the Amount of Items you receive upon buying (Default: 1; Must be at least 1; No Fractions)
            --confirm
            Must be supplied at the end to confirm the creation
            --cancel
            Cancels the creation and resets the temp values
    --{Insert Name}
    Selects and displays an Item
        --del/delete
        Deletes the Item from the List and all Inventories
        --setname --{Insert Name}
        Sets the Name of the Item
        --setdesc --{Insert Description}
        Sets the Description of the Item
        --settype --{Insert Type}
        Sets the Type of the Item
        --setrare --{Insert Rarity}
        Sets the Rarity of the Item
        --mods
        Lets you edit the Modifiers of the Item
            --set --{Insert Modifiers}
            Sets the Modifiers of the Item (overwrites existing modifiers)
            --add --{Insert Modifier}
            Adds a Modifier to the Item
            --rem --{Insert Modifier}
            Removes a Modifier from the Item
        --props
        Lets you edit the Properties of the Item
            --set --{Insert Properties}
            Sets the Properties of the Item
            --add --{Insert Property}
            Adds a Property to the Item
            --rem --{Insert Property}
            Removes a Property from the Item
        --setprice --{Insert Number}
        Sets the Price (GP) of the Item (Must be 0 or above)
        --setamount --{Insert Number}
        Sets the Amount of Items you receive upon buying (Default: 1; Must be at least 1; No Fractions)

GM & Players:
!shop
Displays a Menu with all active Stores
    --sel
    Selects the Character based on the selected Token
    --char --{Insert Name}
    Selects a Character based on Name (will select first character found if multiple exist)
    --charid --{Insert Character ID}
    Selects a Character based on ID
        --store --{Insert Store Name}
        Selects the provided Shop
            --{Insert Item Name}
            Selects an Item and displays its Information
                --haggle --price --{Insert Amount} --skill --Persuasion/Intimidation
                Attempt to haggle the Item down to the inserted Price using the selected Skill
                Upon success, the price will be lowered in the Store
                --addtocart --{Insert Cart #}
                Adds the Item to the selected Cart
                --buy
                Purchases the Item and adds it to your Inventory

!cart
Displays the Shopping Cart Menu
    --reset
    Resets all Carts (GM Only)
    --sel
    Displays all Carts of the Character based on the selected Token
    --char --{Insert Name}
    Displays all Carts of the Character based on Name (will use first character found if multiple exist)
    --charid --{Insert Character ID}
    Displays all Carts of the Character based on ID
        --new
        Creates a new Cart for the selected Character
        --{Insert Cart #}
        Displays the Contents of the Cart
            --item --{Insert Item Name/#}
            Displays Information about a specific Item
                --haggle --price --{Insert Amount} --skill --Persuasion/Intimidation
                Attempt to haggle the Item down to the inserted Price using the selected Skill
                Upon success, the price will only be lowered inside the Cart, not in the Store
                --checkout
                Purchases all Items in the Cart and adds them to your Inventory
*/

const styles = {
    divMenu: 'style="width: 300px; border: 1px solid black; background-color: #ffffff; padding: 5px;"',
    divCenter: 'style="text-align: center;"',
    buttonSmall:
        'style="text-align: center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 75px;',
    buttonMedium:
        'style="text-align: center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;',
    buttonLarge:
        'style="text-align: center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;',
    table: 'style="text-align: center; font-size: 12px; width: 100%; border-style: 3px solid #cccccc;"',
    arrow: 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"',
    header: 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"',
    sub: 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"',
    tdReg: 'style="text-align: right;"',
    tdTab: 'style="text-align: center; border-right: 1px solid #cccccc;"',
    trTab: 'style="text-align: left; border-bottom: 1px solid #cccccc;"',
    trInv: 'style="border-bottom: 1px solid #cccccc; border-left: 1px solid #cccccc; border-right: 1px solid #cccccc;"',
    span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"',
    invTr: 'style="border: 1px solid #cccccc;"',
    invTh: 'style="text-align: center; border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;"',
};

const typeList = ['Weapon', 'Armor', 'Scroll', 'Potion', 'Misc', 'Mundane Item', 'Random'];

const rareList = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Random'];

const itemList = {
    weapons: [
        {
            name: 'Club',
            desc: 'Club;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 5 ft',
            props: 'Light',
            price: 0.1,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Dagger',
            desc: 'Dagger;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60',
            props: 'Finesse, Light, Thrown',
            price: 2,
            weight: 1,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Greatclub',
            desc: 'Greatclub;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft',
            props: 'Two-Handed',
            price: 0.2,
            weight: 10,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Handaxe',
            desc: 'Handaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 20/60',
            props: 'Light, Thrown',
            price: 5,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Javelin',
            desc: 'Javelin;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120',
            props: 'Thrown',
            price: 0.5,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Light Hammer',
            desc: 'Light Hammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 20/60',
            props: 'Light, Thrown',
            price: 2,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Mace',
            desc: 'Mace;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Range: 5 ft',
            props: '',
            price: 5,
            weight: 4,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Quarterstaff',
            desc: 'Quarterstaff;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Alternate Damage: 1d8, Alternate Damage Type: bludgeoning, Range: 5 ft',
            props: 'Versatile',
            price: 0.2,
            weight: 4,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Sickle',
            desc: 'Sickle;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 5 ft',
            props: 'Light',
            price: 1,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Spear',
            desc: 'Spear;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60',
            props: 'Thrown, Versatile',
            price: 1,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Light Crossbow',
            desc: 'Light Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 80/320',
            props: 'Ammunition, Loading, Two-Handed',
            price: 25,
            weight: 5,
            amount: 1,
            rarity: 'common',
        },
        {
            name: 'Dart',
            desc: 'Dart;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60',
            props: 'Finesse, Thrown',
            price: 0.05,
            weight: 0.25,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Shortbow',
            desc: 'Shortbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 80/320',
            props: 'Ammunition, Two-Handed',
            price: 25,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Sling',
            desc: 'Sling;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 30/120',
            props: 'Ammunition',
            price: 0.1,
            weight: 0,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Battleaxe',
            desc: 'Battleaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft',
            props: 'Versatile',
            price: 10,
            weight: 4,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Flail',
            desc: 'Flail;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft',
            props: '',
            price: 10,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Glaive',
            desc: 'Glaive;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft',
            props: 'Heavy, Reach, Two-Handed',
            price: 20,
            weight: 6,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Greataxe',
            desc: 'Greataxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Wepaon, Damage: 1d12, Damage Type: slashing, Range: 5 ft',
            props: 'Heavy, Two-Handed',
            price: 30,
            weight: 7,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Greatsword',
            desc: 'Greatsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 2d6, Damage Type: slashing, Range: 5 ft',
            props: 'Heavy, Two-Handed',
            price: 50,
            weight: 6,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Halberd',
            desc: 'Halberd;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft',
            props: 'Heavy, Reach, Two-Handed',
            price: 20,
            weight: 6,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Lance',
            desc: 'Lance;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d12, Damage Type: piercing, Range: 10 ft',
            props: 'Reach, Special',
            price: 10,
            weight: 6,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Longsword',
            desc: 'Longsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft',
            props: 'Versatile',
            price: 15,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Maul',
            desc: 'Maul;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 2d6, Damage Type: bludgeoning, Range: 5 ft',
            props: 'Heavy, Two-Handed',
            price: 10,
            weight: 10,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Morningstar',
            desc: 'Morningstar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft',
            props: '',
            price: 15,
            weight: 4,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Pike',
            desc: 'Pike;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d10, Damage Type: piercing, Range: 10 ft',
            props: 'Heavy, Reach, Two-Handed',
            price: 5,
            weight: 18,
            amount: 1,
            rarity: 'common',
        },
        {
            name: 'Rapier',
            desc: 'Rapier;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft',
            props: 'Finesse',
            price: 25,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Scimitar',
            desc: 'Scimitar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft',
            props: 'Finesse, Light',
            price: 25,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Shortsword',
            desc: 'Shortsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft',
            props: 'Finesse, Light',
            price: 10,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Trident',
            desc: 'Trident;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60',
            props: 'Thrown, Versatile',
            price: 5,
            weight: 4,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'War Pick',
            desc: 'War Pick;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft',
            props: '',
            price: 5,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Warhammer',
            desc: 'Warhammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Alternate Damage: 1d10, Alternate Damage Type: bludgeoning, Range: 5 ft',
            props: 'Versatile',
            price: 15,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Whip',
            desc: 'Whip;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 10 ft',
            props: 'Finesse, Reach',
            price: 2,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Blowgun',
            desc: 'Blowgun;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1, Damage Type: piercing, Range: 25/100',
            props: 'Ammunition, Loading',
            price: 10,
            weight: 1,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Hand Crossbow',
            desc: 'Hand Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120',
            props: 'Ammunition, Light, Loading',
            price: 75,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Heavy Crossbow',
            desc: 'Heavy Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d10, Damage Type: piercing, Range: 100/400',
            props: 'Ammunition, Heavy, Loading, Two-Handed',
            price: 50,
            weight: 18,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Longbow',
            desc: 'Longbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 150/600',
            props: 'Ammunition, Heavy, Two-Handed',
            price: 50,
            weight: 2,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Net',
            desc: 'Net;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.',
            mods: 'Item Type: Ranged Weapon, Range: 5/15',
            props: 'Thrown, Special',
            price: 1,
            weight: 3,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Arrows',
            desc: 'Arrows;Arrows are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.',
            mods: 'Item Type: Ammunition',
            props: '',
            price: 1,
            weight: 0.05,
            amount: 1,
            bundle: 20,
            rarity: 'common',
        },
        {
            name: 'Blowgun needles',
            desc: 'Blowgun needles;Blowgun needles are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.',
            mods: 'Item Type: Ammunition',
            props: '',
            price: 1,
            weight: 0.02,
            amount: 1,
            bundle: 50,
            rarity: 'common',
        },
        {
            name: 'Crossbow bolts',
            desc: 'Crossbow bolts;Crossbow bolts are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.',
            mods: 'Item Type: Ammunition',
            props: '',
            price: 1,
            weight: 0.075,
            amount: 1,
            bundle: 20,
            rarity: 'common',
        },
        {
            name: 'Sling bullets',
            desc: 'Sling bullets;Sling bullets are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.',
            mods: 'Item Type: Ammunition',
            props: '',
            price: 0.04,
            weight: 0.075,
            amount: 1,
            bundle: 20,
            rarity: 'common',
        },
    ],
    armor: [
        {
            name: 'Padded Armor',
            desc: 'Padded Armor;Padded armor consists of quilted layers of cloth and batting.',
            mods: 'Item Type: Light Armor, AC: 11, Stealth:Disadvantage',
            props: '',
            price: 5,
            weight: 8,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Leather Armor',
            desc: 'Leather Armor;The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.',
            mods: 'Item Type: Light Armor, AC: 11',
            props: '',
            price: 10,
            weight: 10,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Studded Leather',
            desc: 'Studded Leather Armor;Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.',
            mods: 'Item Type: Light Armor, AC: 12',
            props: '',
            price: 45,
            weight: 13,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Hide',
            desc: 'Hide;This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, and other folk who lack access to the tools and materials needed to create better armor.',
            mods: 'Item Type: Medium Armor, AC: 12',
            props: '',
            price: 10,
            weight: 12,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Chain Shirt',
            desc: "Chain Shirt;Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armor offers modest protection to the wearer's upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers.",
            mods: 'Item Type: Medium Armor, AC: 13',
            props: '',
            price: 50,
            weight: 20,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Scale Mail',
            desc: 'Scale Mail;This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish. The suit includes gauntlets.',
            mods: 'Item Type: Medium Armor, AC: 14, Stealth:Disadvantage',
            props: '',
            price: 50,
            weight: 45,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Breastplate',
            desc: "Breastplate;This armor consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armor provides good protection for the wearer's vital organs while leaving the wearer relatively unencumbered.",
            mods: 'Item Type: Medium Armor, AC: 14',
            props: '',
            price: 400,
            weight: 20,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Half Plate',
            desc: "Half Plate;Half plate consists of shaped metal plates that cover most of the wearer's body. It does not include leg protection beyond simple greaves that are attached with leather straps.",
            mods: 'Item Type: Medium Armor, AC: 15, Stealth:Disadvantage',
            props: '',
            price: 750,
            weight: 40,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Ring Mail',
            desc: "Ring Mail;This armor is leather armor with heavy rings sewn into it. The rings help reinforce the armor against blows from swords and axes. Ring mail is inferior to chain mail, and it's usually worn only by those who can't afford better armor.",
            mods: 'Item Type: Heavy Armor, AC: 14, Stealth:Disadvantage',
            props: '',
            price: 30,
            weight: 40,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Chain Mail',
            desc: 'Chain Mail;Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.',
            mods: 'Item Type: Heavy Armor, AC: 16, Stealth:Disadvantage',
            props: '',
            price: 75,
            weight: 55,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Splint Mail',
            desc: 'Splint Mail;This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.',
            mods: 'Item Type: Heavy Armor, AC: 17, Stealth:Disadvantage',
            props: '',
            price: 200,
            weight: 60,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Plate Armor',
            desc: 'Plate Armor;Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armor. Buckles and straps distribute the weight over the body.',
            mods: 'Item Type: Heavy Armor, AC: 18, Stealth:Disadvantage',
            props: '',
            price: 1500,
            weight: 65,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Shield',
            desc: 'Shield;A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2. You can benefit from only one shield at a time.',
            mods: 'Item Type: Shield, AC +2',
            props: '',
            price: 10,
            weight: 6,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
    ],
    scrolls: [
        {
            name: 'Cantrip Scroll',
            mods: 'Item Type: Scroll',
            desc: 'Scroll (common);',
            props: '',
            rarity: 'common',
            price: 10,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '1st-Level Scroll',
            mods: 'Item Type: Scroll',
            desc: 'Scroll (common);',
            props: '',
            rarity: 'common',
            price: 60,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '2nd-Level Scroll',
            desc: 'Scroll (uncommon);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'uncommon',
            price: 120,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '3rd-Level Scroll',
            desc: 'Scroll (uncommon);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'uncommon',
            price: 250,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '4th-Level Scroll',
            desc: 'Scroll (rare);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'rare',
            price: 520,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '5th-Level Scroll',
            desc: 'Scroll (rare);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'rare',
            price: 850,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '6th-Level Scroll',
            desc: 'Scroll (very rare);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'very rare',
            price: 1500,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '7th-Level Scroll',
            desc: 'Scroll (very rare);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'very rare',
            price: 2550,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '8th-Level Scroll',
            desc: 'Scroll (very rare);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'very rare',
            price: 5250,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
        {
            name: '9th-Level Scroll',
            desc: 'Scroll (legendary);',
            mods: 'Item Type: Scroll',
            props: '',
            rarity: 'legendary',
            price: 10250,
            weight: 0,
            amount: 1,
            bundle: 1,
        },
    ],
    spells: [
        {
            level: 0,
            list: [
                'Acid Splash',
                'Blade Ward',
                'Booming Blade',
                'Chill Touch',
                'Control Flames',
                'Create Bonfire',
                'Dancing Lights',
                'Druidcraft',
                'Eldritch Blast',
                'Fire Bolt',
                'Friends',
                'Frostbite',
                'Green-Flame Blade',
                'Guidance',
                'Gust',
                'Infestation',
                'Light',
                'Lightning Lure',
                'Mage Hand',
                'Magic Stone',
                'Mending',
                'Message',
                'Minor Illusion',
                'Mold Earth',
                'Poison Spray',
                'Prestidigitation',
                'Primal Savagery',
                'Produce Flame',
                'Ray of Frost',
                'Resistance',
                'Sacred Flame',
                'Shape Water',
                'Shillelagh',
                'Shocking Grasp',
                'Spare the Dying',
                'Sword Burst',
                'Thaumaturgy',
                'Thorn Whip',
                'Thunderclap',
                'Toll the Dead',
                'True Strike',
                'Vicious Mockery',
                'Word of Radiance',
            ],
        },
        {
            level: 1,
            list: [
                'Absorb Elements',
                'Alarm',
                'Animal Friendship',
                'Armor of Agathys',
                'Arms of Hadar',
                'Bane',
                'Beast Bond',
                'Bless',
                'Burning Hands',
                'Catapult',
                'Cause Fear',
                'Ceremony',
                'Chaos Bolt',
                'Charm Person',
                'Chromatic Orb',
                'Color Spray',
                'Command',
                'Compelled Duel',
                'Comprehend Languages',
                'Create or Destroy Water',
                'Cure Wounds',
                'Detect Evil and Good',
                'Detect Magic',
                'Detect Poison and Disease',
                'Disguise Self',
                'Dissonant Whispers',
                'Divine Favor',
                'Earth Tremor',
                'Ensnaring Strike',
                'Entangle',
                'Expeditious Retreat',
                'Faerie Fire',
                'False Life',
                'Feather Fall',
                'Find Familiar',
                'Fog Cloud',
                'Goodberry',
                'Grease',
                'Guiding Bolt',
                'Hail of Thorns',
                'Healing Word',
                'Hellish Rebuke',
                'Heroism',
                'Hex',
                "Hunter's Mark",
                'Ice Knife',
                'Identify',
                'Illusory Script',
                'Inflict Wounds',
                'Jump',
                'Longstrider',
                'Mage Armor',
                'Magic Missile',
                'Protection from Evil and Good',
                'Purify Food and Drink',
                'Ray of Sickness',
                'Sanctuary',
                'Searing Smite',
                'Shield',
                'Shield of Faith',
                'Silent Image',
                'Sleep',
                'Snare',
                'Speak with Animals',
                "Tasha's Hideous Laughter",
                "Tenser's Floating Disk",
                'Thunderous Smite',
                'Thunderwave',
                'Unseen Servant',
                'Witch Bolt',
                'Wrathful Smite',
                'Zephyr Strike',
            ],
        },
        {
            level: 2,
            list: [
                "Aganazzar's Scorcher",
                'Aid',
                'Alter Self',
                'Animal Messenger',
                'Arcane Lock',
                'Augury',
                'Barkskin',
                'Beast Sense',
                'Blindness/Deafness',
                'Blur',
                'Branding Smite',
                'Calm Emotions',
                'Cloud of Daggers',
                'Continual Flame',
                'Cordon of Arrows',
                'Crown of Madness',
                'Darkness',
                'Darkvision',
                'Detect Thoughts',
                "Dragon's Breath",
                'Dust Devil',
                'Earthbind',
                'Enhance Ability',
                'Enlarge/Reduce',
                'Enthrall',
                'Find Steed',
                'Find Traps',
                'Flame Blade',
                'Flaming Sphere',
                'Gentle Repose',
                'Gust of Wind',
                'Healing Spirit',
                'Heat Metal',
                'Hold Person',
                'Invisibility',
                'Knock',
                'Lesser Restoration',
                'Levitate',
                'Locate Animals or Plants',
                'Locate Object',
                'Magic Mouth',
                'Magic Weapon',
                "Maximilian's Earthen Grasp",
                "Melf's Acid Arrow",
                'Mind Spike',
                'Mirror Image',
                'Misty Step',
                'Moonbeam',
                "Nystul's Magic Aura",
                'Pass Without Trace',
                'Phantasmal Force',
                'Prayer of Healing',
                'Protection from Poison',
                'Pyrotechnics',
                'Ray of Enfeeblement',
                'Rope Trick',
                'Scorching Ray',
                'See invisibility',
                'Shadow Blade',
                'Shatter',
                'Silence',
                'Skywrite',
                "Snilloc's Snowball Swarm",
                'Spider Climb',
                'Spike Growth',
                'Spiritual Weapon',
                'Suggestion',
                'Warding Bond',
                'Warding Wind',
                'Web',
                'Zone of Truth',
            ],
        },
        {
            level: 3,
            list: [
                'Animate Dead',
                'Aura of Vitality',
                'Beacon of Hope',
                'Bestow Curse',
                'Blinding Smite',
                'Blink',
                'Call Lightning',
                'Catnap',
                'Clairvoyance',
                'Conjure Animals',
                'Conjure Barrage',
                'Counterspell',
                'Create Food and Water',
                "Crusader's Mantle",
                'Daylight',
                'Dispel Magic',
                'Elemental Weapon',
                'Erupting Earth',
                'Fear',
                'Feign Death',
                'Fireball',
                'Flame Arrows',
                'Fly',
                'Gaseous Form',
                'Glyph of Warding',
                'Haste',
                'Hunger of Hadar',
                'Hypnotic Pattern',
                "Leomund's Tiny Hut",
                'Lightning Arrow',
                'Lightning Bolt',
                'Magic Circle',
                'Major Image',
                'Mass Healing Word',
                'Meld into Stone',
                "Melf's Minute Meteors",
                'Nondetection',
                'Phantom Steed',
                'Plant Growth',
                'Protection from Energy',
                'Remove Curse',
                'Revivify',
                'Sending',
                'Sleet Storm',
                'Slow',
                'Speak with Dead',
                'Speak with Plants',
                'Spirit Guardians',
                'Stinking Cloud',
                'Tidal Wave',
                'Tongues',
                'Vampiric Touch',
                'Wall of Sand',
                'Wall of Water',
                'Water Breathing',
                'Water Walk',
                'Wind Wall',
                'Enemies abound',
                'Life Transference',
                'Summon Lesser Demons',
                'Thunder Step',
                'Tiny Servant',
            ],
        },
        {
            level: 4,
            list: [
                'Arcane Eye',
                'Aura of Life',
                'Aura of Purity',
                'Banishment',
                'Blight',
                'Compulsion',
                'Confusion',
                'Conjure Minor Elementals',
                'Conjure Woodland Beings',
                'Control Water',
                'Death Ward',
                'Dimension Door',
                'Divination',
                'Dominate Beast',
                'Elemental Bane',
                "Evard's Black Tentacles",
                'Fabricate',
                'Fire Shield',
                'Freedom of Movement',
                'Giant Insect',
                'Grasping Vine',
                'Greater Invisibility',
                'Guardian of Faith',
                'Hallucinatory Terrain',
                'Ice Storm',
                "Leomund's Secret Chest",
                'Locate Creature',
                "Mordenkainen's Faithful Hound",
                "Mordenkainen's Private Sanctum",
                "Otiluke's Resilient Sphere",
                'Phantasmal Killer',
                'Polymorph',
                'Staggering Smite',
                'Stone Shape',
                'Stoneskin',
                'Storm Sphere',
                'Vitriolic Sphere',
                'Wall of Fire',
                'Watery Sphere',
                'Charm Monster',
                'Find Greater Steed',
                'Guardian of Nature',
                'Shadow of Moil',
                'Sickening Radiance',
                'Summon Greater Demon',
            ],
        },
        {
            level: 5,
            list: [
                'Animate Objects',
                'Antilife Shell',
                'Awaken',
                'Banishing Smite',
                "Bigby's Hand",
                'Circle of Power',
                'Cloudkill',
                'Commune',
                'Commune with Nature',
                'Cone of Cold',
                'Conjure Elemental',
                'Conjure Volley',
                'Contact Other Plane',
                'Contagion',
                'Control Winds',
                'Creation',
                'Destructive Wave',
                'Dispel Evil and Good',
                'Dominate Person',
                'Dream',
                'Flame Strike',
                'Geas',
                'Greater Restoration',
                'Hallow',
                'Hold Monster',
                'Immolation',
                'Insect Plague',
                'Legend Lore',
                'Maelstrom',
                'Mass Cure Wounds',
                'Mislead',
                'Modify Memory',
                'Passwall',
                'Planar Binding',
                'Raise Dead',
                "Rary's Telepathic Bond",
                'Reincarnate',
                'Scrying',
                'Seeming',
                'Swift Quiver',
                'Telekinesis',
                'Teleportation Circle',
                'Transmute Rock',
                'Tree Stride',
                'Wall of Force',
                'Wall of Stone',
                'Danse Macabre',
                'Dawn',
                'Druid Grove',
                'Enervation',
                'Far Step',
                'Holy Weapon',
                'Infernal Calling',
                'Negative Energy Flood',
                'Skill Empowerment',
                'Steel Wind Strike',
                'Synaptic Static',
                'Wall of Light',
                'Wrath of Nature',
            ],
        },
        {
            level: 6,
            list: [
                'Arcane Gate',
                'Blade Barrier',
                'Bones of the Earth',
                'Chain Lightning',
                'Circle of Death',
                'Conjure Fey',
                'Contingency',
                'Create Undead',
                'Disintegrate',
                "Drawmij's Instant Summons",
                'Eyebite',
                'Find the Path',
                'Flesh to Stone',
                'Forbiddance',
                'Globe of Invulnerability',
                'Guards and Wards',
                'Harm',
                'Heal',
                "Heroes' Feast",
                'Investiture of Flame',
                'Investiture of Ice',
                'Investiture of Stone',
                'Investiture of Wind',
                'Magic Jar',
                'Mass Suggestion',
                'Move Earth',
                "Otiluke's Freezing Sphere",
                "Otto's Irresistible Dance",
                'Planar Ally',
                'Primordial Ward',
                'Programmed Illusion',
                'Sunbeam',
                'Transport via Plants',
                'True Seeing',
                'Wall of Ice',
                'Wall of Thorns',
                'Wind Walk',
                'Word of Recall',
                'Create Homunculus',
                'Mental Prison',
                'Primordial Ward',
                'Scatter',
                'Soul Cage',
                "Tenser's Transformation",
            ],
        },
        {
            level: 7,
            list: [
                'Conjure Celestial',
                'Delayed Blast Fireball',
                'Divine Word',
                'Etherealness',
                'Finger of Death',
                'Fire Storm',
                'Forcecage',
                'Mirage Arcane',
                "Mordenkainen's Magnificent Mansion",
                "Mordenkainen's Sword",
                'Plane Shift',
                'Prismatic Spray',
                'Project Image',
                'Regenerate',
                'Resurrection',
                'Reverse Gravity',
                'Sequester',
                'Simulacrum',
                'Symbol',
                'Teleport',
                'Whirlwind',
                'Crown of Stars',
                'Power Word Pain',
                'Temple of the Gods',
            ],
        },
        {
            level: 8,
            list: [
                "Abi-Dalzim's Horrid Wilting",
                'Animal Shapes',
                'Antimagic Field',
                'Antipathy/Sympathy',
                'Clone',
                'Control Weather',
                'Demiplane',
                'Dominate Monster',
                'Earthquake',
                'Feeblemind',
                'Glibness',
                'Holy Aura',
                'Incendiary Cloud',
                'Maze',
                'Mind Blank',
                'Power Word Stun',
                'Sunburst',
                'Telepathy',
                'Trap the Soul',
                'Tsunami',
                'Illusory Dragon',
                'Maddening Darkness',
                'Mighty Fortress',
            ],
        },
        {
            level: 9,
            list: [
                'Astral Projection',
                'Foresight',
                'Gate',
                'Imprisonment',
                'Mass Heal',
                'Meteor Swarm',
                'Power Word Heal',
                'Power Word Kill',
                'Prismatic Wall',
                'Shapechange',
                'Storm of Vengeance',
                'Time Stop',
                'True Polymorph',
                'True Resurrection',
                'Weird',
                'Wish',
                'Invulnerability',
                'Mass Polymorph',
                'Psychic Scream',
            ],
        },
    ],
    potions: [
        {
            name: 'Potion of Climbing',
            desc: 'Potion (common);When you drink this potion, for 1 hour, you gain a climbing speed equal to your walking speed for 1 hour. During this time, you have advantage on Strength (Athletics) checks you make to climb. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.',
            mods: 'Item Type: Potion, Athletics:Advantage',
            props: '',
            price: 180,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Potion of Healing',
            desc: 'Potion (common);You regain 2d4 + 2 hit points when you drink this Potion.',
            mods: 'Item Type: Potion, Damage: 2d4+2, Damage Type: healing',
            props: '',
            price: 50,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'common',
        },
        {
            name: 'Philter of Love',
            desc: 'Potion (uncommon);You become charmed for 1 hour by the first creature you see within the first ten minutes of drinking this, and if that creature is of a species and gender you are normally attracted to you consider them your true love.',
            mods: 'Item Type: Potion',
            props: '',
            price: 90,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Poison',
            desc: 'Potion (uncommon);A creature that ingests this takes 3d6 poison damage and must succeed on a DC 13 Constitution saving throw or be poisoned. If poisoned, they take 3d6 poison damage at the start of each of its turns until the effect is ended. The creature can repeat the saving throw at the end of each of its turns. On a successful save, the damage on each subsequent turn is decreased by 1d6 until it hits 0.',
            mods: 'Item Type: Potion, Damage: 3d6, Damage Type: poison',
            props: '',
            price: 100,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Elixir of Health',
            desc: 'Potion (rare);Drinking this potion cures any disease you have and removes blinded, deafened, paralyzed, and poisoned conditions.',
            mods: 'Item Type: Potion',
            props: '',
            price: 120,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Fire Breath',
            desc: 'Potion (uncommon);After drinking this potion for 1 hour or up to 3 times, you can use your bonus action to exhale fire at a target within 30 feet. The target takes 4d6 fire damage or half on a successful DC 13 Dexterity saving throw.',
            mods: 'Item Type: Potion, Damage: 4d6, Damage Type: fire',
            props: '',
            price: 150,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Greater Healing',
            desc: 'Potion (uncommon);You regain 4d4 + 4 HP after drinking this Potion.',
            mods: 'Item Type: Potion, Damage: 4d4+4, Damage Type: healing',
            props: '',
            price: 150,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Heroism',
            desc: 'Potion (rare);When you drink this potion for 1 hour you gain 10 temporary HP as well as the effects of the bless spell (no concentration required).',
            mods: 'Item Type: Potion',
            props: '',
            price: 180,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Water Breathing',
            desc: 'Potion (uncommon);When you drink this potion you can breathe underwater for 1 hour.',
            mods: 'Item Type: Potion',
            props: '',
            price: 180,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Animal Friendship',
            desc: 'Potion (uncommon);After drinking this potion you can cast the Animal Friendship spell (save DC 13) at will for 1 hour.',
            mods: 'Item Type: Potion',
            props: '',
            price: 200,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Diminution',
            desc: 'Potion (rare);When you drink this potion, a creature gains the “reduce” effect of the Enlarge/Reduce spell for 1d4 hours (no concentration required).',
            mods: 'Item Type: Potion',
            props: '',
            price: 270,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Growth',
            desc: 'Potion (uncommon);When you drink this potion you gain the “enlarge” effect of the Enlarge/Reduce spell for 1d4 hours (no concentration required).',
            mods: 'Item Type: Potion',
            props: '',
            price: 270,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Gaseous Form',
            desc: 'Potion (rare);When you drink this potion you gain the effect of the gaseous form spell for 1 hour (no concentration required).',
            mods: 'Item Type: Potion',
            props: '',
            price: 300,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Resistance',
            desc: 'Potion (uncommon);When you drink this, for 1 hour, you gain resistance to one type of damage that the DM chooses.',
            mods: 'Item Type: Potion',
            props: '',
            price: 300,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Speed',
            desc: 'Potion (very rare);When you drink this potion you gain the effect of the haste spell for 1 minute (no concentration required).',
            mods: 'Item Type: Potion',
            props: '',
            price: 400,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Mind Reading',
            desc: 'Potion (rare);When drunk, a creature gains the effect of the Detect Thoughts spell for 1 minute (save DC 13).',
            mods: 'Item Type: Potion',
            props: '',
            price: 450,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Superior Healing',
            desc: 'Potion (rare);When you drink this potion you regain 8d4 + 8 HP.',
            mods: 'Item Type: Potion, Damage: 8d4+8, Damage Type: healing',
            props: '',
            price: 450,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Oil of Slipperiness',
            desc: 'Potion (uncommon);After taking 10 minutes to cover a medium or smaller creature this oil grants the covered creature the effects of the Freedom of Movement spell for 8 hours. The oil can also be poured on the ground covering a 10-foot square in order to replicate the spell Grease.',
            mods: 'Item Type: Potion',
            props: '',
            price: 480,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Flying',
            desc: 'Potion (very rare);For 1 hour after you drink this potion, you gain a flying speed equal to your walking speed and can hover.',
            mods: 'Item Type: Potion',
            props: '',
            price: 500,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Hill Giant Strength',
            desc: 'Potion (uncommon);When you drink this potion your Strength score is increased to 21 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 21',
            props: '',
            price: 500,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'uncommon',
        },
        {
            name: 'Potion of Invisibility',
            desc: "Potion (very rare);When you drink this potion you become invisible for 1 hour, along with anything you're carrying or wearing. The effect ends early if you make an attack or cast a spell.",
            mods: 'Item Type: Potion',
            props: '',
            price: 600,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Mind Control (Beasts)',
            desc: "Potion (rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don't, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
            mods: 'Item Type: Potion',
            props: '',
            price: 700,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Clairvoyance',
            desc: 'Potion (rare);When you drink this potion you gain the effect of the clairvoyance spell for 10 minutes.',
            mods: 'Item Type: Potion',
            props: '',
            price: 960,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Vitality',
            desc: 'Potion (very rare);When you drink this potion your exhaustion is removed and any diseases or poison effects are cured. For the next 24 hours, you regain the maximum number of HP for any Hit Die spent.',
            mods: 'Item Type: Potion',
            props: '',
            price: 960,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Supreme Healing',
            desc: 'Potion (very rare);When you drink this potion you regain 10d4 + 20 HP.',
            mods: 'Item Type: Potion, Damage: 10d4+20, Damage Type: healing',
            props: '',
            price: 1350,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Maximum Power',
            desc: 'Potion (rare);The first time you cast a damage-dealing spell of 4th level or lower within 1 minute of drinking the potion, instead of rolling dice to determine the damage dealt, you can instead use the highest number possible for each die.',
            mods: 'Item Type: Potion, Attack:Advantage',
            props: '',
            price: 1400,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Mind Control (Humanoids)',
            desc: "Potion (rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don't, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
            mods: 'Item Type: Potion',
            props: '',
            price: 1550,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Mind Control (Any)',
            desc: "Potion (very rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don't, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
            mods: 'Item Type: Potion',
            props: '',
            price: 1800,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Oil of Etherealness',
            desc: 'Potion (rare);After taking 10 minutes to cover a medium or smaller creature, that creature gains the effect of the etherealness spell for 1 hour.',
            mods: 'Item Type: Potion',
            props: '',
            price: 1920,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Stone Giant Strength',
            desc: 'Potion (rare);When you drink this potion your Strength score is increased to 23 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 23',
            props: '',
            price: 2000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Frost Giant Strength',
            desc: 'Potion (rare);When you drink this potion your Strength score is increased to 23 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 23',
            props: '',
            price: 2000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Fire Giant Strength',
            desc: 'Potion (rare);When you drink this potion your Strength score is increased to 25 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 25',
            props: '',
            price: 3000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Oil of Sharpness',
            desc: 'Potion (very rare);You can coat one slashing or piercing weapon or up to 5 pieces of ammunition with this oil, which takes 1 minute to apply. For 1 hour, the coated item has a +3 bonus to attack and damage rolls.',
            mods: 'Item Type: Potion, Attack +3',
            props: '',
            price: 3200,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Invulnerability',
            desc: 'Potion (rare);When drunk, a creature gains resistance to all damage.',
            mods: 'Item Type: Potion',
            props: '',
            price: 3840,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'rare',
        },
        {
            name: 'Potion of Cloud Giant Strength',
            desc: 'Potion (very rare);When you drink this potion your Strength score is increased to 27 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 27',
            props: '',
            price: 5000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Storm Giant Strength',
            desc: 'Potion (very rare);When you drink this potion your Strength score is increased to 29 for 1 hour.',
            mods: 'Item Type: Potion, Strength: 29',
            props: '',
            price: 6000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'very rare',
        },
        {
            name: 'Potion of Longevity',
            desc: 'Potion (legendary);When you drink this potion your physical age is reduced by 1d6 + 6 years, to a minimum of 13 years. Each subsequent time a creature drinks this potion, there is a 10% cumulative chance that it will instead age 1d6 +6 years.',
            mods: 'Item Type: Potion, Damage: 1d6+6, Damage Type: years',
            props: '',
            price: 9000,
            weight: 0.5,
            amount: 1,
            bundle: 1,
            rarity: 'legendary',
        },
    ],
    misc: [],
    mundane: [],
};

class ItemStore {
    constructor() {
        this.style = styles;
        this.temp = state.temp;
        this.stores = state.stores;
        this.carts = state.carts;
        this.list = itemList;
    }

    handleInput(msg) {
        const args = msg.content.split(/\s+--/);

        if (msg.type !== 'api') return;

        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case '!store':
                    switch (args[1]) {
                        default:
                            const store = itemstore.stores.find(s => s.name === args[1]);

                            switch (args[2]) {
                                case undefined:
                                    storeMenu(store);
                                    break;
                                case 'inv':
                                    switch (args[3]) {
                                        case undefined:
                                            storeInv(store);
                                            break;
                                        case 'add':
                                            if (!args[4] && !args[5])
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! You must provide the Name and the Type of the Item you wish to add to the Inventory!'
                                                );

                                            let addItem;

                                            switch (args[5].toLowerCase()) {
                                                case 'weapon':
                                                    addItem = itemstore.list.weapons.find(i => i.name === args[4]);
                                                    break;
                                                case 'armor':
                                                    addItem = itemstore.list.armor.find(i => i.name === args[4]);
                                                    break;
                                                case 'scroll':
                                                    addItem = itemstore.list.scrolls.find(i => i.name === args[4]);
                                                    break;
                                                case 'potion':
                                                    addItem = itemstore.list.potions.find(i => i.name === args[4]);
                                                    break;
                                                case 'misc':
                                                    addItem = itemstore.list.misc.find(i => i.name === args[4]);
                                                    break;
                                                case 'mundane':
                                                    addItem = itemstore.list.mundane.find(i => i.name === args[4]);
                                                    break;
                                            }

                                            if (!addItem)
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Item! An Item with that Name and Type does not exist. Please ensure you wrote the Name correctly and chose the right Type.'
                                                );

                                            addInvItem(store, addItem);
                                            storeInv(store);
                                            break;
                                        case 'item':
                                            if (isNaN(parseInt(args[4])))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! You must provide the Position of the Item to view its Details!'
                                                );

                                            const item = store.inventory[parseInt(args[4]) - 1];

                                            if (!item)
                                                return sendChat('Item Store', '/w gm Invalid Item! Could not find that Item in the Inventory!');

                                            switch (args[5]) {
                                                default:
                                                    showInvItem(store, item);
                                                    break;
                                                case 'rem':
                                                    remInvItem(store, item);
                                                    break;
                                                case 'edit':
                                                    if (itemstore.temp.mods.length === 0) itemstore.temp.mods = item.mods.split(', ');
                                                    if (itemstore.temp.props.length === 0) itemstore.temp.props = item.props.split(', ');

                                                    switch (args[6]) {
                                                        default:
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'name':
                                                            if (args[7] === '' || args[7] === ' ')
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Syntax! The new name of the Item may not be empty!'
                                                                );

                                                            itemstore.temp.name = args[7];
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'desc':
                                                            if (args[7] === '' || args[7] === ' ')
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Syntax! The new description of the Item may not be empty!'
                                                                );
                                                            if (!args[7].includes(';'))
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Format! The Description must contain a semicolon!'
                                                                );

                                                            itemstore.temp.desc = args[7];
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'price':
                                                            if (isNaN(parseInt(args[7])))
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Syntax! You must provide a number to set the price of the Item!'
                                                                );

                                                            itemstore.temp.price = parseInt(args[7]);
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'bundle':
                                                            if (isNaN(parseInt(args[7])))
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Syntax! You must provide a number to set the bundle size of the Item!'
                                                                );

                                                            itemstore.temp.bundle = parseInt(args[7]);
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'amount':
                                                            if (isNaN(parseInt(args[7])))
                                                                return sendChat(
                                                                    'Item Store',
                                                                    '/w gm Invalid Syntax! You must provide a number to set the amount of the Item!'
                                                                );

                                                            itemstore.temp.amount = parseInt(args[7]);
                                                            invItemEditor(store, item);
                                                            break;
                                                        case 'mods':
                                                            switch (args[8]) {
                                                                default:
                                                                    invItemModEditor(store, item);
                                                                    break;
                                                                case 'set':
                                                                    if (!args[9].includes('; '))
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! Modifiers need to be separated by a semicolon and a space!'
                                                                        );

                                                                    itemstore.temp.mods = args[9].split('; ');
                                                                    invItemModEditor(store, item);
                                                                    break;
                                                                case 'add':
                                                                    if (args[9] === '' || args[9] === ' ')
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! A Modifier you wish to add may not be empty!'
                                                                        );

                                                                    itemstore.temp.mods.push(args[9]);
                                                                    invItemModEditor(store, item);
                                                                    break;
                                                                case 'rem':
                                                                    if (args[9] === '' || args[9] === ' ')
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! A Modifier you wish to remove may not be empty!'
                                                                        );

                                                                    itemstore.temp.mods.splice(itemstore.temp.mods.indexOf(args[9]));
                                                                    invItemModEditor(store, item);
                                                                    break;
                                                            }
                                                            break;
                                                        case 'props':
                                                            switch (args[8]) {
                                                                default:
                                                                    invItemPropEditor(store, item);
                                                                    break;
                                                                case 'set':
                                                                    if (!args[9].includes('; '))
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! Properties need to be separated by a semicolon and a space!'
                                                                        );

                                                                    itemstore.temp.props = args[9].split('; ');
                                                                    invItemPropEditor(store, item);
                                                                    break;
                                                                case 'add':
                                                                    if (args[9] === '' || args[9] === ' ')
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! A Property you wish to add may not be empty!'
                                                                        );

                                                                    itemstore.temp.props.push(args[9]);
                                                                    invItemPropEditor(store, item);
                                                                    break;
                                                                case 'rem':
                                                                    if (args[9] === '' || args[9] === ' ')
                                                                        return sendChat(
                                                                            'Item Store',
                                                                            '/w gm Invalid Syntax! A Property you wish to remove may not be empty!'
                                                                        );

                                                                    itemstore.temp.props.splice(itemstore.temp.props.indexOf(args[9]));
                                                                    invItemPropEditor(store, item);
                                                                    break;
                                                            }
                                                            break;
                                                    }
                                                    break;
                                            }
                                            break;
                                        case 'gen':
                                            if (isNaN(parseInt(args[5])))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! You must provide a number for the amount of Items you wish to generate!'
                                                );

                                            if (
                                                (args[7].toLowerCase() === 'misc' && itemstore.list.misc.length === 0) ||
                                                (args[7].toLowerCase() === 'mundane' && itemstore.list.mundane.length === 0)
                                            )
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Error! Misc and/or Mundane Items cannot be generated as their Lists are empty. Please import a list of items before generating!'
                                                );
                                            else if (!typeList.find(t => t.toLowerCase() === args[7].toLowerCase()))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Type! That Type is not valid. Please provide a valid Type!'
                                                );
                                            else if (!rareList.find(r => r.toLowerCase() === args[9]))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid minimum Rarity! That minimum Rarity is not valid. Please provide a valid minimum Rarity!'
                                                );
                                            else if (!rareList.find(r => r.toLowerCase() === args[11]))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid maximum Rarity! That maximum Rarity is not valid. Please provide a valid maximum Rarity!'
                                                );

                                            if (args[7].toLowerCase() === 'random') {
                                                let rand = Math.floor(Math.random() * (typeList.length - 1));
                                                args[7] = typeList[rand];
                                            }

                                            const [minrare, maxrare] = checkRarities(args[9], args[11]);
                                            genStoreInv(parseInt(args[5]));
                                            storeInv(store);
                                            break;
                                    }
                                    break;
                                case 'show':
                                    displayStore(store);
                                    break;
                                case 'setname':
                                    if (args[3] === '' || args[3] === ' ')
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The new name of the Store may not be empty!');

                                    setStoreName(store, args[3]);
                                    break;
                                case 'sethdc':
                                    if (isNaN(parseInt(args[3])))
                                        return sendChat('Item Store', '/w gm Invalid Syntax! You must provide a number to change the Haggle DC.');

                                    setStoreHaggleDC();
                                    break;
                                case 'inflate':
                                    if (isNaN(parseFloat(args[3])))
                                        return sendChat('Item Store', '/w gm Invalid Syntax! You must provide a valid number to change the Markup.');

                                    setStorePrice(store, parseFloat(args[3]));
                                    break;
                                case 'deflate':
                                    if (isNaN(parseFloat(args[3])))
                                        return sendChat('Item Store', '/w gm Invalid Syntax! You must provide a valid number to change the Markup.');

                                    setStorePrice(store, -1 * parseFloat(args[3]));
                                    break;
                                case 'toggle':
                                    toggleStore(store);
                                    storeMenu(store);
                                    break;
                                case 'del':
                                    deleteStore(store);
                                    storeMenu();
                                    break;
                            }
                            break;
                        case 'create':
                            if (args[2] === '' || args[2] === ' ')
                                return sendChat('Item Store', '/w gm Invalid Syntax! The name of the Store may not be empty!');

                            createStore(args[2]);
                            storeMenu(args[2]);
                            break;
                        case 'reset':
                            setStoreDefaults();
                            break;
                    }
                    return;
                case '!item':
                    switch (args[1]) {
                        case undefined:
                            itemMenu();
                            break;
                        default:
                            const type = args[2];

                            if (!typeList.find(t => t.toLowerCase() === type.toLowerCase()))
                                return sendChat('Item Store', '/w gm Invalid Type. Please provide a valid Item Type.');

                            let item;
                            const filter = i => i.name === args[1];

                            switch (type.toLowerCase()) {
                                case 'weapon':
                                    item = itemstore.list.weapons.find(filter);
                                    break;
                                case 'armor':
                                    item = itemstore.list.armor.find(filter);
                                    break;
                                case 'scroll':
                                    item = itemstore.list.scrolls.find(filter);
                                    break;
                                case 'potion':
                                    item = itemstore.list.potions.find(filter);
                                    break;
                                case 'misc':
                                    item = itemstore.list.misc.find(filter);
                                    break;
                                case 'mundane':
                                    item = itemstore.list.mundane.find(filter);
                                    break;
                            }

                            if (!item) return sendChat('Item Store', '/w gm Invalid Item. Please provide a valid Item Name.');

                            switch (args[3]) {
                                default:
                                    itemMenu(item);
                                    break;
                                case 'del':
                                    deleteItem(item);
                                    itemMenu();
                                    break;
                                case 'setname':
                                    if (args[4] === '' || args[4] === ' ')
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The new name of the Item may not be empty!');

                                    editItem(item, 'name', args[4]);
                                    itemMenu(item);
                                    break;
                                case 'setdesc':
                                    if (args[4] === '' || args[4] === ' ')
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The new description of the Item may not be empty!');

                                    editItem(item, 'desc', args[4]);
                                    itemMenu(item);
                                    break;
                                case 'settype':
                                    if (!typeList.find(t => t.toLowerCase() === args[4].toLowerCase()))
                                        return sendChat('Item Store', '/w gm Invalid Type. Please provide a valid Item Type.');
                                    else if (args[4].toLowerCase() === 'random')
                                        return sendChat('Item Store', '/w gm Invalid Type. You cannot set an Item Type to Random.');

                                    editItem(item, 'type', args[4]);
                                    itemMenu(item);
                                    break;
                                case 'setrare':
                                    if (!rareList.find(r => r.toLowerCase() === args[4].toLowerCase()))
                                        return sendChat('Item Store', '/w gm Invalid Rarity. Please provide a valid Rarity.');
                                    else if (args[4].toLowerCase() === 'random')
                                        return sendChat('Item Store', '/w gm Invalid Rarity. You cannot set an Item Rarity to Random.');

                                    editItem(item, 'rarity', args[4]);
                                    itemMenu(item);
                                    break;
                                case 'setprice':
                                    if (isNaN(parseFloat(args[4])))
                                        return sendChat(
                                            'Item Store',
                                            '/w gm Invalid Syntax! You must provide a number to set the price of the Item!'
                                        );
                                    else if (parseFloat(args[4]) < 0)
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The price of an Item cannot be negative!');

                                    editItem(item, 'price', parseInt(args[4]));
                                    itemMenu(item);
                                    break;
                                case 'setweight':
                                    if (isNaN(parseFloat(args[4])))
                                        return sendChat(
                                            'Item Store',
                                            '/w gm Invalid Syntax! You must provide a number to set the weight of the Item!'
                                        );
                                    else if (parseFloat(args[4]) < 0)
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The weight of an Item cannot be negative!');

                                    editItem(item, 'weight', parseFloat(args[4]));
                                    itemMenu(item);
                                    break;
                                case 'setbundle':
                                    if (isNaN(parseInt(args[4])))
                                        return sendChat(
                                            'Item Store',
                                            '/w gm Invalid Syntax! You must provide a number to set the bundle size of the Item!'
                                        );
                                    else if (parseInt(args[4]) < 1)
                                        return sendChat('Item Store', '/w gm Invalid Syntax! The bundle size of an Item must be at least 1!');

                                    editItem(item, 'bundle', parseInt(args[4]));
                                    itemMenu(item);
                                    break;
                                case 'mods':
                                    switch (args[4]) {
                                        default:
                                            itemModMenu(item);
                                            break;
                                        case 'set':
                                            if (!args[5].includes('; '))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! Modifiers need to be separated by a semicolon and a space!'
                                                );

                                            editItem(item, 'mods', args[5]);
                                            itemModMenu(item);
                                            break;
                                        case 'add':
                                            if (args[5] === '' || args[5] === ' ')
                                                return sendChat('Item Store', '/w gm Invalid Syntax! A Modifier you wish to add may not be empty!');

                                            addItemMod(item, args[5]);
                                            itemModMenu(item);
                                            break;
                                        case 'rem':
                                            if (args[5] === '' || args[5] === ' ')
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! A Modifier you wish to remove may not be empty!'
                                                );

                                            remItemMod(item, args[5]);
                                            itemModMenu(item);
                                            break;
                                    }
                                    break;
                                case 'props':
                                    switch (args[4]) {
                                        default:
                                            itemPropMenu(item);
                                            break;
                                        case 'set':
                                            if (!args[5].includes('; '))
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! Properties need to be separated by a semicolon and a space!'
                                                );

                                            editItem(item, 'props', args[5]);
                                            itemPropMenu(item);
                                            break;
                                        case 'add':
                                            if (args[5] === '' || args[5] === ' ')
                                                return sendChat('Item Store', '/w gm Invalid Syntax! A Property you wish to add may not be empty!');

                                            addItemProp(item, args[5]);
                                            itemPropMenu(item);
                                            break;
                                        case 'rem':
                                            if (args[5] === '' || args[5] === ' ')
                                                return sendChat(
                                                    'Item Store',
                                                    '/w gm Invalid Syntax! A Property you wish to remove may not be empty!'
                                                );

                                            remItemProp(item, args[5]);
                                            itemPropMenu(item);
                                            break;
                                    }
                                    break;
                            }
                            break;
                    }
                    return;
            }
        }

        let char;
        switch (args[0]) {
            case '!shop':
                switch (args[1]) {
                    case undefined:
                        sendChat('Item Store', '/w gm Invalid Syntax! You must provide an argument!');
                        break;
                    case 'sel':
                        char = findObjs(
                            {
                                _type: 'character',
                                _id: getIdFromToken(msg.selected),
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                    case 'char':
                        char = findObjs(
                            {
                                _type: 'character',
                                name: args[2],
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                    case 'charid':
                        char = findObjs(
                            {
                                _type: 'character',
                                _id: args[2],
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                }

                if (!char) return sendChat('Item Store', `/w ${msg.who} Invalid Character! Could not find a Character with that Name or ID!`);

                if (args[1] === 'sel') {
                    switch (args[2]) {
                        default:
                            shopMenu(char);
                            break;
                        case 'store':
                            if (args[3] === '' || args[3] === ' ')
                                return sendChat(
                                    'Item Store',
                                    `/w ${msg.who} Invalid Syntax! You must provide the Name of the Store you wish to access!`
                                );

                            const store = itemstore.stores.find(s => s.active && s.name === args[3]);

                            if (!store) return sendChat('Item Store', `/w ${msg.who} Invalid Store! Could not find an active Store with that Name!`);

                            switch (args[4]) {
                                case undefined:
                                    shopMenu(char, store);
                                    break;
                                default:
                                    const item = store.inventory[parseInt(args[4]) - 1];

                                    if (!item)
                                        return sendChat(
                                            'Item Store',
                                            `/w ${msg.who} Invalid Item! Could not find that Item in the Store's Inventory!`
                                        );

                                    switch (args[5]) {
                                        default:
                                            showShopItem(char, store, item);
                                            break;
                                        case 'haggle':
                                            if (isNaN(parseInt(args[6])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a number for the price you wish to haggle for!`
                                                );
                                            if (!args[8] || !['Persuasion', 'Intimitation'].toString().toLowerCase().includes(args[8].toLowerCase()))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a valid Skill (Persuasion/Intimidation) to use for Haggle!`
                                                );

                                            haggleShopItem(char, store, item, parseInt(args[6]), args[8]);
                                            break;
                                        case 'addtocart':
                                            if (isNaN(parseInt(args[6])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Number of the Cart you wish to use!`
                                                );
                                            if (isNaN(parseInt(args[7])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Amount of the Item you wish to add to the Cart!`
                                                );

                                            addToCart(char, store, item, parseInt(args[6], parseInt(args[8])));
                                            break;
                                        case 'buy':
                                            if (isNaN(parseInt(args[6])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Number of the Cart you wish to use!`
                                                );

                                            buyFromShop(char, store, item, parseInt(args[6]));
                                            break;
                                    }
                                    break;
                            }
                    }
                } else {
                    switch (args[3]) {
                        default:
                            shopMenu(char);
                            break;
                        case 'store':
                            if (args[4] === '' || args[4] === ' ')
                                return sendChat(
                                    'Item Store',
                                    `/w ${msg.who} Invalid Syntax! You must provide the Name of the Store you wish to access!`
                                );

                            const store = itemstore.stores.find(s => s.active && s.name === args[4]);

                            if (!store) return sendChat('Item Store', `/w ${msg.who} Invalid Store! Could not find an active Store with that Name!`);

                            switch (args[5]) {
                                case undefined:
                                    shopMenu(char, store);
                                    break;
                                default:
                                    const item = store.inventory[parseInt(args[5]) - 1];

                                    if (!item)
                                        return sendChat(
                                            'Item Store',
                                            `/w ${msg.who} Invalid Item! Could not find that Item in the Store's Inventory!`
                                        );

                                    switch (args[6]) {
                                        default:
                                            showShopItem(char, store, item);
                                            break;
                                        case 'haggle':
                                            if (isNaN(parseInt(args[7])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a number for the price you wish to haggle for!`
                                                );
                                            if (!args[9] || !['Persuasion', 'Intimitation'].toString().toLowerCase().includes(args[9].toLowerCase()))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a valid Skill (Persuasion/Intimidation) to use for Haggle!`
                                                );

                                            haggleShopItem(char, store, item, parseInt(args[7]), args[9]);
                                            break;
                                        case 'addtocart':
                                            if (isNaN(parseInt(args[7])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Number of the Cart you wish to use!`
                                                );
                                            if (isNaN(parseInt(args[8])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Amount of the Item you wish to add to the Cart!`
                                                );

                                            addToCart(char, store, item, parseInt(args[7], parseInt(args[8])));
                                            break;
                                        case 'buy':
                                            if (isNaN(parseInt(args[7])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide the Number of the Cart you wish to use!`
                                                );

                                            buyFromShop(char, store, item, parseInt(args[7]));
                                            break;
                                    }
                                    break;
                            }
                            break;
                    }
                }
                return;
            case '!cart':
                switch (args[1]) {
                    case 'reset':
                        if (!playerIsGM(msg.playerid))
                            return sendChat('Item Store', `/w ${msg.who} Invalid Permissions! You must be a GM to reset the Carts!`);

                        setCartDefaults();
                        break;
                    case 'sel':
                        char = findObjs(
                            {
                                _type: 'character',
                                _id: getIdFromToken(msg.selected),
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                    case 'char':
                        char = findObjs(
                            {
                                _type: 'character',
                                name: args[2],
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                    case 'charid':
                        char = findObjs(
                            {
                                _type: 'character',
                                _id: args[2],
                            },
                            { caseInsensitive: true }
                        )[0];
                        break;
                }

                if (!char) return sendChat('Item Store', `/w ${msg.who} Invalid Character! Could not find a Character with that Name or ID!`);

                if (args[1] === 'sel') {
                    switch (args[2]) {
                        case undefined:
                            cartMenu(char);
                            break;
                        default:
                            if (isNaN(parseInt(args[2])))
                                return sendChat(
                                    'Item Store',
                                    `/w ${msg.who} Invalid Syntax! You must provide the Number of the Cart you wish to access!`
                                );

                            let cart = itemstore.carts.find(c => c.charid === char.id && c.num === parseInt(args[2]));

                            switch (args[3]) {
                                case undefined:
                                    cartMenu(char, cart);
                                    break;
                                case 'item':
                                    if (isNaN(parseInt(args[4])))
                                        return sendChat(
                                            'Item Store',
                                            `/w ${msg.who} Invalid Syntax! You must provide the Position of the Item to view its Details!`
                                        );

                                    const item = cart.content[parseInt(args[4]) - 1];

                                    if (!item) return sendChat('Item Store', `/w ${msg.who} Invalid Item! Could not find that Item in the Cart!`);

                                    switch (args[5]) {
                                        default:
                                            showCartItem(char, cart, item);
                                            break;
                                        case 'haggle':
                                            if (isNaN(parseInt(args[6])))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a number for the price you wish to haggle for!`
                                                );
                                            if (!args[8] || !['Persuasion', 'Intimitation'].toString().toLowerCase().includes(args[8].toLowerCase()))
                                                return sendChat(
                                                    'Item Store',
                                                    `/w ${msg.who} Invalid Syntax! You must provide a valid Skill (Persuasion/Intimidation) to use for Haggle!`
                                                );

                                            haggleCartItem(char, cart, item, parseInt(args[6]), args[8]);
                                            showCartItem(char, cart, item);
                                            break;
                                        case 'rem':
                                            remCartItem(char, cart, item);
                                            cartMenu(char, cart);
                                            break;
                                        case 'checkout':
                                            buyFromCart(char, cart);
                                            break;
                                    }
                                    break;
                                case 'del':
                                    deleteCart(char, cart);
                                    cartMenu(char);
                                    break;
                            }
                            break;
                        case 'new':
                            createCart(char);
                            break;
                    }
                }
                return;
        }
    }

    checkInstall() {
        if (!state.check) {
            state.check = true;
            setStoreDefaults();
            setTempDefaults();
            setCartDefaults();
        }

        if (!state.stores) setStoreDefaults();

        if (!state.carts) setCartDefaults();

        if (!state.temp) setTempDefaults();
    }

    registerEventHandlers() {
        on('chat:message', this.handleInput);
        log('Item Store - Registered Event Handlers!');
    }
}

const itemstore = new ItemStore();

function getIdFromToken(selected) {
    return (selected || [])
        .map(obj => getObj('graphic', obj._id))
        .filter(x => !!x)
        .map(token => token.get('represents'))
        .filter(id => getObj('character', id || ''));
}

/*
{
    name: '',
    hdc: 10,
    inventory: [],
    active: true,
    price_change: 0
}
*/

function setStoreDefaults() {
    state.stores = [];
}

/*
{
    num: Number,
    charid: Number,
    content: []
}
*/

function setCartDefaults() {
    state.carts = [];
}

function setTempDefaults() {
    state.temp = {
        name: '',
        desc: '',
        mods: [],
        props: [],
        price: 0,
        weight: 0,
        amount: 1,
        bundle: 1,
    };
}
