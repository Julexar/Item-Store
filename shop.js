/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)
API Commands:
GM ONLY
!store - Pulls up the Menu and allows the GM to create and modify Stores
    --reset - Resets all stores
    --create --name {Insert Name} - Allows the GM to create a new Store.
    --store {Insert existing Store name/number} - Shows the GM all Information about a certain Store.
        --inv view/edit/generate/reset - Allows the GM to edit, generate or reset the Inventory of the selected Store or view a specific item.
            Edit & View Only
            --item {Insert Item name/number} - Select a specific Item that you wish to edit/view.
                Edit Only
                --del - Deletes the selected Item
            --new - Adds a new Item
                    --name {Insert new Name} - Set the Name of an Item
                    --desc {Insert new Description} - Set the Description of an Item (Check the Wiki to see how a Description is structured)
                    --mods {Insert new Modifiers} - Set the Modifiers of an Item. (Check the Wiki to see how Modifiers work)
                    --props {Insert new Properties} - Set the Properties of an Item. (E.g. Light, Heavy, Two-Handed, etc.)
                    --price {Insert new Price} - Set the Price (GP) of an Item. (Must be 0 or above)
                    --amount {Insert new Amount} - Set the Amount of Items present in the store (Must be at least 1 and a whole number - no fractions!)
                    --weight {Insert new Weight} - Set the Weight of the Item
                    --sellam {Insert new Bundle size} - Set the Bundle size of the item (Must be at least 1 and a whole number - no fractions!)
                        --confirm - Confirm and apply the Changes.
            Generate Only
            --type {Insert Item Type} --amount {Insert Number of Items} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity} - Generate a random Inventory based on Item Type and Rarity. (For a list of available Types and Rarities, check the Wiki)
                --overwrite true/false - Select whether you wish you to Overwrite an already existing Inventory. (Put true if so, put false if not) Default: true
        --show - Add this Option if you want to show the selected Store to the Players.
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
        --sel - selects a Character based on the token
        Hint: If you don't use an option, you need to issue the command while speaking as the Character.
            --buy {Insert Item name} - Pulls up the Purchasing menu
                --amount {Insert amount} - increases the amount of Items you buy (Default: 1)
            --haggle - Pulls up the Haggling menu
                --item {Insert Item Name} - Select the Item you wish to haggle for.
                    --char {Insert Character Name} - Select the Character you want to use
                    --charid {Insert Character ID} - "
                        --amount - sets the amount you want to haggle for
                            --skill {Insert Skill} - sets the skill used in haggling (Persuasion or Intimidation)
