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
                --del - Deletes the selected Item
                --mode add - Adds a selected Property to an already existing one
            --new - Adds a new Item
                    --name {Insert new Name} - Set the Name of an Item
                    --desc {Insert new Description} - Set the Description of an Item (Check the Wiki to see how a Description is structured)
                    --mods {Insert new Modifiers} - Set the Modifiers of an Item. (Check the Wiki to see how Modifiers work)
                    --props {Insert new Properties} - Set the Properties of an Item. (E.g. Light, Heavy, Two-Handed, etc.)
                    --price {Insert new Price} - Set the Price (GP) of an Item. (Must be 0 or above)
                    --amount {Insert new Amount} - Set the Amount of Items you will receive upon buying (Must be at least 1 and a whole number - no fractions!)
                        --confirm - Confirm and apply the Changes.
            Generate Only
            --type {Insert Item Type} --amount {Insert Number of Items} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity} - Generate a random Inventory based on Item Type and Rarity. (For a list of available Types and Rarities, check the Wiki)
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
    --store {Insert existing Shop name} - selects a certain Shop
        --char {Insert Character Name} - select a Character you want to use
        --charid {Insert Character ID} - "
            --buy {Insert Item name} - Pulls up the Purchasing menu
                --amount {Insert amount} - increases the amount of Items you buy (Default: 1)
            --haggle - Pulls up the Haggling menu
                --item {Insert Item Name} - Select the Item you wish to haggle for.
                    --char {Insert Character Name} - Select the Character you want to use
                    --charid {Insert Character ID} - "
                        --amount - sets the amount you want to haggle for
                            --skill {Insert Skill} - sets the skill used in haggling (Persuasion or Intimidation)
!cart - Pulls up the Shopping Cart Menu.
    --new - Creates a new Shopping Cart.
    --{Insert Cart Number/Name} - Shows you the content of the selected Cart.
        --rem {Insert Item name/num} - Removes an Item from your Cart.