!cart - Pulls up the Shopping Cart Menu.
    --reset - Resets all Carts.
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
    
    var version = "2.0",
    
    setDefaults = function() {
        state.store = [];
    },
    
    setBasics = function() {
        state.basics = {
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
            },
            setup: false,
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
                    mods: "Item Type: Scroll",
                    desc: "Scroll (common);",
                    props: "",
                    rarity: "common",
                    price: 10,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "1st-Level Scroll",
                    mods: "Item Type: Scroll",
                    desc: "Scroll (common);",
                    props: "",
                    rarity: "common",
                    price: 60,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "2nd-Level Scroll",
                    desc: "Scroll (uncommon);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "uncommon",
                    price: 120,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "3rd-Level Scroll",
                    desc: "Scroll (uncommon);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "uncommon",
                    price: 250,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "4th-Level Scroll",
                    desc: "Scroll (rare);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "rare",
                    price: 520,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "5th-Level Scroll",
                    desc: "Scroll (rare);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "rare",
                    price: 850,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "6th-Level Scroll",
                    desc: "Scroll (very rare);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "very rare",
                    price: 1500,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "7th-Level Scroll",
                    desc: "Scroll (very rare);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "very rare",
                    price: 2550,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "8th-Level Scroll",
                    desc: "Scroll (very rare);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "very rare",
                    price: 5250,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                },
                {
                    name: "9th-Level Scroll",
                    desc: "Scroll (legendary);",
                    mods: "Item Type: Scroll",
                    props: "",
                    rarity: "legendary",
                    price: 10250,
                    weight: 0,
                    amount: 1,
                    sellam: 1
                }
            ],
            spell: [
                {
                    level: 0,
                    list: ["Acid Splash","Blade Ward","Booming Blade","Chill Touch","Control Flames","Create Bonfire","Dancing Lights","Druidcraft","Eldritch Blast","Fire Bolt","Friends","Frostbite","Green-Flame Blade","Guidance","Gust","Infestation","Light","Lightning Lure","Mage Hand","Magic Stone","Mending","Message","Minor Illusion","Mold Earth","Poison Spray","Prestidigitation","Primal Savagery","Produce Flame","Ray of Frost","Resistance","Sacred Flame","Shape Water","Shillelagh","Shocking Grasp","Spare the Dying","Sword Burst","Thaumaturgy","Thorn Whip","Thunderclap","Toll the Dead","True Strike","Vicious Mockery","Word of Radiance"]
                },
                {
                    level: 1,
                    list: ["Absorb Elements","Alarm","Animal Friendship","Armor of Agathys","Arms of Hadar","Bane","Beast Bond","Bless","Burning Hands","Catapult","Cause Fear","Ceremony","Chaos Bolt","Charm Person","Chromatic Orb","Color Spray","Command","Compelled Duel","Comprehend Languages","Create or Destroy Water","Cure Wounds","Detect Evil and Good","Detect Magic","Detect Poison and Disease","Disguise Self","Dissonant Whispers","Divine Favor","Earth Tremor","Ensnaring Strike","Entangle","Expeditious Retreat","Faerie Fire","False Life","Feather Fall","Find Familiar","Fog Cloud","Goodberry","Grease","Guiding Bolt","Hail of Thorns","Healing Word","Hellish Rebuke","Heroism","Hex","Hunter\'s Mark","Ice Knife","Identify","Illusory Script","Inflict Wounds","Jump","Longstrider","Mage Armor","Magic Missile","Protection from Evil and Good","Purify Food and Drink","Ray of Sickness","Sanctuary","Searing Smite","Shield","Shield of Faith","Silent Image","Sleep","Snare","Speak with Animals","Tasha\'s Hideous Laughter","Tenser\'s Floating Disk","Thunderous Smite","Thunderwave","Unseen Servant","Witch Bolt","Wrathful Smite","Zephyr Strike"]
                },
                {
                    level: 2,
                    list: ["Aganazzar\'s Scorcher","Aid","Alter Self","Animal Messenger","Arcane Lock","Augury","Barkskin","Beast Sense","Blindness/Deafness","Blur","Branding Smite","Calm Emotions","Cloud of Daggers","Continual Flame","Cordon of Arrows","Crown of Madness","Darkness","Darkvision","Detect Thoughts","Dragon's Breath","Dust Devil","Earthbind","Enhance Ability","Enlarge/Reduce","Enthrall","Find Steed","Find Traps","Flame Blade","Flaming Sphere","Gentle Repose","Gust of Wind","Healing Spirit","Heat Metal","Hold Person","Invisibility","Knock","Lesser Restoration","Levitate","Locate Animals or Plants","Locate Object","Magic Mouth","Magic Weapon","Maximilian\'s Earthen Grasp","Melf\'s Acid Arrow","Mind Spike","Mirror Image","Misty Step","Moonbeam","Nystul\'s Magic Aura","Pass Without Trace","Phantasmal Force","Prayer of Healing","Protection from Poison","Pyrotechnics","Ray of Enfeeblement","Rope Trick","Scorching Ray","See invisibility","Shadow Blade","Shatter","Silence","Skywrite","Snilloc\'s Snowball Swarm","Spider Climb","Spike Growth","Spiritual Weapon","Suggestion","Warding Bond","Warding Wind","Web","Zone of Truth"]
                },
                {
                    level: 3,
                    list: ["Animate Dead","Aura of Vitality","Beacon of Hope","Bestow Curse","Blinding Smite","Blink","Call Lightning","Catnap","Clairvoyance","Conjure Animals","Conjure Barrage","Counterspell","Create Food and Water","Crusader\'s Mantle","Daylight","Dispel Magic","Elemental Weapon","Erupting Earth","Fear","Feign Death","Fireball","Flame Arrows","Fly","Gaseous Form","Glyph of Warding","Haste","Hunger of Hadar","Hypnotic Pattern","Leomund\'s Tiny Hut","Lightning Arrow","Lightning Bolt","Magic Circle","Major Image","Mass Healing Word","Meld into Stone","Melf\'s Minute Meteors","Nondetection","Phantom Steed","Plant Growth","Protection from Energy","Remove Curse","Revivify","Sending","Sleet Storm","Slow","Speak with Dead","Speak with Plants","Spirit Guardians","Stinking Cloud","Tidal Wave","Tongues","Vampiric Touch","Wall of Sand","Wall of Water","Water Breathing","Water Walk","Wind Wall","Enemies abound","Life Transference","Summon Lesser Demons","Thunder Step","Tiny Servant"]
                },
                {
                    level: 4,
                    list: ["Arcane Eye","Aura of Life","Aura of Purity","Banishment","Blight","Compulsion","Confusion","Conjure Minor Elementals","Conjure Woodland Beings","Control Water","Death Ward","Dimension Door","Divination","Dominate Beast","Elemental Bane","Evard\'s Black Tentacles","Fabricate","Fire Shield","Freedom of Movement","Giant Insect","Grasping Vine","Greater Invisibility","Guardian of Faith","Hallucinatory Terrain","Ice Storm","Leomund\'s Secret Chest","Locate Creature","Mordenkainen\'s Faithful Hound","Mordenkainen\'s Private Sanctum","Otiluke\'s Resilient Sphere","Phantasmal Killer","Polymorph","Staggering Smite","Stone Shape","Stoneskin","Storm Sphere","Vitriolic Sphere","Wall of Fire","Watery Sphere","Charm Monster","Find Greater Steed","Guardian of Nature","Shadow of Moil","Sickening Radiance","Summon Greater Demon"]
                },
                {
                    level: 5,
                    list: ["Animate Objects","Antilife Shell","Awaken","Banishing Smite","Bigby\'s Hand","Circle of Power","Cloudkill","Commune","Commune with Nature","Cone of Cold","Conjure Elemental","Conjure Volley","Contact Other Plane","Contagion","Control Winds","Creation","Destructive Wave","Dispel Evil and Good","Dominate Person","Dream","Flame Strike","Geas","Greater Restoration","Hallow","Hold Monster","Immolation","Insect Plague","Legend Lore","Maelstrom","Mass Cure Wounds","Mislead","Modify Memory","Passwall","Planar Binding","Raise Dead","Rary\'s Telepathic Bond","Reincarnate","Scrying","Seeming","Swift Quiver","Telekinesis","Teleportation Circle","Transmute Rock","Tree Stride","Wall of Force","Wall of Stone","Danse Macabre","Dawn","Druid Grove","Enervation","Far Step","Holy Weapon","Infernal Calling","Negative Energy Flood","Skill Empowerment","Steel Wind Strike","Synaptic Static","Wall of Light","Wrath of Nature"]
                },
                {
                    level: 6,
                    list: ["Arcane Gate","Blade Barrier","Bones of the Earth","Chain Lightning","Circle of Death","Conjure Fey","Contingency","Create Undead","Disintegrate","Drawmij\'s Instant Summons","Eyebite","Find the Path","Flesh to Stone","Forbiddance","Globe of Invulnerability","Guards and Wards","Harm","Heal","Heroes\' Feast","Investiture of Flame","Investiture of Ice","Investiture of Stone","Investiture of Wind","Magic Jar","Mass Suggestion","Move Earth","Otiluke\'s Freezing Sphere","Otto\'s Irresistible Dance","Planar Ally","Primordial Ward","Programmed Illusion","Sunbeam","Transport via Plants","True Seeing","Wall of Ice","Wall of Thorns","Wind Walk","Word of Recall","Create Homunculus","Mental Prison","Primordial Ward","Scatter","Soul Cage","Tenser\'s Transformation"]
                },
                {
                    level: 7,
                    list: ["Conjure Celestial","Delayed Blast Fireball","Divine Word","Etherealness","Finger of Death","Fire Storm","Forcecage","Mirage Arcane","Mordenkainen\'s Magnificent Mansion","Mordenkainen\'s Sword","Plane Shift","Prismatic Spray","Project Image","Regenerate","Resurrection","Reverse Gravity","Sequester","Simulacrum","Symbol","Teleport","Whirlwind","Crown of Stars","Power Word Pain","Temple of the Gods"]
                },
                {
                    level: 8,
                    list: ["Abi-Dalzim\'s Horrid Wilting","Animal Shapes","Antimagic Field","Antipathy/Sympathy","Clone","Control Weather","Demiplane","Dominate Monster","Earthquake","Feeblemind","Glibness","Holy Aura","Incendiary Cloud","Maze","Mind Blank","Power Word Stun","Sunburst","Telepathy","Trap the Soul","Tsunami","Illusory Dragon","Maddening Darkness","Mighty Fortress"]
                },
                {
                    level: 9,
                    list: ["Astral Projection","Foresight","Gate","Imprisonment","Mass Heal","Meteor Swarm","Power Word Heal","Power Word Kill","Prismatic Wall","Shapechange","Storm of Vengeance","Time Stop","True Polymorph","True Resurrection","Weird","Wish","Invulnerability","Mass Polymorph","Psychic Scream"]
                }
            ]
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
                    if (!args[1]) {
                        storeMenu(args[1]);
                    } else if (args[1]=="create") {
                        let store = args[1].replace("create ","");
                        if (store!="" && store!=" ") {
                            createStore(store);
                        }
                    } else if (args[1]=="reset") {
                        let store = args[1].replace("reset ","");
                        resetStore(store);
                    } else if (args[1].includes("store")) {
                        let store=args[1].replace("store ","");
                        if (store=="" || store==" ") {
                            sendChat("Item Store","/w gm Invalid Store!");
                        } else {
                            if (!args[2]) {
                                storeMenu(store);
                            } else if (args[2].includes("inv")) {
                                let option=args[2].replace("inv ","");
                                option=option.toLowerCase();
                                if (option!=="view" && option!=="edit" && (option!=="generate" || option!=="gen") && option!=="reset") {
                                    sendChat("Item Store",`/w gm Invalid Option, please select one of the following Options:\n- !store --store ${store} --inv view\n- !store --store ${store} --inv edit\n- !store --store ${store} --inv generate --type {Insert Type} --amount {Insert Amount} --minrare {Insert minimum Rarity} --maxrare {Insert maximum Rarity}\n- !store --store ${store} --inv reset`);
                                } else if (option=="view") {
                                    if (!args[3]) {
                                        itemMenu(store,args[3]);
                                    } else if (args[3].includes("item")) {
                                        let item = args[3].replace("item ","");
                                        if (item=="" || item==" ") {
                                            sendChat("Item Store","/w gm Invalid Item!");
                                        } else {
                                            itemMenu(store,item);
                                        }
                                    }
                                } else if (option=="edit") {
                                    if (!args[3]) {
                                        sendChat("Item Store","/w gm You need to specify an Item to edit!");
                                    } else if (args[3].includes("item")) {
                                        let item = args[3].replace("item ","");
                                        if (item=="" || item==" ") {
                                            sendChat("Item Store","/w gm Invalid Item!");
                                        } else {
                                            if (!args[4]) {
                                                editMenu(store,item);
                                            } else if (args[4]!="del") {
                                                let name,desc,mods,props,price,amount,weight,sellam;
                                                let num;
                                                for (let i=4;i<args.length-1;i++) {
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
                                                    } else if (args[i].includes("amount")) {
                                                        amount=Number(args[i].replace("amount ",""));
                                                    } else if (args[i].includes("weight")) {
                                                        weight=Number(args[i].replace("weight ",""));
                                                    } else if (args[i].includes("sellam")) {
                                                        sellam=Number(args[i].replace("sellam ",""));
                                                    }
                                                    num=i;
                                                }
                                                if (!args[num+1]) {
                                                    editMenu(store,item,name,desc,mods,props,price,weight,amount,sellam);
                                                } else if (args[num+1]=="confirm") {
                                                    state.basics.setup=false;
                                                    editItem(store,name,desc,mods,props,price,weight,amount,sellam);
                                                }
                                            } else if (args[4]=="del") {
                                                removeItem(store,item);
                                                itemMenu(store,undefined);
                                            }
                                        }
                                    } else if (args[3].includes("new")) {
                                        let item = args[3].replace("new ","");
                                        addItem(store,item);
                                        editMenu(store,"none",item);
                                    }
                                } else if (option=="generate" || option=="gen") {
                                    if (!args[3]) {
                                        sendChat("Item Store","/w gm You need to define a type!");
                                    } else if (args[3].includes("type")) {
                                        let type = args[3].replace("type ","").toLowerCase();
                                        if (!state.basics.typeList.toLowerCase().includes(type)) {
                                            sendChat("Item List","/w gm Invalid Type! Please check the [Wiki](https://github.com/Julexar/itemstore/wiki/Type-List) for a list of available Options!");
                                        } else if (state.basics.typeList.toLowerCase().includes(type)) {
                                            if (!args[4]) {
                                                sendChat("Item Store","/w gm Invalid Amount!");
                                            } else if (args[4].includes("amount")) {
                                                let amount = Number(args[4].replace("amount ",""));
                                                if (!args[5]) {
                                                    sendChat("Item Store","/w gm You need to define a minimum Rarity!");
                                                } else if (args[5].includes("minrare")) {
                                                    let minrare = args[5].replace("minrare ","").toLowerCase();
                                                    if (!state.basics.rareList.toLowerCase().includes(minrare)) {
                                                        sendChat("Item Store","/w gm Invalid Rarity! Please check the [Wiki](https://github.com/Julexar/itemstore/wiki/Rarity-List) for a list of available Options!");
                                                    } else if (state.basics.rareList.toLowerCase().includes(minrare)) {
                                                        if (!args[6]) {
                                                            sendChat("Item Store","/w gm You need to define a minimum Rarity!");
                                                        } else if (args[6].includes("maxrare")) {
                                                            let maxrare = args[6].replace("maxrare ","").toLowerCase();
                                                            if (!state.basics.rareList.toLowerCase().includes(maxrare)) {
                                                                sendChat("Item Store","/w gm Invalid Rarity! Please check the [Wiki](https://github.com/Julexar/itemstore/wiki/Rarity-List) for a list of available Options!");
                                                            } else if (state.basics.rareList.toLowerCase().includes(maxrare)) {
                                                                let overwrite;
                                                                if (!args[7]) {
                                                                    overwrite="true";
                                                                } else if (args[7].includes("overwrite")) {
                                                                    overwrite=args[7].replace("overwrite ","");
                                                                }
                                                                createInv(store,type,amount,minrare,maxrare,overwrite);
                                                                storeMenu(store);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (option=="reset") {
                                    resetInv(store);
                                    storeMenu(store);
                                }
                            } else if (args[2]=="show") {
                                showStore(store);
                            } else if (args[2].includes("name")) {
                                let name = args[2].replace("name ","");
                                editStore(store,"name",name)
                            } else if (args[2].includes("hdc")) {
                                let hdc = Number(args[2].replace("hdc ",""));
                                editStore(store,"hdc",hdc);
                            } else if (args[2].includes("inflate")) {
                                let change = Number(args[2].replace("inflate ",""));
                                editStore(store,"cprice",change);
                            } else if (args[2].includes("deflate")) {
                                let change = Number(args[2].replace("deflate ",""))*-1;
                                editStore(store,"cprice",change);
                            } else if (args[2]=="activate") {
                                editStore(store,"active",true);
                            } else if (args[2]=="deactivate") {
                                editStore(store,"active",false);
                            } else if (args[2]=="delete") {
                                deleteStore(store);
                                storeMenu(undefined);
                            }
                        }
                    }
                break;
            }
        }
        switch (args[0]) {
            case '!shop':
                
            break;
            case '!cart':
                
            break;
            case '!haggle':
                
            break;
            case '!checkout':
                
            break;
        }
    },

    getIDsFromTokens = function (selected) {
		return (selected || []).map(obj => getObj("graphic", obj._id))
			.filter(x => !!x)
			.map(token => token.get("represents"))
			.filter(id => getObj("character", id || ""));
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
        var tablestyle2 = 'style="border-top: 1px solid #cccccc; border-left: 1px solid #cccccc; border-right: 1px solid #cccccc; text-align:center; font-size: 12px; width: 100%;"';
        var trstyle = 'style="border-right: 1px solid #cccccc;"';
        var trstyle2 = 'style="border-right: 1px solid #cccccc; border-bottom: 1px"';
        var tdstyle = 'style="border-right: 1px solid #cccccc;"';
        store=state.store.find(s => s.name==store);
        if (store) {
            let storeList=[];
            for (let i=0;i<state.store.length;i++) {
                storeList.push(state.store[i].name);
            }
            for (let i=0;i<state.store.length;i++) {
                storeList=String(storeList).replace(",","|");
            }
            let invList="";
            let items=[];
            if (store.inv.length && store.inv.length>0) {
                for (let i=0;i<store.inv.length;i++) {
                    let desc = store.inv[i].desc;
                    desc=desc.split(";");
                    invList+=`<tr ${trstyle2}><td ${tdstyle}>${i+1}</td><td ${tdstyle}>${store.inv[i].name} (x${store.inv[i].sellam})</td><td ${tdstyle}>${desc[0]}</td><td ${tdstyle}>${store.inv[i].price} GP</td><td>${store.inv[i].amount}</td></tr>`;
                    items.push(store.inv[i].name);
                }
                for (let i=0;i<store.inv.length;i++) {
                    items=String(items).replace(",","|");
                }
                if (store.active==true) {
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Store Menu</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<div style="text-align:center;">Store: <a ' + astyle1 + '" href="!store --store ?{Store?|' + storeList + '}">' + store.name + ' (active)</a></div>' + //--
                        '<br>' + //--
                        '<div style="text-align:center;"><b>Inventory</b></div>' + //--
                        '<br>' + //--
                        '<table ' + tablestyle2 + '>' + //--
                        '<thead><tr ' + trstyle2 + '><th>Pos.</th><th>Name</th><th>Description</th><th>Price</th><th>Amount</th></tr></thead>' + //--
                        '<tbody>' + //--
                        invList + //--
                        '</tbody></table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;">Hagggle DC: <a ' + astyle1 + '" href="!store --store ' + store.name + ' --hdc ?{Haggle DC?|10}">' + store.hdc + '</a></div>' + //--
                        '<br>' + //--
                        `<div style="text-align:center;">Price Change: ${store.cprice}%</div>` + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --name ?{Name?|Insert Name}">Change Name</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + store.name + ' --inflate ?{Inlation %?|0}">Inflate Price</a>' + //--
                        '<a ' + astyle3 + '" href="!store --store ' + store.name + ' --deflate ?{Deflation %?|0}">Deflate Price</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv view">Item Menu</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv gen --type ?{Type?|' + state.basics.typeList + '} --amount ?{Amount?|1} --minrare ?{Minimum Rarity?|' + state.basics.rareList + '} --maxrare ?{Maximum Rarity?|' + state.basics.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv reset">Reset Inventory</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --deactivate">Deactivate Store</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --create --name ?{Name?|Insert Name}">Create Store</a>' + //--
                        '<a ' + astyle3 + '" href="!store --store ' + store.name + ' --delete">Delete Store</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --show">Show to Players</a></div>' + //--
                        '</div>'
                    );
                } else if (store.active==false) {
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Store Menu</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<div style="text-align:center;">Store: <a ' + astyle1 + '" href="!store --store ?{Store?|' + storeList + '}">' + store.name + ' (deactive)</a></div>' + //--
                        '<br>' + //--
                        '<div style="text-align:center;"><b>Inventory</b></div>' + //--
                        '<br>' + //--
                        '<table ' + tablestyle2 + '>' + //--
                        '<thead><tr ' + trstyle2 + '><th>Pos.</th><th>Name</th><th>Description</th><th>Price</th><th>Amount</th></tr></thead>' + //--
                        '<tbody>' + //--
                        invList + //--
                        '</tbody></table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;">Hagggle DC: <a ' + astyle1 + '" href="!store --store ' + store.name + ' --hdc ?{Haggle DC?|10}">' + store.hdc + '</a></div>' + //--
                        '<br>' + //--
                        `<div style="text-align:center;">Price Change: ${store.cprice}%</div>` + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --name ?{Name?|Insert Name}">Change Name</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --store ' + store.name + ' --inflate ?{Inlation %?|0}">Inflate Price</a>' + //--
                        '<a ' + astyle3 + '" href="!store --store ' + store.name + ' --deflate ?{Deflation %?|0}">Deflate Price</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv view">Item Menu</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv gen --type ?{Type?|' + state.basics.typeList + '} --amount ?{Amount?|1} --minrare ?{Minimum Rarity?|' + state.basics.rareList + '} --maxrare ?{Maximum Rarity?|' + state.basics.rareList + '} --overwrite ?{Overwrite Inventory?|true|false}">Generate Inventory</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --inv reset">Reset Inventory</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --activate">Activate Store</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle3 + '" href="!store --create --name ?{Name?|Insert Name}">Create Store</a>' + //--
                        '<a ' + astyle3 + '" href="!store --store ' + store.name + ' --delete">Delete Store</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + store.name + ' --show">Show to Players</a></div>' + //--
                        '</div>'
                    );
                }
            }
        } else if (!store) {
            if (state.store.length && state.store.length>=1) {
                let storeList=[];
                for (let i=0;i<state.store.length;i++) {
                    storeList.push(state.store[i].name);
                }
                for (let i=0;i<state.store.length;i++) {
                    storeList=String(storeList).replace(",","|");
                }
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Store Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<div style="text-align:center;">Store: <a ' + astyle1 + '" href="!store --store ?{Store?|' + storeList + '}">Not selected</a></div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                    '</div>'
                );
            } else if (!state.store.length || state.store.length==0) {
                sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                    '<div ' + headstyle + '>Store Menu</div>' + //--
                    '<div ' + arrowstyle + '></div>' + //--
                    '<div style="text-align:center;">No existing Stores!</div>' + //--
                    '<br><br>' + //--
                    '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --create --name ?{Name?|Insert Name}">Create new Store</a></div>' + //--
                    '</div>'
                );
            }
        }
    },

    createStore = function(name) {
        //Creates a new Store
        let store=[
            {
                name: `${name}`,
                inv: [],
                hdc: 10,
                cprice: 0,
                active: true
            }
        ];
        state.store.push(store[0]);
        sendChat("Item Store","/w gm Store with the name \""+name+"\" created!");
        checkStores();
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
        
    },
    
    editMenu = function(shop,item,name,desc,mods,props,price,weight,amount,sellam) {
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
        let temp = state.basics.temp;
        let shopList=[];
        let itemList=[];
        for (let i=0;i<state.store.length;i++) {
            shopList.push(state.store[i].name);
        }
        let len=shopList.length;
        for (let i=0;i<len;i++) {
            shopList=String(shopList).replace(",","|");
        }
        for (let i=0;i<shop.inv.length;i++) {
            itemList.push(shop.inv[i].name);
        }
        len=itemList.length;
        for (let i=0;i<len;i++) {
            itemList=String(itemList).replace(",","|");
        }
        if (shop) {
            if (mode=="none") {
                item=shop.inv.find(it => it.name==item);
                if (item) {
                    if (state.basics.setup==false) {
                        temp.name=item.name;
                        temp.desc=item.desc;
                        temp.mods=item.mods;
                        temp.props=item.props;
                        temp.price=item.price;
                        temp.weight=item.weight;
                        temp.amount=item.amount;
                        temp.sellam=item.sellam;
                        state.basics.setup=true;
                    }
                    if ((!name || name=="" || name==" ")) {
                        if (temp.name!="") {
                            name=temp.name;
                        } else {
                            name=item.name;
                        }
                    } else if (name!="" && name!=" ") {
                        temp.name=name;
                    }
                    if ((!desc || desc=="" || desc==" ")) {
                        if (temp.desc!="") {
                            desc=temp.desc;
                        } else {
                            desc=item.desc;
                        }
                    } else if (desc!="" && desc!=" ") {
                        temp.desc=desc;
                    }
                    if ((!mods || mods=="" || mods==" ")) {
                        if (temp.mods!="") {
                            mods=temp.mods;
                        } else {
                            mods=item.mods;
                        }
                    } else if (mods!="" && mods!=" ") {
                        temp.mods=mods;
                    }
                    if ((!props || props==" ")) {
                        if (temp.props!=item.props) {
                            props=temp.props;
                        } else {
                            props=item.props;
                        }
                    } else if (props!=" ") {
                        temp.props=props;
                    }
                    if ((!price || price==null)) {
                        if (temp.price!=item.price && temp.price>=0) {
                            price=temp.price;
                        } else if (temp.price==item.price) {
                            price=item.price;
                        }
                    } else if (price>=0) {
                        temp.price=price;
                    }
                    if ((!weight || weight==null)) {
                        if (temp.weight!=item.weight && temp.weight>=0) {
                            weight=temp.weight;
                        } else if (temp.weight==item.weight) {
                            weight=item.weight;
                        }
                    } else if (weight>=0) {
                        temp.weight=weight;
                    }
                    if ((!amount || amount==null)) {
                        if (temp.amount!=item.amount && temp.amount>=1) {
                            amount=temp.amount;
                        } else if (temp.amount==item.amount) {
                            amount=item.amount;
                        }
                    } else if (amount>=1) {
                        temp.amount=amount;
                    }
                    if ((!sellam || sellam==null)) {
                        if (temp.sellam!=item.sellam && temp.sellam>=1) {
                            sellam=temp.sellam;
                        } else if (temp.sellam==item.sellam) {
                            sellam=item.sellam;
                        }
                    } else if (sellam>=1) {
                        temp.sellam=sellam;
                    }
                    sendChat("Item Store","/w gm <div " + divstyle + ">" + //--
                        '<div ' + headstyle + '>Item Editor</div>' + //--
                        '<div ' + arrowstyle + '></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle1 + '" href="!store --store ?{Store?|' + shopList + '} --inv edit --item ' + item.name + '">' + shop.name + '</a></div>' + //--
                        '<br><div style="text-align:center;"><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ?{Item?|' + itemList + '}">' + item.name + '</a></div>' + //--
                        '<br><br>' + //--
                        '<table ' + tablestyle + '>' + //--
                        '<tr><td>Name: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --name ?{Name?|Insert Name}">' + name + '</a></td></tr>' + //--
                        '<tr><td>Description: </td><td>' + desc + '</td></tr>' + //--
                        '<tr><td>Mods: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --mods ?{Mods?|Insert Modifiers}">' + mods + '</a></td></tr>' + //--
                        '<tr><td>Props: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --props ?{Props?|Insert Properties}">' + props + '</a></td></tr>' + //--
                        '<tr><td>Price: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --price ?{Price?|1}">' + price + ' GP</a></td></tr>' + //--
                        '<tr><td>Weight: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --weight ?{Weight?|1}">' + weight + 'lbs</a></td></tr>' + //--
                        '<tr><td>Amount: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --amount ?{Amount?|1}">' + amount + '</a></td></tr>' + //--
                        '<tr><td>Bundle Size: </td><td><a ' + astyle1 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --sellam ?{Bundle Size?|1}">' + sellam + '</a></td></tr>' + //--
                        '</table>' + //--
                        '<br><br>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv edit --item ' + item.name + ' --desc ?{Description?|Insert Desc}">Set Description</a></div>' + //--
                        '<div style="text-align:center;"><a ' + astyle2 + `" href="!store --store ${shop.name} --inv edit --item ${item.name} --name ${name} --desc ${desc} --mods ${mods} --props ${props} --price ${price} --weight ${weight} --amount ${amount} --sellam ${sellam} --confirm">Apply Changes</a></div>` + //--
                        '<div style="text-align:center;"><a ' + astyle2 + '" href="!store --store ' + shop.name + ' --inv view">Go Back</a></div>' + //--
                        '</div>'
                    );
                } else if (!item) {
                    sendChat("Item Store","/w gm Couldn\'t find an Item with that name!");
                }
            }
        }
    },

    addItem = function(store,name,desc,mods,props,price,weight,amount,sellam) {
        //Adds an Item to a Shop's Inventory
        store=state.store.find(s => s.name==store);
        let found=false;
        for (let i=0;i<store.inv.length;i++) {
            if (store.inv[i].name==name) {
                store.inv[i].amount++;
                found=true;
            }
        }
        if (!found) {
            if (!desc || desc=="" || desc==" ") {
                desc="";
            }
            if (!mods || mods=="" || mods==" ") {
                mods="";
            }
            if (!props || props=="" || props==" ") {
                props="";
            }
            if (!price) {
                price=0;
            }
            if (!weight) {
                weight=0;
            }
            if (!amount) {
                amount=1;
            }
            if (!sellam) {
                sellam=1;
            }
            store.inv.push(
                {
                    name: name,
                    desc: desc,
                    mods: mods,
                    props: props,
                    price: Number(price),
                    weight: Number(weight),
                    amount: Number(amount),
                    sellam: Number(sellam)
                }
            );
            desc=desc.split(";");
            sendChat("Item Store","/w gm Created Item #"+len+"<br>Name: "+name+"<br>Description: "+desc[0]+'<br><div style="text-align:center;">'+desc[1]+"</div><br>Modifiers: "+mods+"<br>Properties: "+props+"<br>Price: "+price+" GP<br>Weight: "+weight+" lbs<br>Amount (in stock): "+amount+"<br>Bundle amount: "+sellam);
        } else {
            sendChat("Item Store","/w gm Item with that name already exists, increased its amount instead!");
        }
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store.name) {
                state.store[i].inv=store.inv;
            }
        }
    },

    editItem = function(store,item,name,desc,mods,props,price,weight,amount,sellam) {
        //Edit the Items in a Shop's Inventory
        store=state.store.find(s => s.name==store);
        
    },

    removeItem = function(store,item) {
        //Removes an Item from the Shop's Inventory
        store=state.store.find(s => s.name==store);
        for (let i=0;i<store.inv.length;i++) {
            if (store.inv[i].name==item) {
                store.inv.splice(i);
            }
        }
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store.name) {
                state.store[i].inv=store.inv;
            }
        }
        sendChat("Item Store","/w gm Deleted Item #"+Number(num+1)+"<br>Name: "+item);
    },

    createInv = function(store,type,amount,minrare,maxrare,overwrite) {
        //Generate a random Inventory
        store=state.store.find(s => s.name==store);
        let rarity=checkRarity(minrare,maxrare);
        minrare=rarity[0];
        maxrare=rarity[1];
        let list=store.inv;
        if (overwrite=="true") {
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
            } else if (type.includes("mundane")) {
                list=genMundane(amount,minrare,maxrare);
            } else if (type.includes("rand")) {
                list=[];
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
                            list.push(genMundane(1,minrare,maxrare)[0]);
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
                            list=genMundane(1,minrare,maxrare);
                        }
                    }
                }
            }
            store.inv=list;
            sendChat("Item Store","/w gm Generated new Inventory and overwrote the previous Inventory.");
        } else if (overwrite=="false") {
            let seclist;
            type=type.toLowerCase();
            if (type.includes("weapon")) {
                seclist=genWeapon(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i].amount++;
                            seclist.splice(j);
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
                            list[i].amount++;
                            seclist.splice(j);
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
                            list[i].amount++;
                            seclist.splice(j);
                            log(seclist[i].desc);
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
                            list[i].amount++;
                            seclist.splice(j);
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
                            list[i].amount++;
                            seclist.splice(j);
                        }
                    }
                }
                for (let i=0;i<seclist.length;i++) {
                    list.push(seclist[i]);
                }
            } else if (type.includes("mund")) {
                seclist=genMundane(amount,minrare,maxrare);
                for (let i=0;i<list.length;i++) {
                    for (let j=0;j<seclist.length;j++) {
                        if (list[i].name==seclist[j].name) {
                            list[i].amount++;
                            seclist.splice(j);
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
                            list=genMundane(1,minrare,maxrare);
                        }
                    }
                }
            }
            store.inv=list;
            sendChat("Item Store","/w gm Generated new Items and added them to the Store.");
        }
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store.name) {
                state.store[i].inv=store.inv;
            }
        }
    },

    genWeapon = function(amount,minrare,maxrare) {
        //Generate Weapons
        let items=[];
        let list=state.list.weapon;
        let rare=minrare+':'+maxrare;
        amount=Number(amount);
        for (let i=0;i<amount;i++) {
            let pricechange;
            let namechange;
            let rand;
            let rarity;
            switch (rare) {
                case 'common:common':
                    pricechange=0;
                    rarity="common";
                    namechange="";
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
            let mods=list[rand-1].mods;
            let desc=list[rand-1].desc.split(';');
            let props=list[rand-1].props;
            let weight=list[rand-1].weight;
            if (name.includes("+1")) {
                mods+=", Attack +1, Damage +1";
                desc[1]="You have a +1 bonus to attack and damage rolls made with this magic weapon.";
            } else if (name.includes("+2")) {
                mods+=", Attack +2, Damage +2";
                desc[1]="You have a +2 bonus to attack and damage rolls made with this magic weapon.";
            } else if (name.includes("+3")) {
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
                    props: props,
                    price: price,
                    weight: weight,
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
        amount=Number(amount);
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
                        namechange="";
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
                        namechange="";
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
            let props=list[rand-1].props;
            let weight=list[rand-1].weight;
            if (name.includes("shield")) {
                if (name.includes("+1")) {
                    mods+=", AC +1";
                    desc[1]="While holding this shield, you have a +1 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                } else if (name.includes("+2")) {
                    mods+=", AC +2";
                    desc[1]="While holding this shield, you have a +2 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                } else if (name.includes("+3")) {
                    mods+=", AC +3";
                    desc[1]="While holding this shield, you have a +3 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.";
                }
            } else {
                if (name.includes("+1")) {
                    mods+=", AC +1";
                    desc[1]="You have a +1 bonus to AC while wearing this armor.";
                } else if (name.includes("+2")) {
                    mods+=", AC +2";
                    desc[1]="You have a +2 bonus to AC while wearing this armor.";
                } else if (name.includes("+3")) {
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
                    props: props,
                    price: price,
                    weight: weight,
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
        amount=Number(amount);
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
        let test;
        for (let i=0;i<list.length;i++) {
            if (list[i].name.includes(String(level))) {
                test=list[i];
            }
        }
        let name=test.name;
        let price=test.price;
        let am=test.amount;
        let sellam=test.sellam;
        let mods=test.mods;
        let props=test.props;
        let constdesc="A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class\'s spell list, you can read the scroll and cast its spell without providing any material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell\'s normal casting time. Once the spell is cast, the words on the scroll fade, and it crumbles to dust. If the casting is interrupted, the scroll is not lost.  If the spell is on your class\'s spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell\'s level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.";
        let desc=`${test.desc}${constdesc}`;
        let weight=test.weight;
        for (let i=0;i<amount;i++) {
            if (items[i]==undefined) {
                let spell=rollSpell(level);
                let truespell=[
                    {
                        name: name+" ("+spell[0]+")",
                        desc: desc,
                        mods: mods,
                        props: props,
                        price: price,
                        weight: weight,
                        amount: am,
                        sellam: sellam
                    }
                ];
                items.push(truespell[0]);
            } else if (items[i]!==undefined) {
                let spell=rollSpell(level);
                if (items[i].name==spell[0]) {
                    items[i].amount++;
                } else {
                    let truespell=[
                        {
                            name: name+" ("+spell[0]+")",
                            desc: desc,
                            mods: mods,
                            props: props,
                            price: price,
                            weight: weight,
                            amount: am,
                            sellam: sellam
                        }
                    ];
                    items.push(truespell[0]);
                }
            }
        }
        return items;
    },

    rollSpell = function(level) {
        let spellList=state.list.spell[level].list;
        let spell=[];
        let rand=randomInteger(spellList.length-1);
        spell.push(spellList[rand]);
        return spell;
    },

    genPotion = function(amount,minrare,maxrare) {
        let items=[];
        let list=state.list.potion;
        let rare=minrare+':'+maxrare;
        let rarity;
        let rand;
        let potionList=[];
        amount=Number(amount);
        for (let i=0;i<amount;i++) {
            if (rare=='common:common') {
                rarity="common";
            } else if (rare=="common:uncommon") {
                rand=randomInteger(2);
                if (rand==1) {
                    rarity="common";
                } else if (rand==2) {
                    rarity="uncommon";
                }
            } else if (rare=="common:rare") {
                rand=randomInteger(3);
                    if (rand==1) {
                        rarity="common";
                    } else if (rand==2) {
                        rarity="uncommon";
                    } else if (rand==3) {
                        rarity="rare";
                    }
            } else if (rare=="common:very rare") {
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
            } else if (rare=="common:legendary") {
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
            } else if (rare=="uncommon:uncommon") {
                rarity="uncommon";
            } else if (rare=="uncommon:rare") {
                rand=randomInteger(2);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    }
            } else if (rare=="uncommon:very rare") {
                rand=randomInteger(3);
                    if (rand==1) {
                        rarity="uncommon";
                    } else if (rand==2) {
                        rarity="rare";
                    } else if (rand==3) {
                        rarity="very rare";
                    }
            } else if (rare=="uncommon:legendary") {
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
            } else if (rare=="rare:rare") {
                rarity="rare";
            } else if (rare=="rare:very rare") {
                rand=randomInteger(2);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    }
            } else if (rare=="rare:legendary") {
                rand=randomInteger(3);
                    if (rand==1) {
                        rarity="rare";
                    } else if (rand==2) {
                        rarity="very rare";
                    } else if (rand==3) {
                        rarity="legendary";
                    }
            } else if (rare=="very rare:very rare") {
                rarity="very rare";
            } else if (rare=="very rare:legendary") {
                rand=randomInteger(2);
                    if (rand==1) {
                        rarity="very rare";
                    } else if (rand==2) {
                        rarity="legendary";
                    }
            } else if (rare=="legendary:legendary") {
                rarity="legendary";
            }
            for (let j=0;j<list.length;j++) {
                if (list[j].rarity==rarity) {
                    potionList.push(list[j]);
                }
            }
            rand=randomInteger(potionList.length)-1;
            if (items[0]==undefined) {
                items.push(potionList[rand]);
            } else {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==potionList[rand].name) {
                        items[j].amount++;
                    }
                }
            }
        }
        return items;
    },

    genMisc = function(amount,minrare,maxrare) {
        let items=[];
        let list;
        let rare=minrare+':'+maxrare;
        const commonlist="Bead of Nourishment,50;Bead of Refreshment,50;Boots of False Tracks,50;Candle of the Deep,50;Charlatan\'s Die,50;Cloak of Billowing,50;Cloak of Many Fashions,50;Clockwork Amulet,50;Clothes of Mending,50;Dark Shard Amulet,50;Dread Helm,50;Ear Horn of Hearing,50;Enduring Spellbook,50;Ersatz Eye,50;Hat of Vermin,50;Hat of Wizardry,50;Heward\'s Handy Spice,50;Horn of Silent Alarm,50;Instrument of Illusions,50;Instrument of Scribing,50;Lock of Trickery,50;Mystery Key,50;Orb of Direction,50;Orb of Time,50;Perfume of Bewiching,50;Pipe of Smoke Monsters,50;Pole of Angling,50;Pole of Collapsing,50;Pot of Awakening,50;Rope of Mending,50;Ruby of the Wary Mage,50;Staff of Adornment,50;Staff of Birdcalls,50;Staff of Flowers,50;Talking Doll,50;Tankard of Sobriety,50;Unbreakable Arrow,50;Veteran\'s Cane,50;Wand of Conduction,50;Wand of Pyrotechnics,50;Wand of Scowls,50;Wand of Smiles,50";
        const uncommonlist="Alchemy Jug,6000;Amulet of Proof Against Detection and Location,20000;Bag of Holding,4000;Boots of Elvenkind,2500;Boots of Striding and Springing,5000;Boots of the Winterlands,10000;Bracers of Archery,1500;Brooch of Shielding,7500;Broom of Flying,8000;Cap of Water Breathing,1000;Circlet of Blasting,1500;Cloak of Elvenkind,5000;Cloak of Protection,3500;Cloak of the Manta Ray,6000;Decanter of Endless Water,135000;Deck of Illusions,6120;Driftglobe,750;Dust of Disappearance,300;Dust of Dryness (1 pellet),120;Dust of Sneezing and Choking,480;Elemental Gem,960;Eversmoking Bottle,1000;Eyes of Charming,3000;Eyes of Minute Seeing,2500;Eyes of the Eagle,2500;Gauntlets of Ogre Power,8000;Gem of Brightness,5000;Gloves of Missile Snaring,3000;Gloves of Swimming and Climbing,2000;Gloves of Thievery,5000;Goggles of Night,1500;Hat of Disguise,5000;Headband of Intellect,8000;Helm of Comprehend Languages,500;Helm of Telepathy,12000;Immovable Rod,5000;Instrument of the Bards - Doss Lute,28500;Instrument of the Bards - Fochulan Bandlore,26500;Instrument of the Bards - Mac-Fuirmidh Cittern,27000;Keoghtom\'s Ointment (1 dose),120;Lantern of Revealing,5000;Luckstone,4200;Medallion of Thoughts,3000;Necklace of Adaption,1500;Pearl of Power,6000;Periapt of Health,5000;Periapt of Wound Closure,5000;Pipes of Haunting,6000;Pipes of the Sewers,2000;Quiver of Ehlonna,1000;Ring of Jumping,2500;Ring of Mind Shielding,16000;Ring of Swimming,3000;Ring of Warmth,1000;Ring of Water Walking,1500;Robe of Useful Items,2000;Rope of Climbing,2000;Saddle of the Cavalier,2000;Sending Stones,2000;Silver Raven,5000;Slippers of Spider Climbing,5000;Wind Fan,1500;Winged Boots,8000";
        const rarelist="Amulet of Health,8000;Bead of Force,960;Belt of Dwarvenkind,6000;Boots of Levitation,4000;Boots of Speed,4000;Bowl of Commanding Water Elementals,8000;Bracers of Defense,6000;Brass Horn of Valhalla,8400;Brazier of Commanding Fire Elementals,8000;Bronze Griffon,8000;Cape of the Mountebank,8000;Censer of Controlling Air Elementals,8000;Chime of Opening,1500;Cloak of Displacement,60000;Cloak of the Bat,6000;Cube of Force,16000;Daern\'s Instant Fortress,75000;Dimensional Shackles,3000;Ebony Fly,6000;Folding Boat,10000;Gem of Seeing,32000;Goldean Lion (ea),600;Helm of Teleportation,64000;Heward\'s Handy Haversack,2000;Horn of Blasting,450;Horseshoes of Speed,5000;Instrument of the Bards - Canaith Mandolin,30000;Instrument of the Bards - Cli Lyre,35000;Ioun Stone Awareness,12000;Ioun Stone Protection,1200;Ioun Stone Reserve,6000;Ioun Stone Sustenance,1000;Iron Bands of Bilarro,4000;Ivory Goat (Terror),20000;Ivory Goat (Travail),400;Ivory Goat (Traveling),1000;Mantle of Spell Resistance,30000;Marble Elephant,6000;Necklace of Fireballs (Five beads),3840;Necklace of Fireballs (Four beads),1600;Necklace of Fireballs (One bead),300;Necklace of Fireballs (Six beads),7680;Necklace of Fireballs (Three beads),960;Necklace of Fireballs (Two beads),480;Onyx Dog,3000;Periapt of Proof Against Poison,5000;Portable Hole,8000;Prayer Bead - Bless,2000;Prayer Bead - Curing,4000;Prayer Bead - Favor,32000;Prayer Bead - Smiting,1500;Prayer Bead - Summons,128000;Prayer Bead - Wind Walking,96000;Quaal\'s Feather Token Anchor,50;Quaal\'s Feather Token Bird,3000;Quaal\'s Feather Token Fan,250;Quaal\'s Feather Token Swan Boat,3000;Quaal\'s Feather Token Whip,250;Ring of Animal Influence,4000;Ring of Evasion,5000;Ring of Feather Falling,2000;Ring of Free Action,20000;Ring of Protection,3500;Ring of Resistance,6000;Ring of Spell Storing,24000;Ring of the Ram,5000;Ring of X-Ray Vision,6000;Robe of Eyes,30000;Rope of Entanglement,4000;Serpentine Owl,8000;Silver Horn of Valhalla,5600;Stone of Controlling Earth Elementals,8000;Wings of Flying,5000";
        const veryrarelist="Amulet of the Planes,160000;Bronze Horn of Valhalla,11200;Carpet of Flying,12000;Cloak of Arachnida,5000;Crystal Ball,50000;Horseshoes of the Zephyr,1500;Instrument of the Bards - Anstruth Harp,109000;Ioun Stone Absorption,2400;Ioun Stone Agility,3000;Ioun Stone Fortitude,3000;Ioun Stone Insight,3000;Ioun Stone Intellect,3000;Ioun Stone Leadership,3000;Ioun Stone Strength,3000;Mirror of Life Trapping,18000;Nolzur\'s Marvelous Pigments,200;Obsidian Steed,128000;Ring of Regeneration,12000;Ring of Shooting Stars,14000;Ring of Telekinesis,80000;Robe of Scintillating Colors,6000;Robe of Stars,60000";
        const legendarylist="Apparatus of Kwalish,10000;Cloak of Invisibility,80000;Cubic Gate,40000;Efreeti Chain,20000;Instrument of the Bards - Ollamh Harp,125000;Ioun Stone Greater Absorption,31000;Ioun Stone Mastery,15000;Ioun Stone Regeneration,4000;Iron Horn of Valhalla,14000;Ring of Air Elemental Command,35000;Ring of Earth Elemental Command,31000;Ring of Fire Elemental Command,17000;Ring of Invisibility,10000;Ring of Spell Turning,30000;Ring of Water Elemental Command,25000;Robe of the Archmagi,34000;Scarab of Protection,36000;Sovereign Glue,400;Sphere of Annihilation,15000;Talisman of Pure Good,71680;Talisman of the Sphere,20000;Talisman of Ultimate Evil,61440;Universal Solvent,300";
        var rand=randomInteger(100);
        let rarity;
        amount=Number(amount);
        for (let i=0;i<amount;i++) {
            rand=randomInteger(100);
            switch (rare) {
                case 'common:common':
                    list=commonlist;
                    rarity="common";
                break;
                case 'common:uncommon':
                    if (rand<=70) {
                        list = commonlist;
                        rarity="common";
                    } else if (rand>70) {
                        list = uncommonlist;
                        rarity="uncommon";
                    }
                break;
                case 'common:rare':
                    if (rand<=55) {
                        list = commonlist;
                        rarity="common";
                    } else if (rand<=85) {
                        list = uncommonlist;
                        rarity="uncommon";
                    } else if (rand>85) {
                        list = rarelist;
                        rarity="rare";
                    }
                break;
                case 'common:very rare':
                    if (rand<=51) {
                        list=commonlist;
                        rarity="common";
                    } else if (rand<=81) {
                        list=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=96) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        list=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'common:legendary':
                    if (rand<=50) {
                        list=commonlist;
                        rarity="common";
                    } else if (rand<=80) {
                        list=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=95) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        list=veryrarelist;
                        rarity="rare";
                    } else if (rand==100) {
                        list=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'uncommon:uncommon':
                    list=uncommonlist;
                    rarity="uncommon";
                break;
                case 'uncommon:rare':
                    if (rand<=85) {
                        list=uncommonlist;
                        rarity="uncommon";
                    } else if (rand>85) {
                        list=rarelist;
                        rarity="rare";
                    }
                break;
                case 'uncommon:very rare':
                    if (rand<=81) {
                        list=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=96) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        list=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'uncommon:legendary':
                    if (rand<=80) {
                        list=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=95) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        list=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        list=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'rare:rare':
                    list=rarelist;
                    rarity="rare";
                break;
                case 'rare:very rare':
                    if (rand<=96) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        list=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'rare:legendary':
                    if (rand<=95) {
                        list=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        list=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        list=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'very rare:very rare':
                    list=veryrarelist;
                    rarity="very rare";
                break;
                case 'very rare:legendary':
                    if (rand<=99) {
                        list=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        list=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'legendary:legendary':
                    list=legendarylist;
                    rarity="legendary";
                break;
            }
            list=list.split(";");
            rand=randomInteger(list.length);
            let stuff=String(list[rand-1]);
            stuff=stuff.split(',');
            let name=stuff[0];
            let price=Number(stuff[1]);
            let found=false;
            if (items[0]==undefined) {
                items.push(
                    {
                        name: name,
                        desc: "Misc Item ("+rarity+");",
                        mods: "Item Type: Item",
                        props: "",
                        price: price,
                        weight: 0,
                        amount: 1,
                        sellam: 1
                    }
                );
            } else if (items[0]!==undefined) {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==name) {
                        items[j].amount++;
                        found=true;
                    }
                }
                if (found==false) {
                    items.push(
                        {
                            name: name,
                            desc: "Misc Item ("+rarity+");",
                            mods: "Item Type: Item",
                            props: "",
                            price: price,
                            weight: 0,
                            amount: 1,
                            sellam: 1
                        }
                    );
                }
            }
        }
        return items;
    },

    genMundane = function(amount,minrare,maxrare) {
        let items=[];
        let list;
        let mundaneList="";
        let rare=minrare+':'+maxrare;
        amount=Number(amount);
        var rand;
        let rarity;
        let commonlist="Candle,0.01;Chalk (1 piece),0.01;Sack,0.01;Torch,0.01;Wheat,0.01;Whetstone,0.01;Blowgun Needle,0.01;Chicken,0.02;Flask,0.02;Flour,0.02;Jug,0.02;Loaf of Bread,0.02;Pitcher,0.02;Soap,0.02;Tankard,0.02;Ale (mug),0.04;Sling Bullets (20),0.04;Arrow,0.05;Bucket,0.05;Caltrop,0.05;Crossbow Bolt,0.05;Dart,0.05;Feed (per day),0.05;Piton,0.05;Pole (10-foot),0.05;Salt,0.05;Signal Whistle,0.05;Canvas (1 sq. yd.),0.1;Club,0.1;Dice Set,0.1;Hunk of Cheese,0.1;Insect Repellent (Block of Incense),0.1;Iron,0.1;Iron Spike,0.1;Ladder (10-foot),0.1;Oil (flask),0.1;Parchment (one sheet),0.1;Sling,0.1;Ale (Gallon),0.2;Common Wine (Pitcher),0.2;Greatclub,0.2;Mess Kit,0.2;Paper (one sheet),0.2;Quarterstaff,0.2;Waterskin,0.2;Chunk of Meat,0.3;Basket,0.4;Blanket,0.5;Common Clothes,0.5;Copper,0.5;Cotton Cloth (1 sq. yd.),0.5;Javelin,0.5;Lamp,0.5;Playing Card Set,0.5;Pouch,0.5;Rations (1 day),0.5;Sealing Wax,0.5;Stabling (per day),0.5;Tinderbox,0.5;Arrows (20),1;Ball Bearings (bag of 1000),1;Bedroll,1;Bell,1;Block and Tackle,1;Blowgun Needles (50),1;Caltrops (bag of 20),1;Cook\'s Utensils,1;Crossbow Bolt Case,1;Crossbow Bolts (20),1;Dragonchess Set,1;Fishing Tackle,1;Ginger,1;Goat,1;Hammer,1;Hempen Rope (50 feet),1;Insect Repellent (greasy salve),1;Iron Spikes (10),1;Map or Scroll Case,1;Net,1;Quiver,1;Rain Catcher,1;Robes,1;Sickle,1;Spear,1;Spring of Mistletoe,1;Three-Dragon Ante Set,1;Totem,1;Vial,1;Weaver\'s Tools,1;Wukka Nut,1;Yahcha,1;Yklwa,1;Backpack,2;Barrel,2;Bit and Bridle,2;Cinnamon,2;Crampons,2;Crowbar,2;Dagger,2;Flute,2;Glass Bottle,2;Grappling Hook,2;Iron Pot,2;Light Hammer,2;Menacles,2;Menga leaves (1 ounce),2;Miner\'s Pick,2;Pepper,2;Abacus,2,Shawm,2;Sheep,2;Shovel,2;Sledgehammer,2;Snowshoes,2;Traveler\'s Clothes,2;Two-Person Tent,2;Whip,2;Cloves,3;Horn,3;Pig,3;Theki Root,3;Portable Ram,4;Saddlebags,4";
        let uncommonlist="Amulet,5;Chain (10 feet),5;Chest,5;Cobbler\'s Tools,5;Costume Clothes,5;Emblem,5;Handaxe,5;Healer\'s Kit,5;Herbalism Kit,5;Hooded Lantern,5;Hunting Trap,5;Leatherworker\'s Tools,5;Linen (1 sq. yd.),5;Mace,5;Merchant\'s Scale,5;Six person Tent,5;Pack Saddle,5;Padded Armor,5;Perfume (vial),5;Pike,5;Reliquary,5;Signet Ring,5;Silver,5;Sinda berries (10),5;Staff,5;Steel Mirror,5;Trident,5;War Pick,5;Wooden Staff,5;Drum,6;Carpenter\'s Tools,8;Donkey,8;Mule,8;Battleaxe,10;Blowgun,10;Bullseye Lantern,10;Calligrapher\'s Supplies,10;Clothing (cold weather),10;Cow,10;Crystal,10;Explorer\'s Pack,10;Fine Wine (Bottle),10;Flail,10;Hide Armor,10;Ink (1-ounce bottle),10;Lance,10;Leather Armor,10;Lock,10;Mason\'s Tools,10;Maul,10;Painter\'s Supplies,10;Potter\'s Tools,10;Riding Saddle,10;Rod,10;Shield,10;Shortsword,10;Silk (1 sq. yd.),10;Silk Rope (50 feet),10;Wand,10;Yew Wand,10;Zabou,10;Dungeoneer\'s Pack,12;Pan Flute,12;Cart,15;Cartographer\'s Tools,15;Fine Clothes,15;Forgery Kit,15;Longsword,15;Morningstar,15;Ox,15;Saffron,15;Warhammer,15;Burglar\'s Pack,16;Priest\'s Pack,19;Brewer\'s Supplies,20;Dogsled,20;Glaive,20;Halberd,20;Military Saddle,20;Orb,20;Sled,20;Smith\'s Tools,20;Acid (vial),25;Book,25;Climber\'s Kit,25;Component Pouch,25;Disguise Kit,25;Dulcimer,25;Holy Water (flask),25;Hourglass,25;Jeweler\'s Tools,25;Light Crossbow,25;Navigator\'s Tools,25;Rapier,25;Scimitar,25;Shortbow,25;Thieves\' Tools,25;Wildroot,25;Yarting,25;Bagpipes,30;Glassblower\'s Tools,30;Greataxe,30;Lyre,30;Ring Mail,30;Pony,30;Viol,30;Willowshade Oil,30;Monster Hunter\'s Pack,33;Lute,35;Wagon,35;Diplomat\'s Pack,39;Entertainer\'s Pack,40;Scholar\'s Pack,40;Studded Leather Armor,45";
        let rarelist="Alchemist\'s Fire (Flask),50,Alchemist\'s Supplies,50;Antitoxin (vial),50;Axe Beak,50;Camel,50;Canoe,50;Chain Shirt,50;Draft Horse,50;Gold,50;Greatsword,50;Heavy Crossbow,50;Longbow,50;Olisuba Leaf,50;Poisoner\'s Kit,50;Rowboat,50;Ryath Root,50;Scale Mail,50;Sled Dog,50;Spellbook,50;Tinker\'s Tools,50;Exotic Saddle,60;Chain Mail,75;Hand Crossbow,75;Riding Horse,75;Spiked Armor,75;Basic Potion (vial),100;Silvered Weapon,100;Silvered Ammunition (10),100;Carriage,100;Double-Bladed Scimitar,100;Magnifying Glass,100;Muroosa Balm,100;Pride Silk,100;Assassin\'s Blood,Soothsalts,150;Truth Serum,150;Oversized Longbow,150;Oversized Arrow (20),3";
        let veryrarelist="Blight Ichor,200;Carrion Crawler Mucus,200;Drow Poison,200;Elephant,200;Serpent Venom,200;Splint Armor,200;Chariot,250;Malice,250;Pale Tincture,250;Black Sap,300;Essence of Ether,300;Breastplate,400;Moorbounder,400;Oil of Taggit,400;Warhorse,400;Burnt Othur Fumes,500;Platinum,500;Pride Silk Outfit,500;Vial of Stardust,500;Torpor,600;Half Plate Armor,750";
        let legendarylist="Adamantine Bar,1000;Spyglass,1000;Wyvern Poison,1200;Midnight Tears,1500;Plate Armor,1500;Purple Worm Poison,2000;Keelboat,3000;Longship,10000;Airship,20000;Warship,25000;Galley,30000;Skyship,100000";
        for (let i=0;i<amount;i++) {
            rand=randomInteger(100);
            switch (rare) {
                case 'common:common':
                    mundaneList=commonlist;
                    rarity="common";
                break;
                case 'common:uncommon':
                    if (rand<=70) {
                        mundaneList = commonlist;
                        rarity="common";
                    } else if (rand>70) {
                        mundaneList = uncommonlist;
                        rarity="uncommon";
                    }
                break;
                case 'common:rare':
                    if (rand<=55) {
                        mundaneList = commonlist;
                        rarity="common";
                    } else if (rand<=85) {
                        mundaneList = uncommonlist;
                        rarity="uncommon";
                    } else if (rand>85) {
                        mundaneList = rarelist;
                        rarity="rare";
                    }
                break;
                case 'common:very rare':
                    if (rand<=51) {
                        mundaneList=commonlist;
                        rarity="common";
                    } else if (rand<=81) {
                        mundaneList=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=96) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'common:legendary':
                    if (rand<=50) {
                        mundaneList=commonlist;
                        rarity="common";
                    } else if (rand<=80) {
                        mundaneList=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=95) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        mundaneList=veryrarelist;
                        rarity="rare";
                    } else if (rand==100) {
                        mundaneList=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'uncommon:uncommon':
                    mundaneList=uncommonlist;
                    rarity="uncommon";
                break;
                case 'uncommon:rare':
                    if (rand<=85) {
                        mundaneList=uncommonlist;
                        rarity="uncommon";
                    } else if (rand>85) {
                        mundaneList=rarelist;
                        rarity="rare";
                    }
                break;
                case 'uncommon:very rare':
                    if (rand<=81) {
                        mundaneList=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=96) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'uncommon:legendary':
                    if (rand<=80) {
                        mundaneList=uncommonlist;
                        rarity="uncommon";
                    } else if (rand<=95) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        mundaneList=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'rare:rare':
                    mundaneList=rarelist;
                    rarity="rare";
                break;
                case 'rare:very rare':
                    if (rand<=96) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand>96) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    }
                break;
                case 'rare:legendary':
                    if (rand<=95) {
                        mundaneList=rarelist;
                        rarity="rare";
                    } else if (rand<=99) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        mundaneList=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'very rare:very rare':
                    mundaneList=veryrarelist;
                    rarity="very rare";
                break;
                case 'very rare:legendary':
                    if (rand<=99) {
                        mundaneList=veryrarelist;
                        rarity="very rare";
                    } else if (rand==100) {
                        mundaneList=legendarylist;
                        rarity="legendary";
                    }
                break;
                case 'legendary:legendary':
                    mundaneList=legendarylist;
                    rarity="legendary";
                break;
            }
            list=mundaneList.split(";");
            rand=randomInteger(list.length);
            let stuff=String(list);
            stuff=stuff.split(',');
            let name=stuff[0];
            let price=Number(stuff[1]);
            let found=false;
            if (items[0]==undefined) {
                items.push(
                    {
                        name: name,
                        desc: "Misc Item ("+rarity+");",
                        mods: "Item Type: Item",
                        props: "",
                        price: price,
                        weight: 0,
                        amount: 1,
                        sellam: 1
                    }
                );
            } else {
                for (let j=0;j<items.length;j++) {
                    if (items[j].name==name) {
                        items[j].amount++;
                        found=true;
                    }
                }
                if (found==false) {
                    items.push(
                        {
                            name: name,
                            desc: "Mundane Item ("+rarity+");",
                            mods: "Item Type: Item",
                            props: "",
                            price: price,
                            weight: 0,
                            amount: 1,
                            sellam: 1
                        }
                    );
                }
            }
        }
        return items;
    },

    checkRarity = function(minrare,maxrare) {
        minrare=minrare.toLowerCase();
        maxrare=maxrare.toLowerCase();
        let rarity=[];
        if (minrare=="uncommon") {
            if (maxrare=="common") {
                sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                return;
            }
        } else if (minrare=="rare") {
            if (maxrare=="common" || maxrare=="uncommon") {
                sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                return;
            }
        } else if (minrare=="very rare") {
            if (maxrare=="common" || maxrare=="uncommon" || maxrare=="rare") {
                sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                return;
            }
        } else if (minrare=="legendary") {
            if (maxrare!=="legendary") {
                sendChat("Item Store","/w gm Maximum Rarity may not be below Minimum Rarity!");
                return;
            }
        } else if (minrare=="random") {
            if (maxrare=="common") {
                minrare=maxrare;
            } else if (maxrare=="uncommon") {
                let rand=randomInteger(2);
                if (rand==1) {
                    minrare="common";
                } else if (rand==2) {
                    minrare=maxrare;
                }
            } else if (maxrare=="rare") {
                let rand=randomInteger(3);
                if (rand==1) {
                    minrare="common";
                } else if (rand==2) {
                    minrare="uncommon";
                } else if (rand==3) {
                    minrare=maxrare;
                }
            } else if (maxrare=="very rare") {
                let rand=randomInteger(4);
                if (rand==1) {
                    minrare="common";
                } else if (rand==2) {
                    minrare="uncommon";
                } else if (rand==3) {
                    minrare="rare";
                } else if (rand==4) {
                    minrare=maxrare;
                }
            } else if (maxrare=="legendary") {
                let rand=randomInteger(5);
                if (rand==1) {
                    minrare="common";
                } else if (rand==2) {
                    minrare="uncommon";
                } else if (rand==3) {
                    minrare="rare";
                } else if (rand==4) {
                    minrare="very rare";
                } else if (rand==5) {
                    minrare=maxrare;
                }
            } else if (maxrare=="random") {
                let rand2=randomInteger(5);
                if (rand2==1) {
                    maxrare="common";
                } else if (rand2==2) {
                    maxrare="uncommon";
                } else if (rand2==3) {
                    maxrare="rare";
                } else if (rand2==4) {
                    maxrare="very rare";
                } else if (rand2==5) {
                    maxrare="legendary";
                }
                if (maxrare=="common") {
                    minrare=maxrare;
                } else if (maxrare=="uncommon") {
                    let rand=randomInteger(2);
                    if (rand==1) {
                        minrare="common";
                    } else if (rand==2) {
                        minrare=maxrare;
                    }
                } else if (maxrare=="rare") {
                    let rand=randomInteger(3);
                    if (rand==1) {
                        minrare="common";
                    } else if (rand==2) {
                        minrare="uncommon";
                    } else if (rand==3) {
                        minrare=maxrare;
                    }
                } else if (maxrare=="very rare") {
                    let rand=randomInteger(4);
                    if (rand==1) {
                        minrare="common";
                    } else if (rand==2) {
                        minrare="uncommon";
                    } else if (rand==3) {
                        minrare="rare";
                    } else if (rand==4) {
                        minrare=maxrare;
                    }
                } else if (maxrare=="legendary") {
                    let rand=randomInteger(5);
                    if (rand==1) {
                        minrare="common";
                    } else if (rand==2) {
                        minrare="uncommon";
                    } else if (rand==3) {
                        minrare="rare";
                    } else if (rand==4) {
                        minrare="very rare";
                    } else if (rand==5) {
                        minrare=maxrare;
                    }
                }
            }
        }
        rarity.push(minrare);
        rarity.push(maxrare);
        return rarity;
    },

    resetInv = function(store) {
        //Reset a Store's Inventory
        let shop=state.store.find(s => s.name==store);
        shop.inv=[];
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                state.store[i].inv=shop.inv;
            }
        }
        sendChat("Item Store","/w gm Inventory of Store \""+store+"\" has been reset!");
    },

    editStore = function(store,attr,val) {
        //Edit Store Settings
        store=state.store.find(s => s.name==store);
        let num;
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                switch (attr) {
                    case 'name':
                        sendChat("Item Store","/w gm Changed Name of Store \""+store.name+"\"<br><b>Old:</b> "+store.name+"<br><b>New:</b> "+val);
                        state.store[i].name=val;
                    break;
                    case 'hdc':
                        sendChat("Item Store","/w gm Changed Haggle DC of Store \""+store.name+"\"<br><b>Old:</b> "+String(store.hdc)+"<br><b>New:</b> "+val);
                        state.store[i].hdc=Number(val);
                    break;
                    case 'cprice':
                        sendChat("Item Store","/w gm Changed Price Change % of Store \""+store.name+"\"<br><b>Old:</b> "+String(store.cprice)+"<br><b>New:</b> "+val);
                        state.store[i].cprice=Number(val);
                    break;
                    case 'active':
                        if (val=="true" || val==true) {
                            sendChat("Item Store","/w gm Activated Store \""+store.name+"\"");
                        } else if (val=="false" || val==false) {
                            sendChat("Item Store","/w gm Deactivated Store \""+store.name+"\"");
                        }
                        state.store[i]=Boolean(val);
                    break;
                }
            }
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
        
    },

    shopMenu = function(store,cart,charid,msg) {
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
        
    },

    addToCart = function(cart,store,item,amount,msg) {
        //Add Items to a Shopping Cart
        cart=state.cart.find(c => c.name==cart);
        
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
            checkCarts();
            cartMenu(cart[0].name,msg);
        }
    },
    
    purchase = function(type,cart,amount,store,charident,msg) {
        //Purchase either individual Item or a bunch of Items from a cart.
        
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
        
    },

    haggle = function(store,item,charident,amount,skill,msg) {
        //Negotiate Price based on Skillchecks
        store=state.store.find(s => s.name==store);
        item=store.inv.find(i => i.name==item);
        
    },
    
    resetStore = function(store) {
        for (let i=0;i<state.store.length;i++) {
            if (state.store[i].name==store) {
                state.store[i]={
                    name: `${store}`,
                    inv: [],
                    hdc: 10,
                    cprice: 0,
                    active: true
                }
            }
        }
        sendChat("Item Store",`/w gm Store \"${store}\" has been reset to its defaults!`);
    },
    
    resetCarts = function() {
        setCartDefaults();
        sendChat("Item Store","/w gm Reset all Carts!");
    },
    
    checkInstall = function() {
        if (!state.store) {
            setDefaults();
        }
        if (!state.basics) {
            setBasics();
        }
        if (!state.cart) {
            setCartDefault();
        }
        if (!state.list) {
            setItemDefaults();
        }
    },
    
    checkStores = function() {
        //Checks if each Store has a Handout
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        
    },
    
    checkCarts = function() {
        //Checks if each Cart has a Handout
        var tablestyle ='style="text-align:center; font-size: 12px; width: 100%;"';
        let cartList=state.cart;
        
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