!checkout - Lets you confirm your Purchase
    --cart {Insert Cart #} - Purchase the Items in your Cart.
    --store {Insert Store Number/Name}
        --char {Insert Character Name} - specify the Character you want to use
        --charid {Insert Character ID} - "
            Store Only
            --item {Insert Item Name/Number} 
                --amount ?{Insert Amount} - Purchase a specific item. (Default: 1)
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
            typeList: "Weapon|Armor|Scroll|Potion|Misc|Mundane Item|Random",
            rareList: "Common|Uncommon|Rare|Very Rare|Legendary|Random",
            temp: {
                name: "",
                desc: "",
                mods: "",
                props: "",
                price: 0,
                weight: 0,
                amount: 1,
                sellam: 1,
                oldname: ""
            },
            used: false
        };
    },

    setCartDefault = function() {
        state.cart = [];
    },

    setItemDefaults = function() {
        state.list = {
            weapon: [
                {
                    name: "Club",
                    desc: "Club;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 5 ft",
                    props: "Light",
                    price: 0.1,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Dagger",
                    desc: "Dagger;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60",
                    props: "Finesse, Light, Thrown",
                    price: 2,
                    weight: 1,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Greatclub",
                    desc: "Greatclub;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft",
                    props: "Two-Handed",
                    price: 0.2,
                    weight: 10,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Handaxe",
                    desc: "Handaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 20/60",
                    props: "Light, Thrown",
                    price: 5,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Javelin",
                    desc: "Javelin;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120",
                    props: "Thrown",
                    price: 0.5,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Light Hammer",
                    desc: "Light Hammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 20/60",
                    props: "Light, Thrown",
                    price: 2,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Mace",
                    desc: "Mace;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Range: 5 ft",
                    props: "",
                    price: 5,
                    weight: 4,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Quarterstaff",
                    desc: "Quarterstaff;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Alternate Damage: 1d8, Alternate Damage Type: bludgeoning, Range: 5 ft",
                    props: "Versatile",
                    price: 0.2,
                    weight: 4,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Sickle",
                    desc: "Sickle;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 5 ft",
                    props: "Light",
                    price: 1,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Spear",
                    desc: "Spear;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60",
                    props: "Thrown, Versatile",
                    price: 1,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Light Crossbow",
                    desc: "Light Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 80/320",
                    props: "Ammunition, Loading, Two-Handed",
                    price: 25,
                    weight: 5,
                    amount: 1
                },
                {
                    name: "Dart",
                    desc: "Dart;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60",
                    props: "Finesse, Thrown",
                    price: 0.05,
                    weight: 0.25,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Shortbow",
                    desc: "Shortbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 80/320",
                    props: "Ammunition, Two-Handed",
                    price: 25,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Sling",
                    desc: "Sling;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 30/120",
                    props: "Ammunition",
                    price: 0.1,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Battleaxe",
                    desc: "Battleaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft",
                    props: "Versatile",
                    price: 10,
                    weight: 4,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Flail",
                    desc: "Flail;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft",
                    props: "",
                    price: 10,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Glaive",
                    desc: "Glaive;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft",
                    props: "Heavy, Reach, Two-Handed",
                    price: 20,
                    weight: 6,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Greataxe",
                    desc: "Greataxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Wepaon, Damage: 1d12, Damage Type: slashing, Range: 5 ft",
                    props: "Heavy, Two-Handed",
                    price: 30,
                    weight: 7,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Greatsword",
                    desc: "Greatsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 2d6, Damage Type: slashing, Range: 5 ft",
                    props: "Heavy, Two-Handed",
                    price: 50,
                    weight: 6,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Halberd",
                    desc: "Halberd;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft",
                    props: "Heavy, Reach, Two-Handed",
                    price: 20,
                    weight: 6,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Lance",
                    desc: "Lance;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d12, Damage Type: piercing, Range: 10 ft",
                    props: "Reach, Special",
                    price: 10,
                    weight: 6,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Longsword",
                    desc: "Longsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft",
                    props: "Versatile",
                    price: 15,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Maul",
                    desc: "Maul;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 2d6, Damage Type: bludgeoning, Range: 5 ft",
                    props: "Heavy, Two-Handed",
                    price: 10,
                    weight: 10,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Morningstar",
                    desc: "Morningstar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
                    props: "",
                    price: 15,
                    weight: 4,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Pike",
                    desc: "Pike;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: piercing, Range: 10 ft",
                    props: "Heavy, Reach, Two-Handed",
                    price: 5,
                    weight: 18,
                    amount: 1
                },
                {
                    name: "Rapier",
                    desc: "Rapier;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
                    props: "Finesse",
                    price: 25,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Scimitar",
                    desc: "Scimitar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft",
                    props: "Finesse, Light",
                    price: 25,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Shortsword",
                    desc: "Shortsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft",
                    props: "Finesse, Light",
                    price: 10,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Trident",
                    desc: "Trident;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60",
                    props: "Thrown, Versatile",
                    price: 5,
                    weight: 4,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "War Pick",
                    desc: "War Pick;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
                    props: "",
                    price: 5,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Warhammer",
                    desc: "Warhammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Alternate Damage: 1d10, Alternate Damage Type: bludgeoning, Range: 5 ft",
                    props: "Versatile",
                    price: 15,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Whip",
                    desc: "Whip;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 10 ft",
                    props: "Finesse, Reach",
                    price: 2,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Blowgun",
                    desc: "Blowgun;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1, Damage Type: piercing, Range: 25/100",
                    props: "Ammunition, Loading",
                    price: 10,
                    weight: 1,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Hand Crossbow",
                    desc: "Hand Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120",
                    props: "Ammunition, Light, Loading",
                    price: 75,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Heavy Crossbow",
                    desc: "Heavy Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d10, Damage Type: piercing, Range: 100/400",
                    props: "Ammunition, Heavy, Loading, Two-Handed",
                    price: 50,
                    weight: 18,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Longbow",
                    desc: "Longbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 150/600",
                    props: "Ammunition, Heavy, Two-Handed",
                    price: 50,
                    weight: 2,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Net",
                    desc: "Net;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
                    mods: "Item Type: Ranged Weapon, Range: 5/15",
                    props: "Thrown, Special",
                    price: 1,
                    weight: 3,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Arrows",
                    desc: "Arrows;Arrows are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
                    mods: "Item Type: Ammunition",
                    props: "",
                    price: 1,
                    weight: 0.05,
                    amount: 1,
                    sellam: 20
                },
                {
                    name: "Blowgun needles",
                    desc: "Blowgun needles;Blowgun needles are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
                    mods: "Item Type: Ammunition",
                    props: "",
                    price: 1,
                    weight: 0.02,
                    amount: 1,
                    sellam: 50
                },
                {
                    name: "Crossbow bolts",
                    desc: "Crossbow bolts;Crossbow bolts are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
                    mods: "Item Type: Ammunition",
                    props: "",
                    price: 1,
                    weight: 0.075,
                    amount: 1,
                    sellam: 20
                },
                {
                    name: "Sling bullets",
                    desc: "Sling bullets;Sling bullets are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
                    mods: "Item Type: Ammunition",
                    props: "",
                    price: 0.04,
                    weight: 0.075,
                    amount: 1,
                    sellam: 20
                }
            ],
            armor: [
                {
                    name: "Padded Armor",
                    desc: "Padded Armor;Padded armor consists of quilted layers of cloth and batting.",
                    mods: "Item Type: Light Armor, AC: 11, Stealth:Disadvantage",
                    props: "",
                    price: 5,
                    weight: 8,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Leather Armor",
                    desc: "Leather Armor;The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.",
                    mods: "Item Type: Light Armor, AC: 11",
                    props: "",
                    price: 10,
                    weight: 10,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Studded Leather",
                    desc: "Studded Leather Armor;Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.",
                    mods: "Item Type: Light Armor, AC: 12",
                    props: "",
                    price: 45,
                    weight: 13,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Hide",
                    desc: "Hide;This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, and other folk who lack access to the tools and materials needed to create better armor.",
                    mods: "Item Type: Medium Armor, AC: 12",
                    props: "",
                    price: 10,
                    weight: 12,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Chain Shirt",
                    desc: "Chain Shirt;Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armor offers modest protection to the wearer\'s upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers.",
                    mods: "Item Type: Medium Armor, AC: 13",
                    props: "",
                    price: 50,
                    weight: 20,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Scale Mail",
                    desc: "Scale Mail;This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish. The suit includes gauntlets.",
                    mods: "Item Type: Medium Armor, AC: 14, Stealth:Disadvantage",
                    props: "",
                    price: 50,
                    weight: 45,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Breastplate",
                    desc: "Breastplate;This armor consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armor provides good protection for the wearer\'s vital organs while leaving the wearer relatively unencumbered.",
                    mods: "Item Type: Medium Armor, AC: 14",
                    props: "",
                    price: 400,
                    weight: 20,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Half Plate",
                    desc: "Half Plate;Half plate consists of shaped metal plates that cover most of the wearer\'s body. It does not include leg protection beyond simple greaves that are attached with leather straps.",
                    mods: "Item Type: Medium Armor, AC: 15, Stealth:Disadvantage",
                    props: "",
                    price: 750,
                    weight: 40,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Ring Mail",
                    desc: "Ring Mail;This armor is leather armor with heavy rings sewn into it. The rings help reinforce the armor against blows from swords and axes. Ring mail is inferior to chain mail, and it\'s usually worn only by those who can\'t afford better armor.",
                    mods: "Item Type: Heavy Armor, AC: 14, Stealth:Disadvantage",
                    props: "",
                    price: 30,
                    weight: 40,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Chain Mail",
                    desc: "Chain Mail;Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.",
                    mods: "Item Type: Heavy Armor, AC: 16, Stealth:Disadvantage",
                    props: "",
                    price: 75,
                    weight: 55,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Splint Mail",
                    desc: "Splint Mail;This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.",
                    mods: "Item Type: Heavy Armor, AC: 17, Stealth:Disadvantage",
                    props: "",
                    price: 200,
                    weight: 60,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Plate Armor",
                    desc: "Plate Armor;Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armor. Buckles and straps distribute the weight over the body.",
                    mods: "Item Type: Heavy Armor, AC: 18, Stealth:Disadvantage",
                    props: "",
                    price: 1500,
                    weight: 65,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "Shield",
                    desc: "Shield;A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2. You can benefit from only one shield at a time.",
                    mods: "Item Type: Shield, AC +2",
                    props: "",
                    price: 10,
                    weight: 6,
                    amount: 1,
                    sellam: 1
                }
            ],
            potion: [
                {
                    name: "Potion of Climbing",
                    desc: "Potion (common);When you drink this potion, for 1 hour, you gain a climbing speed equal to your walking speed for 1 hour. During this time, you have advantage on Strength (Athletics) checks you make to climb. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.",
                    mods: "Item Type: Potion, Athletics:Advantage",
                    props: "",
                    price: 180,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "common"
                },
                {
                    name: "Potion of Healing",
                    desc: "Potion (common);You regain 2d4 + 2 hit points when you drink this Potion.",
                    mods: "Item Type: Potion, Damage: 2d4+2, Damage Type: healing",
                    props: "",
                    price: 50,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "common"
                },
                {
                    name: "Philter of Love",
                    desc: "Potion (uncommon);You become charmed for 1 hour by the first creature you see within the first ten minutes of drinking this, and if that creature is of a species and gender you are normally attracted to you consider them your true love.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 90,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Poison",
                    desc: "Potion (uncommon);A creature that ingests this takes 3d6 poison damage and must succeed on a DC 13 Constitution saving throw or be poisoned. If poisoned, they take 3d6 poison damage at the start of each of its turns until the effect is ended. The creature can repeat the saving throw at the end of each of its turns. On a successful save, the damage on each subsequent turn is decreased by 1d6 until it hits 0.",
                    mods: "Item Type: Potion, Damage: 3d6, Damage Type: poison",
                    props: "",
                    price: 100,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Elixir of Health",
                    desc: "Potion (rare);Drinking this potion cures any disease you have and removes blinded, deafened, paralyzed, and poisoned conditions.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 120,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Fire Breath",
                    desc: "Potion (uncommon);After drinking this potion for 1 hour or up to 3 times, you can use your bonus action to exhale fire at a target within 30 feet. The target takes 4d6 fire damage or half on a successful DC 13 Dexterity saving throw.",
                    mods: "Item Type: Potion, Damage: 4d6, Damage Type: fire",
                    props: "",
                    price: 150,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Greater Healing",
                    desc: "Potion (uncommon);You regain 4d4 + 4 HP after drinking this Potion.",
                    mods: "Item Type: Potion, Damage: 4d4+4, Damage Type: healing",
                    props: "",
                    price: 150,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Heroism",
                    desc: "Potion (rare);When you drink this potion for 1 hour you gain 10 temporary HP as well as the effects of the bless spell (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 180,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Water Breathing",
                    desc: "Potion (uncommon);When you drink this potion you can breathe underwater for 1 hour.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 180,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Animal Friendship",
                    desc: "Potion (uncommon);After drinking this potion you can cast the Animal Friendship spell (save DC 13) at will for 1 hour.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 200,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Diminution",
                    desc: "Potion (rare);When you drink this potion, a creature gains the “reduce” effect of the Enlarge/Reduce spell for 1d4 hours (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 270,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Growth",
                    desc: "Potion (uncommon);When you drink this potion you gain the “enlarge” effect of the Enlarge/Reduce spell for 1d4 hours (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 270,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Gaseous Form",
                    desc: "Potion (rare);When you drink this potion you gain the effect of the gaseous form spell for 1 hour (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 300,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Resistance",
                    desc: "Potion (uncommon);When you drink this, for 1 hour, you gain resistance to one type of damage that the DM chooses.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 300,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Speed",
                    desc: "Potion (very rare);When you drink this potion you gain the effect of the haste spell for 1 minute (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 400,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Mind Reading",
                    desc: "Potion (rare);When drunk, a creature gains the effect of the Detect Thoughts spell for 1 minute (save DC 13).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 450,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Superior Healing",
                    desc: "Potion (rare);When you drink this potion you regain 8d4 + 8 HP.",
                    mods: "Item Type: Potion, Damage: 8d4+8, Damage Type: healing",
                    props: "",
                    price: 450,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Oil of Slipperiness",
                    desc: "Potion (uncommon);After taking 10 minutes to cover a medium or smaller creature this oil grants the covered creature the effects of the Freedom of Movement spell for 8 hours. The oil can also be poured on the ground covering a 10-foot square in order to replicate the spell Grease.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 480,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Flying",
                    desc: "Potion (very rare);For 1 hour after you drink this potion, you gain a flying speed equal to your walking speed and can hover.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 500,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Hill Giant Strength",
                    desc: "Potion (uncommon);When you drink this potion your Strength score is increased to 21 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 21",
                    props: "",
                    price: 500,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "uncommon"
                },
                {
                    name: "Potion of Invisibility",
                    desc: "Potion (very rare);When you drink this potion you become invisible for 1 hour, along with anything you're carrying or wearing. The effect ends early if you make an attack or cast a spell.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 600,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Mind Control (Beasts)",
                    desc: "Potion (rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don\'t, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 700,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Clairvoyance",
                    desc: "Potion (rare);When you drink this potion you gain the effect of the clairvoyance spell for 10 minutes.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 960,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Vitality",
                    desc: "Potion (very rare);When you drink this potion your exhaustion is removed and any diseases or poison effects are cured. For the next 24 hours, you regain the maximum number of HP for any Hit Die spent.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 960,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Supreme Healing",
                    desc: "Potion (very rare);When you drink this potion you regain 10d4 + 20 HP.",
                    mods: "Item Type: Potion, Damage: 10d4+20, Damage Type: healing",
                    props: "",
                    price: 1350,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Maximum Power",
                    desc: "Potion (rare);The first time you cast a damage-dealing spell of 4th level or lower within 1 minute of drinking the potion, instead of rolling dice to determine the damage dealt, you can instead use the highest number possible for each die.",
                    mods: "Item Type: Potion, Attack:Advantage",
                    props: "",
                    price: 1400,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Mind Control (Humanoids)",
                    desc: "Potion (rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don't, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 1550,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Mind Control (Any)",
                    desc: "Potion (very rare);When you drink this potion you can cast a Dominate spell (save DC 15) on a specific creature if you do so before the end of your next turn. If you don't, the potion is wasted. If the creature fails the save the effect lasts for 1 hour and the creature has disadvantage on subsequent saves (no concentration required).",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 1800,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Oil of Etherealness",
                    desc: "Potion (rare);After taking 10 minutes to cover a medium or smaller creature, that creature gains the effect of the etherealness spell for 1 hour.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 1920,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Stone Giant Strength",
                    desc: "Potion (rare);When you drink this potion your Strength score is increased to 23 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 23",
                    props: "",
                    price: 2000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Frost Giant Strength",
                    desc: "Potion (rare);When you drink this potion your Strength score is increased to 23 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 23",
                    props: "",
                    price: 2000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Fire Giant Strength",
                    desc: "Potion (rare);When you drink this potion your Strength score is increased to 25 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 25",
                    props: "",
                    price: 3000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Oil of Sharpness",
                    desc: "Potion (very rare);You can coat one slashing or piercing weapon or up to 5 pieces of ammunition with this oil, which takes 1 minute to apply. For 1 hour, the coated item has a +3 bonus to attack and damage rolls.",
                    mods: "Item Type: Potion, Attack +3",
                    props: "",
                    price: 3200,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Invulnerability",
                    desc: "Potion (rare);When drunk, a creature gains resistance to all damage.",
                    mods: "Item Type: Potion",
                    props: "",
                    price: 3840,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "rare"
                },
                {
                    name: "Potion of Cloud Giant Strength",
                    desc: "Potion (very rare);When you drink this potion your Strength score is increased to 27 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 27",
                    props: "",
                    price: 5000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Storm Giant Strength",
                    desc: "Potion (very rare);When you drink this potion your Strength score is increased to 29 for 1 hour.",
                    mods: "Item Type: Potion, Strength: 29",
                    props: "",
                    price: 6000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "very rare"
                },
                {
                    name: "Potion of Longevity",
                    desc: "Potion (legendary);When you drink this potion your physical age is reduced by 1d6 + 6 years, to a minimum of 13 years. Each subsequent time a creature drinks this potion, there is a 10% cumulative chance that it will instead age 1d6 +6 years.",
                    mods: "Item Type: Potion, Damage: 1d6+6, Damage Type: years",
                    props: "",
                    price: 9000,
                    weight: 0.5,
                    amount: 1,
                    sellam: 1,
                    rarity: "legendary"
                }
            ],
            scroll: [
                {
                    name: "Cantrip Scroll",
                    rarity: "common",
                    price: 50,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "1st-Level Scroll",
                    rarity: "common",
                    price: 100,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "2nd-Level Scroll",
                    rarity: "uncommon",
                    price: 250,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "3rd-Level Scroll",
                    rarity: "uncommon",
                    price: 500,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "4th-Level Scroll",
                    rarity: "rare",
                    price: 1000,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "5th-Level Scroll",
                    rarity: "rare",
                    price: 2500,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "6th-Level Scroll",
                    rarity: "very rare",
                    price: 10000,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "7th-Level Scroll",
                    rarity: "very rare",
                    price: 25000,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "8th-Level Scroll",
                    rarity: "very rare",
                    price: 50000,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "9th-Level Scroll",
                    rarity: "legendary",
                    price: 80000,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                }
            ],
            spell: [
                {
                    name: "Acid Splash",
                    desc: "Conjuration cantrip;You hurl a bubble of acid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.<br><br>At Higher Levels. This spell\'s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
                    mods: "Item Type: Scroll, Damage: 1d6, Damage Type: acid",
                    props: "",
                    level: "cantrip",
                    price: 0,
                    weight: 0,
                    amount: 0,
                    sellam: 0
                },
            ],
            misc: [],
            mundane: []
        }
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
                                                editMenu(store,option,undefined,item);
                                            } else if (args[4]=="del") {
                                                deleteItem(store,item);
                                            } else if (args[4].includes("mode")) {
                                                let mode=args[4].replace("mode ","").toLowerCase();
                                                if (mode=="none" || mode=="" || mode==" ") {
                                                    mode=undefined;
                                                }
                                                let name;
                                                let desc;
                                                let mods;
                                                let props;
                                                let price;
                                                let weight;
                                                let amount;
                                                let sellam;
                                                for (let i=5;i<11;i++) {
                                                    if (args[i].includes("name")) {
                                                        name=args[i].replace("name ","");
                                                    } else if (args[i].includes("desc")) {
                                                        desc=args[i].replace("desc ","");
                                                    } else if (args[i].includes("mods")) {
                                                        mods=args[i].replace("mods ","");
                                                    } else if (args[i].includes("props")) {
                                                        props=args[i].includes("props ","");
                                                    } else if (args[i].includes("price")) {
                                                        price=args[i].replace("price ","");
                                                    } else if (args[i].includes("amount")) {
                                                        amount=Number(args[i].replace("amount ",""));
                                                    } else if (args[i].includes("sellam")) {
                                                        sellam=Number(args[i].replace("sellam ",""));
                                                    } else if (args[i].includes("weight")) {
                                                        weight=Number(args[i].replace("weight ",""));
                                                    }
                                                }
                                                if (args[11]=="confirm") {
                                                    editItem(store,item,name,desc,mods,props,price,weight,amount,sellam)
                                                } else if (args[11]==undefined || args[11]!=="confirm") {
                                                    editMenu(store,option,mode,item,name,desc,mods,props,price,weight,amount,sellam);
                                                }
                                            } else if (args[4].includes("name") || args[4].includes("desc") || args[4].includes("mods") || args[4].includes("props") || args[4].includes("price") || args[4].includes("amount") || args[4].includes("sellam")) {
                                                let name;
                                                let desc;
                                                let mods;
                                                let props;
                                                let price;
                                                let amount;
                                                let sellam;
                                                let weight;
                                                for (let i=4;i<10;i++) {
                                                    if (args[i].includes("name")) {
                                                        name=args[i].replace("name ","");
                                                    } else if (args[i].includes("desc")) {
                                                        desc=args[i].replace("desc ","");
                                                    } else if (args[i].includes("mods")) {
                                                        mods=args[i].replace("mods ","");
                                                    } else if (args[i].includes("props")) {
                                                        props=args[i].includes("props ","");
                                                    } else if (args[i].includes("price")) {
                                                        price=args[i].replace("price ","");
                                                    } else if (args[i].includes("amount")) {
                                                        amount=Number(args[i].replace("amount ",""));
                                                    } else if (args[i].includes("sellam")) {
                                                        sellam=Number(args[i].replace("sellam ",""));
                                                    } else if (args[i].includes("weight")) {
                                                        weight=Number(args[i].replace("weight ",""));
                                                    }
                                                }
                                                if (args[10]=="confirm") {
                                                    editItem(store,item,name,desc,mods,props,price,weight,amount,sellam)
                                                } else if (args[10]==undefined || args[10]!=="confirm") {
                                                    editMenu(store,option,undefined,item,name,desc,mods,props,price,weight,amount,sellam);
                                                }
                                            }
                                        }
                                        sendChat("/w gm Invalid Item. Please use the name/number of an existing Item");
                                    } else if (args[3]=="new") {
                                        if (args[11]==undefined) {
                                            let name;
                                            let desc;
                                            let mods;
                                            let props;
                                            let price;
                                            let weight;
                                            let amount;
                                            let sellam;
                                            for (let i=4;i<11;i++) {
                                                if (args[i].includes("name")) {
                                                    name=args[i].replace("name ","");
                                                } else if (args[i].includes("desc")) {
                                                    desc=args[i].replace("desc ","");
                                                } else if (args[i].includes("mods")) {
                                                    mods=args[i].replace("mods ","");
                                                } else if (args[i].includes("props")) {
                                                    props=args[i].replace("props ","");
                                                } else if (args[i].includes("price")) {
                                                    price=Number(args[i].replace("price ",""));
                                                } else if (args[i].includes("weight")) {
                                                    weight=Number(args[i].replace("weight ",""));
                                                } else if (args[i].includes("amount")) {
                                                    amount=Number(args[i].replace("amount ",""));
                                                } else if (args[i].includes("sellam")) {
                                                    sellam=Number(args[i].replace("sellam ",""));
                                                }
                                            }
                                            editMenu(store,option,undefined,undefined,name,desc,mods,props,price,weight,amount,sellam);
                                        } else if (args[11]=="confirm") {
                                            addItem(store,name,desc,mods,props,price,weight,amount,sellam);
                                        }
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
                                            } else if (args[4].includes("amount")) {
                                                let amount=Number(args[4].replace("amount ",""));
                                                if (args[5]==undefined) {
                                                    sendChat("Item Store","/w gm You must define a minimum rarity!");
                                                } else if (args[5].includes("minrare")) {
                                                    let minrare=args[5].replace("minrare ","").toLowerCase();
                                                    if ((minrare=="" || minrare==" ") || !state.rareList.toLowerCase().includes(minrare)) {
                                                        sendChat("Item Store","/w gm Please define a valid minimum Rarity! View the Rarity List in the [Wiki](https://github.com/Julexar/itemstore/wiki/Rarity-List) for help.");
                                                    } else if (state.rareList.toLowerCase().includes(minrare)) {
                                                        if (args[6]==undefined) {
                                                            sendChat("Item Store","/w gm You must define a maximum rarity!");
                                                        } else if (args[6].includes("maxrare")) {
                                                            let maxrare=args[6].replace("maxrare ","").toLowerCase();
                                                            if ((maxrare=="" || maxrare==" ") || !state.rareList.toLowerCase().includes(maxrare)) {
                                                                sendChat("Item Store","/w gm Please define a valid maximum Rarity! View the Rarity List in the [Wiki](https://github.com/Julexar/itemstore/wiki/Rarity-List) for help.");
                                                            } else if (state.rareList.toLowerCase().includes(maxrare)) {
                                                                if (args[7]==undefined) {
                                                                    args[7]=true;
                                                                    createInv(store,type,amount,minrare,maxrare,args[7]);
                                                                } else if (args[7].includes("overwrite")) {
                                                                    let overwrite=Boolean(args[7].replace("overwrite ",""));
                                                                    createInv(store,type,amount,minrare,maxrare,overwrite);
                                                                }
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
                            sendChat("Item Store","/w "+msg.who+" Please input a Store!");
                        } else if (args[2].includes("store")) {
                            let store=args[2].replace("store ","");
                            if (store=="" || store==" ") {
                                sendChat("Item Store","/w "+msg.who+" Please select a valid Store!");
                            } else {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" Please input a Character Name/ID!");
                                } else if (args[3].includes("charid")) {
                                    let charid=args[3].replace("charid ","");
                                    let char=findObjs({
                                        _type: 'character',
                                        id: charid
                                    }, {caseInsensitive: true})[0];
                                    if (char==undefined) {
                                        sendChat("Item Store","/w "+msg.who+" Please input a valid Character ID!");
                                    } else if (char!==undefined) {
                                        if (args[4].includes("buy")) {
                                            let item=args[4].replace("buy ","");
                                            if (item=="" || item==" ") {
                                                sendChat("Item Store","/w "+msg.who+" Please select a valid Item!");
                                            } else {
                                                if (args[5]==undefined) {
                                                    addToCart(cart,store,item,msg);
                                                    shopMenu(store,cart,msg);
                                                } else if (args[5].includes("amount")) {
                                                    let amount=Number(args[5].replace("amount ",""));
                                                    addToCart(cart,store,item,amount,msg);
                                                    shopMenu(store,cart,msg);
                                                }
                                            }
                                        } else if (args[4]==undefined) {
                                            shopMenu(store,cart,msg);
                                        } else if (args[4]=="haggle") {
                                            if (args[5]==undefined) {
                                                sendChat("Item Store","/w "+msg.who+" You must define an Item you wish to haggle for.");
                                            } else if (args[5].includes("item")) {
                                                let item=args[5].replace("item ","");
                                                if (args[6]==undefined) {
                                                    haggleMenu(store,item,args[6],undefined,args[3],msg);
                                                } else if (args[6].includes("amount")) {
                                                    let amount=Number(args[6].replace("amount ",""));
                                                    if (amount=="" || amount==" ") {
                                                        sendChat("Item Store","/w "+msg.who+" Please input a valid Amount!");
                                                    } else {
                                                        if (args[7]==undefined) {
                                                            haggleMenu(store,item,amount,args[7],args[3],msg);
                                                        } else if (args[7].includes("skill")) {
                                                            let skill=args[7].replace("skill ","");
                                                            if (skill.toLowerCase()!=="persuasion" || skill.toLowerCase()!=="intimidation") {
                                                                sendChat("Item Store","/w "+msg.who+" You must pick either Persuasion or Intimidation!");
                                                            } else if (skill.toLowerCase()=="persuasion" || skill.toLowerCase()=="intimidation") {
                                                                haggleMenu(store,item,amount,skill,args[3],msg);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (args[3].includes("char")) {
                                    let charname=args[3].replace("char ","");
                                    let char=findObjs({
                                        _type: 'character',
                                        name: charname
                                    }, {caseInsensitive: true})[0];
                                    if (char==undefined) {
                                        sendChat("Item Store","/w "+msg.who+" Please input a Character Name/ID!");
                                    } else if (char!==undefined) {
                                        if (args[4].includes("buy")) {
                                            let item=args[4].replace("buy ","");
                                            if (item=="" || item==" ") {
                                                sendChat("Item Store","/w "+msg.who+" Please select a valid Item!");
                                            } else {
                                                if (args[5]==undefined) {
                                                    addToCart(cart,store,item,msg);
                                                    shopMenu(store,cart,msg);
                                                } else if (args[5].includes("amount")) {
                                                    let amount=Number(args[5].replace("amount ",""));
                                                    addToCart(cart,store,item,amount,msg);
                                                    shopMenu(store,cart,msg);
                                                }
                                            }
                                        } else if (args[4]==undefined) {
                                            shopMenu(store,cart,msg);
                                        } else if (args[4]=="haggle") {
                                            if (args[6]==undefined) {
                                                sendChat("Item Store","/w "+msg.who+" Please input a valid Amount!");
                                            } else if (args[6].includes("amount")) {
                                                let amount=Number(args[6].replace("amount ",""));
                                                if (amount=="" || amount==" ") {
                                                    sendChat("Item Store","/w "+msg.who+" Please input a valid Amount!");
                                                } else {
                                                    if (args[7]==undefined) {
                                                        haggleMenu(store,amount,args[7],args[3],msg);
                                                    } else if (args[7].includes("skill")) {
                                                        let skill=args[7].replace("skill ","");
                                                        if (skill.toLowerCase()!=="persuasion" || skill.toLowerCase()!=="intimidation") {
                                                            sendChat("Item Store","/w "+msg.who+" You must pick either Persuasion or Intimidation!");
                                                        } else if (skill.toLowerCase()=="persuasion" || skill.toLowerCase()=="intimidation") {
                                                            haggleMenu(store,amount,skill,args[3],msg);
                                                        }
                                                    }
                                                }
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
                            sendChat("Item Store","/w "+msg.who+" Please insert a Character Name/ID!");
                        } else if (args[2].includes("charid")) {
                            let charid=args[2].replace("charid ","");
                            let char=findObjs({
                                _type: 'character',
                                id: charid
                            }, {caseInsensitive: true})[0];
                            if (char==undefined) {
                                sendChat("Item Store","/w "+msg.who+" Please insert a valid Character ID!");
                            } else if (char!==undefined) {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" Please define an Item you want to buy!");
                                } else if (args[3].includes("buy")) {
                                    let item=args[3].replace("buy ","");
                                    if (args[4]==undefined) {
                                        purchaseMenu(store,item,1,args[2],msg);
                                    } else if (args[4].includes("amount")) {
                                        let amount=Number(args[4].replace("amount ",""));
                                        purchaseMenu(store,item,amount,args[2],msg);
                                    }
                                }
                            }
                        } else if (args[2].includes("char")) {
                            let charname=args[2].replace("char ","");
                            let char=findObjs({
                                _type: 'character',
                                name: charname
                            }, {caseInsensitive: true})[0];
                            if (char==undefined) {
                                sendChat("Item Store","/w "+msg.who+" Please insert a valid Character ID!");
                            } else if (char!==undefined) {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" Please define an Item you want to buy!");
                                } else if (args[3].includes("buy")) {
                                    let item=args[3].replace("buy ","");
                                    if (args[4]==undefined) {
                                        purchaseMenu(store,item,1,args[2],msg);
                                    } else if (args[4].includes("amount")) {
                                        let amount=Number(args[4].replace("amount ",""));
                                        purchaseMenu(store,item,amount,args[2],msg);
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
                        sendChat("Item Store","/w "+msg.who+" Please select an Item you wish to haggle for!");
                    } else if (args[2].includes("item")) {
                        let item=args[2];
                        if (args[3]==undefined) {
                            sendChat("Item Store","/w "+msg.who+" Please select a valid Character Name/ID!");
                        } else if (args[3].includes("charid")) {
                            if (args[4]==undefined) {
                                sendChat("Item Store","/w "+msg.who+" Please define an Amount you wish you haggle for!");
                            } else if (args[4].includes("amount")) {
                                let amount=Number(args[4].replace("amount ",""));
                                if (args[5]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" You must select either Persuasion or Intimidation to Haggle!");
                                } else if (args[5].includes("skill")) {
                                    let skill=args[4].replace("skill ","");
                                    haggle(store,item,args[2],amount,skill);
                                    shopMenu(store,undefined,msg);
                                }
                            }
                        } else if (args[3].includes("char")) {
                            if (args[4]==undefined) {
                                sendChat("Item Store","/w "+msg.who+" Please define an Amount you wish you haggle for!");
                            } else if (args[4].includes("amount")) {
                                let amount=Number(args[4].replace("amount ",""));
                                if (args[5]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" You must select either Persuasion or Intimidation to Haggle!");
                                } else if (args[5].includes("skill")) {
                                    let skill=args[4].replace("skill ","");
                                    haggle(store,item,args[2],amount,skill);
                                    shopMenu(store,undefined,msg);
                                }
                            }
                        }
                    }
                }
            return;
            case '!checkout':
                if (args[1].includes("cart")) {
                    let cart=Number(args[1].replace("cart ",""));
                    if (args[2]==undefined) {
                        sendChat("Item Store","/w "+msg.who+" You must define a Character!");
                    } else if (args[2].includes("charid")) {
                        let charid=args[2].replace("charid ","");
                        let char=findObjs({
                            _type: 'character',
                            id: charid
                        }, {caseInsensitive: true})[0];
                        if (char==undefined) {
                            sendChat("Item Store","/w "+msg.who+" You must define a valid Character ID!");
                        } else if (char!==undefined) {
                            purchase("cart",cart,undefined,undefined,args[2],msg);
                        }
                    } else if (args[2].includes("char")) {
                        let charname=args[2].replace("char ","");
                        let char=findObjs({
                            _type: 'character',
                            name: charname
                        }, {caseInsensitive: true})[0];
                        if (char==undefined) {
                            sendChat("Item Store","/w "+msg.who+" You must define a valid Character Name!");
                        } else if (char!==undefined) {
                            purchase("cart",cart,undefined,undefined,args[2],msg);
                        }
                    }
                } else if (args[1].includes("store")){
                    let store=args[1].replace("store ","");
                    if (store=="" || store==" ") {
                        sendChat("Item Store","/w "+msg.who+" Please define a valid Store!");
                    } else {
                        if (args[2]==undefined) {
                            sendChat("Item Store","/w "+msg.who+" You must specify a Character!");
                        } else if (args[2].includes("charid")) {
                            let charid=args[2].replace("charid ","");
                            let char=findObjs({
                                _type: 'character',
                                id: charid
                            }, {caseInsensitive: true})[0];
                            if (char==undefined) {
                                sendChat("Item Store","/w "+msg.who+" You must define a valid Character ID!");
                            } else if (char!==undefined) {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" You must define an Item to purchase!");
                                } else if (args[3].includes("item")) {
                                    let item=args[3].replace("item ","");
                                    if (item=="" || item==" ") {
                                        sendChat("Item Store","/w "+msg.who+" Please define a valid Item.");
                                    } else {
                                        if (args[4]==undefined) {
                                            purchase("item",item,1,store,args[3],msg);
                                        } else if (args[4].includes("amount")) {
                                            let amount=Number(args[4].replace("amount ",""));
                                            purchase("item",item,amount,store,args[2],msg);
                                        }
                                    }
                                }
                            }
                        } else if (args[2].includes("char")) {
                            let charname=args[2].replace("char ","");
                            let char=findObjs({
                                _type: 'character',
                                id: charname
                            }, {caseInsensitive: true})[0];
                            if (char==undefined) {
                                sendChat("Item Store","/w "+msg.who+" You must define a valid Character ID!");
                            } else if (char!==undefined) {
                                if (args[3]==undefined) {
                                    sendChat("Item Store","/w "+msg.who+" You must define an Item to purchase!");
                                } else if (args[3].includes("item")) {
                                    let item=args[3].replace("item ","");
                                    if (item=="" || item==" ") {
                                        sendChat("Item Store","/w "+msg.who+" Please define a valid Item.");
                                    } else {
                                        if (args[4]==undefined) {
                                            purchase("item",item,1,store,args[3],msg);
                                        } else if (args[4].includes("amount")) {
                                            let amount=Number(args[4].replace("amount ",""));
                                            purchase("item",item,amount,store,args[2],msg);
                                        }
                                    }
                                }
                            }
                        }
                    }
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
            }
        }
    },
    
    editMenu = function(shop,option,mode,item,name,desc,mods,props,price,weight,amount,sellam) {
        //Pulls up Menu where you can edit Items
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-top: 1px solid #cccccc; text-align: left;"';
        var tdstyle = 'style="text-align: right;"';
        shop=state.store.find(s => s.name==shop);
        let shopList=[];
        let count=0;
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].active==true) {
                shopList[count]=state.store[i].name;
                count++;
            }
        }
        for (let i=0;i<count;i++) {
            shopList=String(shopList).replace(",","|");
        }
        if (shop==undefined) {
            sendChat("Item Store","/w gm Could not find that Store, please specify a valid Store!");
        } else {
            let inv=shop.inv;
            let itemList=[];
            for (let i=0;i<inv.length;i++) {
                itemList[i]=inv[i].name;
            }
            item=itemList.find(i => i.name==item);
            if (option=="edit") {
                if (mode==undefined) {
                    if (item==undefined) {
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Menu</div>' + //--
                            '<div ' + substyle + '>Edit Mode</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --item ?{Item?|Insert Item name} --mode none">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Mode: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode ?{Mode?|Add|Rem|None}">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Item: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ?{Item?|' + itemList + '} --mode none">Not selected</a></td></tr>' + //--
                            '</table>' + //--
                            '</div>'
                        );
                    } else if (item!==undefined) {
                        if (state.temp.oldname!==item.name) {
                            state.used=false;
                        }
                        if (state.used==false) {
                            state.temp.oldname=item.name;
                            state.temp.name=item.name;
                            state.temp.desc=item.desc;
                            state.temp.mods=item.mods;
                            state.temp.props=item.props;
                            state.temp.price=item.price;
                            state.temp.weight=item.weight;
                            state.temp.amount=item.amount;
                            state.temp.sellam=item.sellam;
                            state.used=true;
                        }
                        if (name!==undefined && name!=="" && name!==" ") {
                            state.temp.name=name;
                        } else if (name==undefined || name=="" || name==" ") {
                            name=state.temp.name;
                        }
                        if (desc!==undefined && desc!=="" && desc!==" ") {
                            state.temp.desc=desc;
                        } else if (desc==undefined || desc=="" || desc==" ") {
                            desc=state.temp.desc;
                        }
                        if (mods!==undefined && mods!=="" && mods!==" ") {
                            state.temp.mods=mods;
                        } else if (mods==undefined || mods=="" || mods==" ") {
                            mods=state.temp.mods;
                        }
                        if (props!==undefined && props!=="" && props!==" ") {
                            state.temp.props=props;
                        } else if (props==undefined || props=="" || props ==" ") {
                            props=state.temp.props;
                        }
                        if (price!==undefined && price!=="" && price!==" ") {
                            state.temp.price=Number(price);
                        } else if (price==undefined || price=="" || price==" ") {
                            price=state.temp.price;
                        }
                        if (amount!==undefined && amount!=="" && amount!==" ") {
                            state.temp.amount=Number(amount);
                        } else if (amount==undefined || amount=="" || amount==" ") {
                            amount=state.temp.amount;
                        }
                        if (sellam!==undefined && sellam!=="" && sellam!==" ") {
                            state.temp.sellam=Number(sellam);
                        } else if (sellam==undefined || sellam=="" || sellam==" ") {
                            sellam=state.temp.sellam;
                        }
                        if (weight!==undefined && weight!=="" && weight!==" ") {
                            state.temp.weight=Number(weight);
                        } else if (weight==undefined || weight=="" || weight==" ") {
                            weight=state.temp.weight;
                        }
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Menu</div>' + //--
                            '<div ' + substyle + '>Edit Mode</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --item ?{Item?|Insert Item name} --mode none">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Mode: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode ?{Mode?|Add|Rem|None}">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Item: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ?{Item?|' + itemList + '} --mode none">' + item.name + '</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Name: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --name ?{Name?|Insert Name}">' + name + '</a></td></tr>' + //--
                            '<tr><td>Description: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --desc ?{Description?|Insert Description}">' + desc + '</a></td></tr>' + //--
                            '<tr><td>Modifiers: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --mods ?{Modifier?|Insert Modifiers}">' + mods + '</a></td></tr>' + //--
                            '<tr><td>Properties: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --props ?{Properties?|Insert Properties}">' + props + '</a></td></tr>' + //--
                            '<tr><td>Price: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --price ?{Price?|1}">' + price + ' GP</a></td></tr>' + //--
                            '<tr><td>Weight: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --weight ?{Weight?|1}">' + weight + ' lbs</a></td></tr>' + //--
                            '<tr><td>Amount (in stock): </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                            '<tr><td>Bundle size: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --sellam ?{Bundle size?|1}">' + sellam + '</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv edit --name ' + name + ' --desc ' + desc + ' --mods ' + mods + ' --props ' + props + ' --price ' + price + ' --weight ' + weight + ' --amount ' + amount + ' --sellam ' + sellam + ' --confirm">Apply Changes</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --del">Delete Item</a></div>' + //--
                            '</div>'
                        );
                    }
                } else if (mode=="add") {
                    if (item==undefined) {
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Menu</div>' + //--
                            '<div ' + substyle + '>Edit Mode</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --mode none --item ?{Item?|Insert Item name}">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Mode: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --mode ?{Mode?|Add|Rem|None} --item ' + item.name + '">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Item: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --mode none --item ?{Item?|' + itemList + '}">Not selected</a></td></tr>' + //--
                            '</table>' + //--
                            '</div>'
                        );
                    } else if (item!==undefined) {
                        if (state.temp.oldname!==item.name) {
                            state.used=false;
                        }
                        if (state.used==false) {
                            state.temp.oldname=item.name;
                            state.temp.name=item.name;
                            state.temp.desc=item.desc;
                            state.temp.mods=item.mods;
                            state.temp.props=item.props;
                            state.temp.price=item.price;
                            state.temp.weight=item.weight;
                            state.temp.amount=item.amount;
                            state.temp.sellam=item.sellam;
                            state.used=true;
                        }
                        if (name!==undefined && name!=="" && name!==" ") {
                            state.temp.name=name;
                        } else if (name==undefined || name=="" || name==" ") {
                            name=state.temp.name;
                        }
                        if (desc!==undefined && desc!=="" && desc!==" ") {
                            state.temp.desc=desc;
                        } else if (desc==undefined || desc=="" || desc==" ") {
                            desc=state.temp.desc;
                        }
                        if (mods!==undefined && mods!=="" && mods!==" ") {
                            state.temp.mods+=mods;
                        } else if (mods==undefined || mods=="" || mods==" ") {
                            mods=state.temp.mods;
                        }
                        if (props!==undefined && props!=="" && props!==" ") {
                            state.temp.props+=props;
                        } else if (props==undefined || props=="" || props ==" ") {
                            props=state.temp.props;
                        }
                        if (price!==undefined && price!=="" && price!==" ") {
                            state.temp.price+=Number(price);
                        } else if (price==undefined || price=="" || price==" ") {
                            price=state.temp.price;
                        }
                        if (amount!==undefined && amount!=="" && amount!==" ") {
                            state.temp.amount+=Number(amount);
                        } else if (amount==undefined || amount=="" || amount==" ") {
                            amount=state.temp.amount;
                        }
                        if (sellam!==undefined && sellam!=="" && sellam!==" ") {
                            state.temp.sellam+=Number(sellam);
                        } else if (sellam==undefined || sellam=="" || sellam==" ") {
                            sellam=state.temp.sellam;
                        }
                        if (weight!==undefined && weight!=="" && weight!==" ") {
                            state.temp.weight+=Number(weight);
                        } else if (weight==undefined || weight=="" || weight==" ") {
                            weight=state.temp.weight;
                        }
                        sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                            '<div ' + headstyle + '>Item Menu</div>' + //--
                            '<div ' + substyle + '>Edit Mode</div>' + //--
                            '<div ' + arrowstyle + '></div>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --item ?{Item?|Insert Item name} --mode none">' + shop.name + '</a></td></tr>' + //--
                            '<tr><td>Mode: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode ?{Mode?|Add|Rem|None}">None</a></td></tr>' + //--
                            '</table>' + //--
                            '<br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Item: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ?{Item?|' + itemList + '} --mode none">' + item.name + '</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<table ' + tablestyle + '>' + //--
                            '<tr><td>Name: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --name ?{Name?|Insert Name}">' + name + '</a></td></tr>' + //--
                            '<tr><td>Description: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --desc ?{Description?|Insert Description}">' + desc + '</a></td></tr>' + //--
                            '<tr><td>Modifiers: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --mods ?{Modifier?|Insert Modifiers}">' + mods + '</a></td></tr>' + //--
                            '<tr><td>Properties: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --props ?{Properties?|Insert Properties}">' + props + '</a></td></tr>' + //--
                            '<tr><td>Price: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --price ?{Price?|1}">' + price + ' GP</a></td></tr>' + //--
                            '<tr><td>Weight: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --weight ?{Weight?|1}">' + weight + ' lbs</a></td></tr>' + //--
                            '<tr><td>Amount (in stock): </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                            '<tr><td>Bundle size: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mode none --sellam ?{Bundle size?|1}">' + sellam + '</a></td></tr>' + //--
                            '</table>' + //--
                            '<br><br>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv edit --name ' + name + ' --desc ' + desc + ' --mods ' + mods + ' --props ' + props + ' --price ' + price + ' --weight ' + weight + ' --amount ' + amount + ' --sellam ' + sellam + ' --confirm">Apply Changes</a></div>' + //--
                            '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --del">Delete Item</a></div>' + //--
                            '</div>'
                        );
                    }
                }
            } else if (option=="new") {
                if (state.temp.oldname!==name) {
                    state.temp.oldname=name;
                    state.used=false;
                }
                if (state.used==false) {
                    state.temp.name=state.temp.oldname;
                    state.temp.desc=desc;
                    state.temp.mods=mods;
                    state.temp.props=props;
                    state.temp.price=price;
                    state.temp.weight=weight;
                    state.temp.amount=amount;
                    state.temp.sellam=sellam;
                    state.used=true;
                }
                if (name!==undefined && name!=="" && name!==" ") {
                    state.temp.name=name;
                } else if (name==undefined || name=="" || name==" ") {
                    name=state.temp.name;
                }
                if (desc!==undefined && desc!=="" && desc!==" ") {
                    state.temp.desc=desc;
                } else if (desc==undefined || desc=="" || desc==" ") {
                    desc=state.temp.desc;
                }
                if (mods!==undefined && mods!=="" && mods!==" ") {
                    state.temp.mods+=mods;
                } else if (mods==undefined || mods=="" || mods==" ") {
                    mods=state.temp.mods;
                }
                if (props!==undefined && props!=="" && props!==" ") {
                    state.temp.props+=props;
                } else if (props==undefined || props=="" || props ==" ") {
                    props=state.temp.props;
                }
                if (price!==undefined && price!=="" && price!==" ") {
                    state.temp.price+=Number(price);
                } else if (price==undefined || price=="" || price==" ") {
                    price=state.temp.price;
                }
                if (amount!==undefined && amount!=="" && amount!==" ") {
                    state.temp.amount+=Number(amount);
                } else if (amount==undefined || amount=="" || amount==" ") {
                    amount=state.temp.amount;
                }
                if (sellam!==undefined && sellam!=="" && sellam!==" ") {
                    state.temp.sellam+=Number(sellam);
                } else if (sellam==undefined || sellam=="" || sellam==" ") {
                    sellam=state.temp.sellam;
                }
                if (weight!==undefined && weight!=="" && weight!==" ") {
                    state.temp.weight+=Number(weight);
                } else if (weight==undefined || weight=="" || weight==" ") {
                    weight=state.temp.weight;
                }
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Item Menu</div>' + //--
                    '<div ' + substyle + '>Create Mode</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<table ' + tablestyle + '>' + //--
                    '<tr><td>Current Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --new">' + shop.name + '</a></td></tr>' + //--
                    '</table>' + //--
                    '<br><br>' + //--
                    '<table ' + tablestyle + '>' + //--
                    '<tr><td>Name: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --name ?{Name?|Insert Name}">' + name + '</a></td></tr>' + //--
                    '<tr><td>Description: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --desc ?{Description?|Insert Desc.}">' + name + '</a></td></tr>' + //--
                    '<tr><td>Modifiers: </td><td ' + tdsytle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --mods ?{Modifiers?|Insert Mods}">' + mods + '</a></td></tr>' + //--
                    '<tr><td>Properties: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --props ?{Properties?|Insert Props}">' + props + '</a></td></tr>' + //--
                    '<tr><td>Price: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --price ?{Price?|1}">' + price + ' GP</a></td></tr>' + //--
                    '<tr><td>Weight: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --weight ?{Weight?|1}">' + weight + ' lbs</a></td></tr>' + //--
                    '<tr><td>Amount (in stock): </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                    '<tr><td>Bundle amount: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --new --sellam ?{Bundle amount?|1}">' + sellam + '</a></td></tr>' + //--
                    '</table>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --new --name ' + name + ' --desc ' + desc + ' --mods ' + mods + ' --props ' + props + ' --price ' + price + ' --weight ' + weight + ' --amount ' + amount + ' --sellam ' + sellam + ' --confirm">Create Item</a></div>' + //--
                    '</div>'  
                );
            }
        }
    },

    addItem = function(store,iname,idesc,imods,iprops,iprice,iweight,iamount,isellam) {
        //Adds an Item to a Shop's Inventory
        store=state.store.find(s => s.name==store);
        let len=store.inv.length;
        store.inv[len]={
            name: iname,
            desc: idesc,
            mods: imods,
            props: iprops,
            price: Number(iprice),
            weight: Number(iweight),
            amount: Number(iamount),
            sellam: Number(isellam)
        };
        let desc=idesc.split(";");
        sendChat("Item Store","/w gm Created Item #"+len+"<br>Name: "+iname+"<br>Description: "+desc[0]+'<br><div style="text-align:center;">'+desc[1]+"</div><br>Modifiers: "+imods+"<br>Properties: "+iprops+"<br>Price: "+iprice+" GP<br>Weight: "+iweight+" lbs<br>Amount (in stock): "+iamount+"<br>Bundle amount: "+isellam);
    },

    editItem = function(store,item,name,desc,mods,props,price,weight,amount,sellam) {
        //Edit the Items in a Shop's Inventory
        store=state.store.find(s => s.name==store);
        let num;
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                num=i;
            }
        }
        item=store.inv.find(i => i.name==item);
        let inum;
        for (let i=0;i<store.inv.lenth;i++) {
            if (store.inv[i].name==item) {
                inum=i;
            }
        }
        sendChat("Item Store","/w gm Successfully edited Item #"+inum+"<br><br><b>Old Item</b><br>Name: "+store.inv[inum].name+"<br>Description: "+store.inv[inum].desc+"<br>Modifiers: "+store.inv[inum].mods+"<br>Properties: "+store.inv[inum].props+"<br>Price: "+store.inv[inum].price+" GP<br>Weight: "+store.inv[inum].weight+" lbs<br>Amount (in stock): "+store.inv[inum].amount+"<br>Bundle amount: "+store.inv[inum].sellam+"<br><br><b>New Item</b><br>Name: "+name+"<br>Description: "+desc+"<br>Modifiers: "+mods+"<br>Properties: "+props+"<br>Price: "+price+" GP<br>Weight: "+weight+" lbs<br>Amount (in stock): "+amount+"<br>Bundle amount: "+sellam);
        if (name!==undefined && name!=="" && name!==" ") {
            store.inv[inum].name=name;
        }
        if (desc!==undefined && desc!=="" && name!==" ") {
            store.inv[inum].desc=desc;
        }
        if (mods!==undefined && mods!=="" && mods!==" ") {
            store.inv[inum].mods=mods;
        }
        if (props!==undefined && props!=="" && props!==" ") {
            store.inv[inum].props=props;
        }
        if (price!==undefined && price!=="" && price!==" ") {
            store.inv[inum].price=price;
        }
        if (weight!==undefined && weight!=="" && weight!==" ") {
            store.inv[inum].weight=weight;
        }
        if (amount!==undefined && amount!=="" && amount!==" ") {
            store.inv[inum].amount=amount;
        }
        if (sellam!==undefined && sellam!=="" && sellam!==" ") {
            store.inv[inum].sellam=sellam;
        }
        state.store[num]=store.inv;
    },

    removeItem = function(store,item) {
        //Removes an Item from the Shop's Inventory
        store=state.store.find(s => s.name==store);
        let num;
        for (let i=0;i<store.inv.length;i++) {
            if (state.store[i].name==item) {
                num=i;
            }
        }
        state.store.splice(num);
        sendChat("Item Store","/w gm Deleted Item #"+Number(num+1)+"<br>Name: "+item);
    },

    createInv = function(store,type,amount,minrare,maxrare,overwrite) {
        //Generate a random Inventory
        store=state.store.find(s => s.name==store);
        let rarity=checkRarity(minrare,maxrare);
        minrare=rarity[0];
        maxrare=rarity[1];
        if (Boolean(overwrite)==true) {
            let list;
            let seclist;
            type=type.toLowerCase();
            if (type.includes("weapon")) {
                list=genWeapon(amount,minrare,maxrare);
            } else if (type.includes("armor")) {
                list=genArmor(amount,minrare,maxrare);
            } else if (type.includes("scroll")) {
                list=genScroll(amount,minrare,maxrare);
            } else if (type.includes("potion")) {
                list=genPotion(amount,minrare,maxrare);
            } else if (type.includes("misc")) {
                list=genMisc(amount,minrare,maxrare);
            } else if (type.includes("mund")) {
                list=genMundane(amount);
            } else if (type.includes("rand")) {
                for (let i=0;i<amount;i++) {
                    let rand=randomInteger(6);
                    if (list!==undefined) {
                        if (rand==1) {
                            list.push(genWeapon(1,minrare,maxrare)[0]);
                        } else if (rand==2) {
                            list.push(genArmor(1,minrare,maxrare)[0]);
                        } else if (rand==3) {
                            list.push(genScroll(1,minrare,maxrare)[0]);
                        } else if (rand==4) {
                            list.push(genPotion(1,minrare,maxrare)[0])
                        } else if (rand==5) {
                            list.push(genMisc(1,minrare,maxrare)[0]);
                        } else if (rand==6) {
                            list.push(genMundane(1)[0]);
                        }
                    } else if (list==undefined) {
                        if (rand==1) {
                            list=genWeapon(1,minrare,maxrare);
                        } else if (rand==2) {
                            list=genArmor(1,minrare,maxrare);
                        } else if (rand==3) {
                            list=genScroll(1,minrare,maxrare);
                        } else if (rand==4) {
                            list=genPotion(1,minrare,maxrare);
                        } else if (rand==5) {
                            list=genMisc(1,minrare,maxrare);
                        } else if (rand==6) {
                            list=genMundane(1);
                        }
                    }
                }
            }
            store.inv=list;
            sendChat("Item Store","/w gm Generated new Inventory and overwrote the previous Inventory.");
        } else if (Boolean(overwrite)==false) {
            let list=store.inv;
            let seclist;
            type=type.toLowerCase();
            if (type.includes("weapon")) {
                seclist=genWeapon(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("armor")) {
                seclist=genArmor(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("scroll")) {
                seclist=genScroll(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("potion")) {
                seclist=genPotion(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("misc")) {
                seclist=genMisc(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("mund")) {
                seclist=genMundane(amount);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i]=seclist[j];
                            seclist.splice(j);
                            j--;
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("rand")) {
                for (let i=0;i<amount;i++) {
                    let rand=randomInteger(6);
                    if (list!==undefined) {
                        if (rand==1) {
                            seclist=genWeapon(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        } else if (rand==2) {
                            seclist=genArmor(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        } else if (rand==3) {
                            seclist=genScroll(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        } else if (rand==4) {
                            seclist=genPotion(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        } else if (rand==5) {
                            seclist=genMisc(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        } else if (rand==6) {
                            seclist=genMundane(1,minrare,maxrare);
                            for (let j=0;j<list.length;j++) {
                                if (list[j].name==seclist[0].name) {
                                    list[j].amount++;
                                    seclist.splice(0);
                                }
                            }
                            if (seclist[0]!==undefined) {
                                list.push(seclist[0])
                            }
                        }
                    } else if (list==undefined) {
                        if (rand==1) {
                            list=genWeapon(1,minrare,maxrare);
                        } else if (rand==2) {
                            list=genArmor(1,minrare,maxrare);
                        } else if (rand==3) {
                            list=genScroll(1,minrare,maxrare);
                        } else if (rand==4) {
                            list=genPotion(1,minrare,maxrare);
                        } else if (rand==5) {
                            list=genMisc(1,minrare,maxrare);
                        } else if (rand==6) {
                            list=genMundane(1);
                        }
                    }
                }
            }
            for (let i=0;i<list.length;i++) {
                store.inv.push(list[i]);
            }
            sendChat("Item Store","/w gm Generated new Items and added them to the Store.");
        }
    },

    genWeapon = function(amount,minrare,maxrare) {
        //Generate Weapons
        let items=[];
        let list=state.list.weapon;
        let rare=minrare+':'+maxrare;
        for (let i=0;i<amount;i++) {
            let pricechange;
            let namechange;
            let rand;
            let rarity;
            switch (rare) {
                case 'common:common':
                    pricechange=0;
                    rarity="common";
                break;
                case 'common:uncommon':
                    rand=randomInteger(2);
                    if (rand==1) {
                        pricechange=0;
                        namechange="";
                        rarity="common";
                    } else if (rand==2) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    }
                break;
                case 'common:rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        pricechange=0;
                        namechange="";
                        rarity="common";
                    } else if (rand==2) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==3) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    }
                break;
                case 'common:very rare':
                    rand=randomInteger(4);
                    if (rand==1) {
                        pricechange=0;
                        namechange="";
                        rarity="common";
                    } else if (rand==2) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==3) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==4) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    }
                break;
                case 'common:legendary':
                    rand=randomInteger(5);
                    if (rand==1) {
                        pricechange=0;
                        namechange="";
                        rarity="common";
                    } else if (rand==2) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==3) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==4) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    } else if (rand==5) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="legendary";
                    }
                break;
                case 'uncommon:uncommon':
                    pricechange=1000;
                    namechange="+1 ";
                    rarity="uncommon";
                break;
                case 'uncommon:rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==2) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    }
                break;
                case 'uncommon:very rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==2) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==3) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    }
                break;
                case 'uncommon:legendary':
                    rand=randomInteger(4);
                    if (rand==1) {
                        pricechange=1000;
                        namechange="+1 ";
                        rarity="uncommon";
                    } else if (rand==2) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==3) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    } else if (rand==4) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="legendary";
                    }
                break;
                case 'rare:rare':
                    pricechange=4000;
                    namechange="+2 ";
                    rarity="rare";
                break;
                case 'rare:very rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==2) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    }
                break;
                case 'rare:legendary':
                    rand=randomInteger(3);
                    if (rand==1) {
                        pricechange=4000;
                        namechange="+2 ";
                        rarity="rare";
                    } else if (rand==2) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="very rare";
                    } else if (rand==3) {
                        pricechange=16000;
                        namechange="+3 ";
                        rarity="legendary";
                    }
                break;
                case 'very rare:very rare':
                    pricechange=16000;
                    namechange="+3 ";
                    rarity="very rare";
                break;
                case 'very rare:legendary':
                    pricechange=16000;
                    namechange="+3 ";
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="very rare";
                    } else if (rand==2) {
                        rarity="legendary";
                    }
                break;
                case 'legendary:legendary':
                    pricechange=16000;
                    namechange="+3 ";
                    rarity="legendary";
                break;
            }
            rand=randomInteger(list.length);
            let price=pricechange+Math.trunc(list[rand-1].price);
            let name=namechange+list[rand-1].name;
            let mods=list[rand-1].mods
            let desc=list[rand-1].desc.split(';');
            if (namechange.includes("+1")) {
                mods+=", Attack +1, Damage +1";
                desc[1]="You have a +1 bonus to attack and damage rolls made with this magic weapon.";
            } else if (namechange.includes("+2")) {
                mods+=", Attack +2, Damage +2";
                desc[1]="You have a +2 bonus to attack and damage rolls made with this magic weapon.";
            } else if (namechange.includes("+3")) {
                mods+=", Attack +3, Damage +3";
                desc[1]="You have a +1 bonus to attack and damage rolls made with this magic weapon.";
            }
            desc[0]+=" ("+rarity+")";
            let found=false;
            for (let j=0;j<items.length;j++) {
                if (items[j].name==name) {
                    items[j].amount++;
                    found=true;
                } else {
                    found=false;
                }
            }
            if (found==false) {
                items.push({
                    name: name,
                    desc: desc[0]+";"+desc[1],
                    mods: mods,
                    props: list[i-1].props,
                    price: price,
                    weight: list[i-1].weight,
                    amount: 1
                });
            }
        }
        return items;
    },

    genArmor = function(amount,minrare,maxrare) {
        let items=[];
        let list=state.list.armor;
        let rare=minrare+':'+maxrare;
        for (let i=0;i<amount;i++) {
            let pricechange;
            let namechange;
            let rand;
            let rarity;
            rand=randomInteger(list.length);
            if (list[rand-1].name.includes("Shield")) {
                switch (rare) {
                    case 'common:common':
                        pricechange=0;
                        rarity="common";
                    break;
                    case 'common:uncommon':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        }
                    break;
                    case 'common:rare':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        }
                    break;
                    case 'common:very rare':
                        rand=randomInteger(4);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==4) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        }
                    break;
                    case 'common:legendary':
                        rand=randomInteger(5);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==4) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        } else if (rand==5) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'uncommon:uncommon':
                        pricechange=1500;
                        namechange="+1 ";
                        rarity="uncommon";
                    break;
                    case 'uncommon:rare':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        }
                    break;
                    case 'uncommon:very rare':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==3) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        }
                    break;
                    case 'uncommon:legendary':
                        rand=randomInteger(4);
                        if (rand==1) {
                            pricechange=1500;
                            namechange="+1 ";
                            rarity="uncommon";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==3) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        } else if (rand==4) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'rare:rare':
                        pricechange=6000;
                        namechange="+2 ";
                        rarity="rare";
                    break;
                    case 'rare:very rare':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==2) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        }
                    break;
                    case 'rare:legendary':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=6000;
                            namechange="+2 ";
                            rarity="rare";
                        } else if (rand==2) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="very rare";
                        } else if (rand==3) {
                            pricechange=24000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'very rare:very rare':
                        pricechange=24000;
                        namechange="+3 ";
                        rarity="very rare";
                    break;
                    case 'very rare:legendary':
                        pricechange=24000;
                        namechange="+3 ";
                        rand=randomInteger(2);
                        if (rand==1) {
                            rarity="very rare";
                        } else if (rand==2) {
                            rarity="legendary";
                        }
                    break;
                    case 'legendary:legendary':
                        pricechange=24000;
                        namechange="+3 ";
                        rarity="legendary";
                    break;
                }
            } else {
                switch (rare) {
                    case 'common:common':
                        pricechange=0;
                        rarity="common";
                    break;
                    case 'common:uncommon':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        }
                    break;
                    case 'common:rare':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        }
                    break;
                    case 'common:very rare':
                        rand=randomInteger(4);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==4) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        }
                    break;
                    case 'common:legendary':
                        rand=randomInteger(5);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==3) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==4) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        } else if (rand==5) {
                            pricechange=48000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'uncommon:uncommon':
                        pricechange=0;
                        namechange="";
                        rarity="common";
                    break;
                    case 'uncommon:rare':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        }
                    break;
                    case 'uncommon:very rare':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==3) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        }
                    break;
                    case 'uncommon:legendary':
                        rand=randomInteger(4);
                        if (rand==1) {
                            pricechange=0;
                            namechange="";
                            rarity="common";
                        } else if (rand==2) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==3) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        } else if (rand==4) {
                            pricechange=48000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'rare:rare':
                        pricechange=6000;
                        namechange="+1 ";
                        rarity="rare";
                    break;
                    case 'rare:very rare':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==2) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        }
                    break;
                    case 'rare:legendary':
                        rand=randomInteger(3);
                        if (rand==1) {
                            pricechange=6000;
                            namechange="+1 ";
                            rarity="rare";
                        } else if (rand==2) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        } else if (rand==3) {
                            pricechange=48000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'very rare:very rare':
                        pricechange=24000;
                        namechange="+2 ";
                        rarity="very rare";
                    break;
                    case 'very rare:legendary':
                        rand=randomInteger(2);
                        if (rand==1) {
                            pricechange=24000;
                            namechange="+2 ";
                            rarity="very rare";
                        } else if (rand==2) {
                            pricechange=48000;
                            namechange="+3 ";
                            rarity="legendary";
                        }
                    break;
                    case 'legendary:legendary':
                        pricechange=48000;
                        namechange="+3 ";
                        rarity="legendary";
                    break;
                }
            }
            rand=randomInteger(list.length);
            let price=pricechange+Math.trunc(list[rand-1].price);
            let name=namechange+list[rand-1].name;
            let mods=list[rand-1].mods
            let desc=list[rand-1].desc.split(';');
            if (name.includes("shield")) {
                if (namechange.includes("+1")) {
                    mods+=", AC +1";
                    desc[1]="While holding this shield, you have a +1 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                } else if (namechange.includes("+2")) {
                    mods+=", AC +2";
                    desc[1]="While holding this shield, you have a +2 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                } else if (namechange.includes("+3")) {
                    mods+=", AC +3";
                    desc[1]="While holding this shield, you have a +3 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                }
            } else {
                if (namechange.includes("+1")) {
                    mods+=", AC +1";
                    desc[1]="You have a +1 bonus to AC while wearing this armor.";
                } else if (namechange.includes("+2")) {
                    mods+=", AC +2";
                    desc[1]="You have a +2 bonus to AC while wearing this armor.";
                } else if (namechange.includes("+3")) {
                    mods+=", AC +3";
                    desc[1]="You have a +3 bonus to AC while wearing this armor.";
                }
            }
            desc[0]+=" ("+rarity+")";
            let found=false;
            for (let j=0;j<items.length;j++) {
                if (items[j].name==name) {
                    items[j].amount++;
                    found=true;
                } else {
                    found=false;
                }
            }
            if (found==false) {
                items.push({
                    name: name,
                    desc: desc[0]+";"+desc[1],
                    mods: mods,
                    props: list[i-1].props,
                    price: price,
                    weight: list[i-1].weight,
                    amount: 1
                });
            }
        }
        return items;
    },

    genScroll = function(amount,minrare,maxrare) {
        let items=[];
        let list=state.list.scroll;
        let rare=minrare+':'+maxrare;
        let level;
        switch (rare) {
            case 'common:common':
                level=randomInteger(2)-1;
            break;
            case 'common:uncommon':
                level=randomInteger(4)-1;
            break;
            case 'common:rare':
                level=randomInteger(6)-1;
            break;
            case 'common:very rare':
                level=randomInteger(9)-1;
            break;
            case 'common:legendary':
                rand=randomInteger(10)-1;
            break;
            case 'uncommon:uncommon':
                level=randomInteger(2)+1;
            break;
            case 'uncommon:rare':
                level=randomInteger(4)+1;
            break;
            case 'uncommon:very rare':
                level=randomInteger(7)+1;
            break;
            case 'uncommon:legendary':
                level=randomInteger(8)+1;
            break;
            case 'rare:rare':
                level=randomInteger(2)+3;
            break;
            case 'rare:very rare':
                level=randomInteger(5)+3;
            break;
            case 'rare:legendary':
                level=randomInteger(6)+3;
            break;
            case 'very rare:very rare':
                level=randomInteger(3)+5;
            break;
            case 'very rare:legendary':
                level=randomInteger(4)+5;
            break;
            case 'legendary:legendary':
                level=9;
            break;
        }
        let name;
        let price;
        let am;
        let sellam;
        if (level==0) {
            level="cantrip";
        }
        for (let i=0;i<list.length;i++) {
            if (list.name.includes(String(level))) {
                name=list[i].name;
                price=list[i].price;
                am=list[i].amount;
                sellam=list[i].sellam;
            }
        }
        for (let i=0;i<amount;i++) {
            if (items[i]==undefined) {
                let spell=rollSpell(level);
                spell[0].name=name+" ("+spell[0].name+")";
                spell[0].price=price;
                spell[0].amount=am;
                spell[0].sellam=sellam;
                items.push(spell[0]);
            } else {
                let spell=rollSpell(level);
                spell[0].name=name+" ("+spell[0].name+")";
                if (items[i].name==spell[0].name) {
                    items[i].amount++;
                    spell[0].price=price;
                    spell[0].sellam=sellam;
                } else {
                    spell[0].price=price;
                    spell[0].amount=am;
                    spell[0].sellam=sellam;
                    items.push(spell[0]);
                }
            }
        }
        return items;
    },

    rollSpell = function(level) {
        let spellList=state.list.spell;
        let spell=[];
        let list=[];
        let count=0;
        for (let i=0;i<spellList.length;i++) {
            if (spellList[i].level.includes(String(level))) {
                list[count]=spellList[i];
                count++;
            }
        }
        let rand=randomInteger(list.length);
        spell.push(list[rand-1]);
        return spell;
    },

    genPotion = function(amount,minrare,maxrare) {
        let items=[];
        let list=state.list.potion;
        let rare=minrare+':'+maxrare;
        let rarity;
        let rand;
        let potionList=[];
        let count=0;
        for (let i=0;i<amount;i++) {
            switch (rare) {
                case 'common:common':
                    rarity="common";
                break;
                case 'common:uncommon':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    }
                break;
                case 'common:rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    }
                break;
                case 'common:very rare':
                    rand=randomInteger(4);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    } else if (rand==4) {
                        rarity="very rare";
                    }
                break;
                case 'common:legendary':
                    rand=randomInteger(5);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    } else if (rand==4) {
                        rarity="very rare";
                    } else if (rand==5) {
                        rarity="legendary";
                    }
                break;
                case 'uncommon:uncommon':
                    rarity="uncommon";
                break;
                case 'uncommon:rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    }
                break;
                case 'uncommon:very rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    } else if (rand==3) {
                        rarity="very rare";
                    }
                break;
                case 'uncommon:legendary':
                    rand=randomInteger(4);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    } else if (rand==3) {
                        rarity="very rare";
                    } else if (rand==4) {
                        rarity="legendary";
                    }
                break;
                case 'rare:rare':
                    rarity="rare";
                break;
                case 'rare:very rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    }
                break;
                case 'rare:legendary':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    } else if (rand==3) {
                        rarity="legendary";
                    }
                break;
                case 'very rare:very rare':
                    rarity="very rare";
                break;
                case 'very rare:legendary':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="very rare";
                    } else if (rand==2) {
                        rarity="legendary";
                    }
                break;
                case 'legendary:legendary':
                    rarity="legendary";
                break;
            }
            for (let j=0;j<list.length;j++) {
                if (list[i].rarity==rarity) {
                    potionList[count]=list[i];
                    count++;
                }
            }
            rand=randomInteger(potionList.length);
            if (items[0]==undefined) {
                items.push(potionList[rand]);
            } else {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==potionList[rand-1].name) {
                        items[j].amount++;
                    }
                }
            }
        }
        return items;
    },

    genMisc = function(amount,minrare,maxrare) {
        let items;
        let list=state.list.misc;
        let rare=minrare+':'+maxrare;
        let miscList=[];
        let count=0;
        for (let i=0;i<amount;i++) {
            switch (rare) {
                case 'common:common':
                    rarity="common";
                break;
                case 'common:uncommon':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    }
                break;
                case 'common:rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    }
                break;
                case 'common:very rare':
                    rand=randomInteger(4);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    } else if (rand==4) {
                        rarity="very rare";
                    }
                break;
                case 'common:legendary':
                    rand=randomInteger(5);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    } else if (rand==4) {
                        rarity="very rare";
                    } else if (rand==5) {
                        rarity="legendary";
                    }
                break;
                case 'uncommon:uncommon':
                    rarity="uncommon";
                break;
                case 'uncommon:rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    }
                break;
                case 'uncommon:very rare':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    } else if (rand==3) {
                        rarity="very rare";
                    }
                break;
                case 'uncommon:legendary':
                    rand=randomInteger(4);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    } else if (rand==3) {
                        rarity="very rare";
                    } else if (rand==4) {
                        rarity="legendary";
                    }
                break;
                case 'rare:rare':
                    rarity="rare";
                break;
                case 'rare:very rare':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    }
                break;
                case 'rare:legendary':
                    rand=randomInteger(3);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    } else if (rand==3) {
                        rarity="legendary";
                    }
                break;
                case 'very rare:very rare':
                    rarity="very rare";
                break;
                case 'very rare:legendary':
                    rand=randomInteger(2);
                    if (rand==1) {
                        rarity="very rare";
                    } else if (rand==2) {
                        rarity="legendary";
                    }
                break;
                case 'legendary:legendary':
                    rarity="legendary";
                break;
            }
            for (let j=0;j<list.length;j++) {
                if (list[i].rarity==rarity) {
                    miscList[count]=list[i];
                    count++;
                }
            }
            rand=randomInteger(miscList.length);
            if (items[0]==undefined) {
                items.push(miscList[rand]);
            } else {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==miscList[rand-1].name) {
                        items[j].amount++;
                    }
                }
            }
        }
        return items;
    },

    genMundane = function(amount) {
        let items=[];
        let list=state.list.mundane;
        for (let i=0;i<amount;i++) {
            let rand=randomInteger(list.length);
            if (items[0]==undefined) {
                items.push(list[rand-1]);
            } else {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==list[rand-1].name) {
                        items[j].amount++;
                    }
                }
            }
        }
        return items;
    },

    checkRarity = function(minrare,maxrare) {
        minrare=minrare.toLowerCase();
        maxrare=maxrare.toLowerCase();
        let rarity=[];
        switch (minrare) {
            case 'uncommon':
                if (maxrare=="common") {
                    sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                } else {
                    rarity[0]=minrare;
                    rarity[1]=maxrare;
                    return rarity;
                }
            break;
            case 'rare':
                if (maxrare=="common" || maxrare=="uncommon") {
                    sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                } else {
                    rarity[0]=minrare;
                    rarity[1]=maxrare;
                    return rarity;
                }
            break;
            case 'very rare':
                if (maxrare=="common" || maxrare=="uncommon" || maxrare=="rare") {
                    sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                } else {
                    rarity[0]=minrare;
                    rarity[1]=maxrare;
                    return rarity;
                }
            break;
            case 'legendary':
                if (maxrare!=="legendary") {
                    sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                } else {
                    rarity[0]=minrare;
                    rarity[1]=maxrare;
                    return rarity;
                }
            break;
        }
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
        store=state.store.find(s => s.name==store);
        let num;
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                num=i;
            }
        }
        switch (attr) {
            case 'name':
                sendChat("Item Store","/w gm Changed Name of Store #"+num+"<br><b>Old:</b> "+store.name+"<br><b>New:</b> "+val);
                state.store[num].name=val;
            break;
            case 'hdc':
                sendChat("Item Store","/w gm Changed Haggle DC of Store #"+num+"<br><b>Old:</b> "+store.hdc+"<br><b>New:</b> "+val);
                state.store[num].hdc=Number(val);
            break;
            case 'cprice':
                sendChat("Item Store","/w gm Changed Price Change % of Store #"+num+"<br><b>Old:</b> "+store.cprice+"<br><b>New:</b> "+val);
                state.store[num].cprice=Number(val);
            break;
            case 'active':
                if (val=="true" || val==true) {
                    sendChat("Item Store","/w gm Activated Store #"+num);
                } else if (val=="false" || val==false) {
                    sendChat("Item Store","/w gm Deactivated Store #"+num);
                }
                state.store[num].active=Boolean(val);
            break;
        }
    },

    showStore = function(store) {
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
        store=state.store.find(s => s.name==store);
        let inv=store.inv;
        let invList="";
        let itemList=[]
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
        sendChat("Item Store","<div " + divstyle + ">" + //--
            '<div ' + headstyle + '>Item Store</div>' + //--
            '<div ' + substyle + '>Player View</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table ' + tablestyle + '>' + //--
            '<tr><td style="text-align:left;">Current Store: </td><td style="text-align:center;">' + store.name + '</td></tr>' + //--
            '</table>' + //--
            '<br><div style="text-align:center;"><b>Inventory</b></div><br>' + //--
            '<table ' + tablestyle + '>' + //--
            '<thead><tr style="border-top: 1px solid #cccccc;"><th style="border-right: 1px solid #cccccc; border-left: 1px solid #cccccc;">Pos.</th><th style="border-right: 1px solid #cccccc; text-align:center;">Amount</th><th style="border-right: 1px solid #cccccc; text-align:center;">Item Name</th><th style="border-right: 1px solid #cccccc; text-align:center;">Description</th><th style="border-right: 1px solid #cccccc; text-align:center;">Price (GP)</th></tr></thead>' + //--
            '<tbody>' + invList + '</tbody>' + //--
            '</table>' + //--
            '<br><br>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!shop --store ' + store.name + '">Shop Menu</a></div>' + //--
            '</div>'
        );
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

    purchaseMenu = function(store,item,amount,charident,msg) {
        //Pull up the Purchasing Menu
        var divstyle = 'style="width: 260px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var astyle3 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 80px;';
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        var trstyle = 'style="border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; border-bottom: 1px solid #cccccc;"><td style="text-align:center;"';
        var tdstyle = 'style="text-align: right;"';
        let invList="";
        if (amount==undefined) {
            amount=1;
        }
        store=state.store.find(s => s.name==store);
        item=store.inv.find(i => i.name==item);
        let storeList=[];
        let count=0;
        let itemList=[];
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].active==true) {
                storeList[count]=state.store[i].name;
                count++;
            }
        }
        for (let i=0;i<store.inv.length;i++) {
            itemList[i]=store.inv[i].name;
        }
        if (charident.includes("charid")) {
            charident=charident.replace("charid ","");
            let char=findObjs({
                _type: 'character',
                _id: charident
            }, {caseInsensitive: true})[0];
            let desc=item.desc.split(';');
            if (amount!==undefined && amount!=="" && amount!==" ") {
                if (Number(amount)>item.amount) {
                    sendChat("Item Store","/w "+msg.who+" The Store does not have the selected Amount in Stock, try a lower number.");
                } else {
                    sendChat("Item Store","/w "+msg.who+" <div " + divstyle + '>' + //--
                        '<div ' + headstyle + '>Purchase Menu</div>' + //--
                        '<div ' + substyle + '></div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<tr><td>Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ?{Store?|' + storeList + '} --charid ' + char.get('_id') + ' --buy ?{Item?|Insert Item Name}">' + store.name + '</a></td></tr>' + //--
                        '</table>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<tr><td>Amount: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ' + store.name + ' --charid ' + char.get('_id') + ' --buy ' + item.name + ' --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                        '<br><div style="text-align:center;"><b>Item</b></div>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<thead><tr style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; text-align:center;"><td><b>Item</b></td></tr></thead>' + //--
                        '<tbody><tr style="border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; border-bottom: 1px solid #cccccc;"><td style="text-align:center;"><b>Name</b></td><td style="text-align:center;">' + item.name + '</td></tr>' + //--
                        '<tr' + trstyle + '><td style="text-align:center;"><b>Description</b></td><td style="text-align:left;">' + desc[0] + '<br><br>' + desc[1] + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Modifiers</b></td><td style="text-align:center;">' + item.mods + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Properties</b></td><td style="text-align:center;">' + item.props + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Price</b></td><td style="text-align:center;">' + Number(item.price+(item.price*shop.cprice)) + ' GP</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Weight</b></td><td style="text-align:center;">' + item.weight + ' lbs</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Amount (in stock)</b></td><td style="text-align:center;">' + item.amount + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Bundle amount</b></td><td style="text-align:center;">' + item.sellam + '</td></tr>' + //--
                        '</tbody>' + //--
                        '</table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!checkout --store ' + store.name + ' --item ' + item.name + ' --amount ' + amount + '">Confirm Purchase</a></div>' + //--
                        '</div>'
                    );
                }
            }
        } else if (charident.includes("char")) {
            charident=charident.replace("char ","");
            let char=findObjs({
                _type: 'character',
                name: charident
            }, {caseInsensitive: true})[0];
            let desc=item.desc.split(';');
            if (amount!==undefined && amount!=="" && amount!==" ") {
                if (Number(amount)>item.amount) {
                    sendChat("Item Store","/w "+msg.who+" The Store does not have the selected Amount in Stock, try a lower number.");
                } else {
                    sendChat("Item Store","/w "+msg.who+" <div " + divstyle + '>' + //--
                        '<div ' + headstyle + '>Purchase Menu</div>' + //--
                        '<div ' + substyle + '></div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<tr><td>Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ?{Store?|' + storeList + '} --charid ' + char.get('_id') + ' --buy ?{Item?|Insert Item Name}">' + store.name + '</a></td></tr>' + //--
                        '</table>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<tr><td>Amount: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ' + store.name + ' --charid ' + char.get('_id') + ' --buy ' + item.name + ' --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                        '<br><div style="text-align:center;"><b>Item</b></div>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<thead><tr style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; text-align:center;"><td><b>Item</b></td></tr></thead>' + //--
                        '<tbody><tr style="border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; border-bottom: 1px solid #cccccc;"><td style="text-align:center;"><b>Name</b></td><td style="text-align:center;">' + item.name + '</td></tr>' + //--
                        '<tr' + trstyle + '><td style="text-align:center;"><b>Description</b></td><td style="text-align:left;">' + desc[0] + '<br><br>' + desc[1] + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Modifiers</b></td><td style="text-align:center;">' + item.mods + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Properties</b></td><td style="text-align:center;">' + item.props + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Price</b></td><td style="text-align:center;">' + Number(amount*(item.price+(item.price*shop.cprice))) + ' GP</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Weight</b></td><td style="text-align:center;">' + Number(amount*item.weight) + ' lbs</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Amount (in stock)</b></td><td style="text-align:center;">' + item.amount + '</td></tr>' + //--
                        '<tr ' + trstyle + '><td style="text-align:center;"><b>Bundle amount</b></td><td style="text-align:center;">' + item.sellam + '</td></tr>' + //--
                        '</tbody>' + //--
                        '</table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!checkout --store ' + store.name + ' --item ' + item.name + ' --amount ' + amount + '">Confirm Purchase</a></div>' + //--
                        '</div>'
                    );
                }
            }
        }
    },

    addToCart = function(cart,store,item,amount,msg) {
        //Add Items to a Shopping Cart
        cart=state.cart.find(c => c.name==cart);
        let cnum;
        for (let i=0;i<state.cart.length;i++) {
            if (state.cart[i].id==msg.playerid) {
                if (state.cart[i].name==cart) {
                    cnum=i;
                }
            }
        }
        store=state.store.find(s => s.name==store);
        item=store.inv.find(i => i.name==item);
        let content=cart.content;
        let len;
        if (content.length==undefined) {
            len=0;
        } else if (content.length>=0) {
            len=content.length;
        }
        cart.content[len]={
            name: item.name,
            desc: item.desc,
            mods: item.mods,
            props: item.props,
            price: item.price*amount,
            weight: item.weight*amount,
            amount: amount,
            sellam: item.sellam,
            shop: store.name
        };
        sendChat("Item Store","/w "+msg.who+" Added \""+item.name+"\" to your Cart \""+cart.name+"\"!");
        state.cart[cnum].content=cart.content;
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
    
    purchase = function(type,cart,amount,store,charident,msg) {
        //Purchase either individual Item or a bunch of Items from a cart.
        let char;
        amount=Number(amount);
        if (charident.includes("charid")) {
            char=findObjs({
                _type: 'character',
                _id: charident
            }, {caseInsensitive: true})[0];
        } else if (charident.includes("char")) {
            char=findObjs({
                _type: 'character',
                name: charident
            }, {caseInsensitive: true})[0];
        }
        switch (type) {
            case 'cart':
                cart=state.cart.find(c => c.name==cart);
                let num;
                for (let i=0;i<state.cart.length;i++) {
                    if (state.cart[i].id==msg.playerid) {
                        num=i;
                    }
                }
                let inv=cart.content;
                for (let i=0;i<inv.length;i++) {
                    let gold=findObjs({
                        _type: 'attribute',
                        _characterid: char.get('_id'),
                        name: "gp"
                    }, {caseInsensitive: true});
                    let cur=gold.get('current');
                    amount=inv[i].amount;
                    store=inv[i].shop;
                    store=state.store.find(s => s.name==store);
                    let item=store.inv.find(it => it.name==inv[i].name);
                    let pos;
                    for (let j=0;j<state.store.length;j++) {
                        if (state.store[j].name==store.name) {
                            pos=j;
                        }
                    }
                    let pos2;
                    for (let j=0;j<store.inv.length;j++) {
                        if (store.inv[j].name==inv[i].name) {
                            pos2=j;
                        }
                    }
                    let price=amount*(inv[i].price+Number(inv[i].price*shop.cprice));
                    if (cur<price) {
                        sendChat("Item Store","/w "+msg.who+" You don\'t have enough money to buy "+inv[i].name);
                    } else if (cur>=price) {
                        cur-=price;
                        if (amount==item.amount) {
                            removeItem(store.name,item.name);
                        } else if (amount<item.amount) {
                            store.inv[pos2].amount-=amount;
                            state.store[j].inv=store.inv;
                        }
                        gold.set('current',cur);
                        let desc=item.desc.split(';')
                        sendChat("Item Store","!setattr --charid "+char.get('_id')+" --repeating_inventory_-CREATE_itemname|"+item.name+' --repeating_inventory_-CREATE_itemcount|'+amount+' --repeating_inventory_-CREATE_itemcontent|'+desc[0]+'<br><br>'+desc[1]+' --repeating_inventory_-CREATE_itemmodifiers|'+item.mods+' --repeating_inventory_-CREATE_itemproperties|'+item.props+' --repeating_inventory_-CREATE_itemweight|'+item.weight);
                        store.inv[pos2].amount-=Number(amount);
                        if (store.inv[pos2].amount<=0) {
                            store.inv.splice(pos2);
                        }
                        state.store[pos]=store;
                    }
                }
            return;
            case 'item':
                let pos;
                let pos2;
                for (let i=0;i<state.store.length;i++) {
                    if (state.store[i].name==store) {
                        pos=i;
                    }
                }
                store=state.store.find(s => s.name==store);
                let item=store.inv.find(i => i.name==cart);
                for (let i=0;i<store.inv.length;i++) {
                    if (store.inv[i].name==cart) {
                        pos2=i;
                    }
                }
                let gold=findObjs({
                    _type: 'attribute',
                    _characterid: char.get('_id'),
                    name: 'gp'
                }, {caseInsensitive: true});
                let cur=gold.get('current');
                let price=amount*(inv[i].price+Number(inv[i].price*shop.cprice));
                if (Number(amount)>item.amount) {
                    sendChat("Item Store","/w "+msg.who+" The Store does not have enough of that Item in stock, please try a lower number");
                } else if (Number(amount)==item.amount) {
                    if (cur<price) {
                        sendChat("Item Store","/w "+msg.who+" You don't have enough money. You need "+Number(price-cur)+" GP more to be able to buy this.");
                    } else if (cur>=price) {
                        cur-=price;
                        gold.set("current",cur);
                        let desc=item.desc.split(';');
                        sendChat("Item Store","!setattr --charid "+char.get('_id')+" --repeating_inventory_-CREATE_itemname|"+item.name+" --repeating_inventory_-CREATE_itemcount|"+amount+" --repeating_inventory_-CREATE_itemcontent|"+desc[0]+"%NEWLINE%%NEWLINE%"+desc[1]+" --repeating_inventory_-CREATE_itemmodifiers|"+item.mods+' --repeating_inventory_-CREATE_itemproperties|'+item.props+' --repeating_inventory_-CREATE_itemweight|'+item.weight);
                        store.inv[pos2].amount-=Number(amount);
                        if (store.inv[pos2].amount<=0) {
                            store.inv.splice(pos2);
                        }
                        state.store[pos]=store;
                    }
                }
            break;
        }
    },

    haggleMenu = function(store,item,amount,skill,charident,msg) {
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
        store=state.store.find(s => s.name==store);
        let shopList=[];
        let count=0;
        let invList=store.inv;
        let itemList=[];
        item=invList.find(i => i.name==item);
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].active==true) {
                shopList[count]=state.store[i].name;
                count++;
            }
        }
        for (let i=0;i<invList.length;i++) {
            itemList[i]=invList[i].name;
        }
        let len=invList.length;
        for (let i=0;i<len;i++) {
            itemList=String(itemList).replace(",","|");
        }
        for (let i=0;i<count;i++) {
            shopList=String(shopList).replace(",","|");
        }
        if (amount==undefined) {
            amount=0;
        }
        if (skill==undefined) {
            skill="";
        }
        let char;
        if (charident.includes("charid")) {
            char=findObjs({
                _type: 'character',
                _id: charident
            }, {caseInsensitive: true})[0];
        } else if (charident.includes("char")) {
            char=findObjs({
                _type: 'character',
                name: charident
            }, {caseInsensitive: true})[0];
        }
        let desc=item.desc.split(';');
        sendChat("Item Store","/w "+msg.who+" <div " + divstyle + ">" + //--
            '<div ' + headstyle + '>Haggle Menu</div>' + //--
            '<div ' + substyle + '>' + store.name + '</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table ' + tablestyle + '>' + //--
            '<tr><td>Store: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ?{Store?|' + shopList + '} --charid ' + char.get("_id") + ' --haggle --amount ' + amount + ' --skill ' + skill + '">' + shop.name + '</a></td></tr>' + //--
            '</table>' + //--
            '<br><br>' + //--
            '<table ' + tablestyle + '>' + //--
            '<tr style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc;"><th style="border-left: 1px solid #cccccc; border-right: 1px solid #cccccc;">Item Name</th><th style="border-right: 1px solid #cccccc;">Description</th><th>Price (GP)</th></tr>' + //--
            '<tr style="border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; border-right: 1px solid #cccccc;"><td style="border-right: 1px solid #cccccc;">' + item.name + '</td><td style="border-right: 1px solid #cccccc;">' + desc[0] + '</td><td>' + Number(item.price+item.price*store.cprice) + '</td></tr>' + //--
            '</table>' + //--
            '<br><br>' + //--
            '<table ' + tablestyle + '>' + //--
            '<tr><td>Haggle DC: </td><td ' + tdstyle + '>' + store.hdc + '</td></tr>' + //--
            '<tr><td>Discount Amount: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ' + store.name + ' --charid ' + char.get('_id') + ' --haggle --amount ?{Amount?|1} --skill ' + skill + '">' + amount + '</a></td></tr>' + //--
            '<tr><td>Skill: </td><td ' + tdstyle + '><a ' + astyle1 + '" href="!shop --store ' + store.name + ' --charid ' + char.get('_id') + ' --haggle --amount ' + amount + ' --skill ?{Skill?|Intimidation|Persuasion}">' + skill + '</a></td></tr>' + //--
            '</table>' + //--
            '<br><br>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!haggle --store ' + store.name + ' --item ' + item.name + ' --charid ' + char.get('_id') + ' --amount ' + amount + ' --skill ' + skill + '">Attempt Haggle</a></div>' + //-- 
            '</div>'
        );
    },

    haggle = function(store,item,charident,amount,skill,msg) {
        //Negotiate Price based on Skillchecks
        store=state.store.find(s => s.name==store);
        item=store.inv.find(i => i.name==item);
        amount=Number(amount);
        let char;
        if (charident.includes("charid")) {
            char=findObjs({
                _type: 'character',
                _id: charident
            }, {caseInsensitive: true})[0];
        } else if (charident.includes("char")) {
            char=findObjs({
                _type: 'character',
                name: charident
            }, {caseInsensitive: true})[0];
        }
        if (char!==undefined) {
            let price=Number(item.price);
            let sbonus=findObjs({
                _type: 'attribute',
                _characterid: char.get('_id'),
                name: skill+"_bonus"
            }, {caseInesnsitive: true})[0];
            sbonus=sbonus.get('current');
            let rand=randomInteger(20)+Number(sbonus);
            if (rand>=store.hdc) {
                price-=amount;
            }
            for (let i=0;i<store.inv.length;i++) {
                if (store.inv[i].name==item.name) {
                    store.inv[i].price=price;
                }
            }
            for (let i=0;i<state.store.length;i++) {
                if (state.store[i].name==store.name) {
                    state.store[i]=store;
                }
            }
        }
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