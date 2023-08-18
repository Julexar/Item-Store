/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:
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
    span: 'style="display: inline; width: 10px; height: 10px; padding: 1px; border: 1px solid black; background-color: white;"'
};

const defaults = {
    typeList: "Weapon|Armor|Scroll|Potion|Misc|Random",
    rareList: "Common|Uncommon|Rare|Very Rare|Legendary|Random",
    item: {
        name: "",
        desc: "",
        mods: "",
        props: "",
        price: 0,
        weight: 0,
        amount: 1,
        bundle: 1
    },
    used: false
};

const items = {
    weapon: [
        {
            name: "Club",
            desc: "Club;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 5 ft",
            props: "Light",
            rarity: "common",
            price: 0.1,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Dagger",
            desc: "Dagger;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60",
            props: "Finesse, Light, Thrown",
            rarity: "common",
            price: 2,
            weight: 1,
            amount: 1,
            bundle: 1
        },
        {
            name: "Greatclub",
            desc: "Greatclub;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft",
            props: "Two-Handed",
            rarity: "common",
            price: 0.2,
            weight: 10,
            amount: 1,
            bundle: 1
        },
        {
            name: "Handaxe",
            desc: "Handaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 20/60",
            props: "Light, Thrown",
            rarity: "common",
            price: 5,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Javelin",
            desc: "Javelin;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120",
            props: "Thrown",
            rarity: "common",
            price: 0.5,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Light Hammer",
            desc: "Light Hammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 20/60",
            props: "Light, Thrown",
            rarity: "common",
            price: 2,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Mace",
            desc: "Mace;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Range: 5 ft",
            props: "",
            rarity: "common",
            price: 5,
            weight: 4,
            amount: 1,
            bundle: 1
        },
        {
            name: "Quarterstaff",
            desc: "Quarterstaff;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: bludgeoning, Alternate Damage: 1d8, Alternate Damage Type: bludgeoning, Range: 5 ft",
            props: "Versatile",
            rarity: "common",
            price: 0.2,
            weight: 4,
            amount: 1,
            bundle: 1
        },
        {
            name: "Sickle",
            desc: "Sickle;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 5 ft",
            props: "Light",
            rarity: "common",
            price: 1,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Spear",
            desc: "Spear;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60",
            props: "Thrown, Versatile",
            rarity: "common",
            price: 1,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Light Crossbow",
            desc: "Light Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 80/320",
            props: "Ammunition, Loading, Two-Handed",
            rarity: "common",
            price: 25,
            weight: 5,
            amount: 1
        },
        {
            name: "Dart",
            desc: "Dart;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d4, Damage Type: piercing, Range: 20/60",
            props: "Finesse, Thrown",
            rarity: "common",
            price: 0.05,
            weight: 0.25,
            amount: 1,
            bundle: 1
        },
        {
            name: "Shortbow",
            desc: "Shortbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 80/320",
            props: "Ammunition, Two-Handed",
            rarity: "common",
            price: 25,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Sling",
            desc: "Sling;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d4, Damage Type: bludgeoning, Range: 30/120",
            props: "Ammunition",
            rarity: "common",
            price: 0.1,
            weight: 0,
            amount: 1,
            bundle: 1
        },
        {
            name: "Battleaxe",
            desc: "Battleaxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft",
            props: "Versatile",
            rarity: "common",
            price: 10,
            weight: 4,
            amount: 1,
            bundle: 1
        },
        {
            name: "Flail",
            desc: "Flail;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Range: 5 ft",
            props: "",
            rarity: "common",
            price: 10,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Glaive",
            desc: "Glaive;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft",
            props: "Heavy, Reach, Two-Handed",
            rarity: "common",
            price: 20,
            weight: 6,
            amount: 1,
            bundle: 1
        },
        {
            name: "Greataxe",
            desc: "Greataxe;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Wepaon, Damage: 1d12, Damage Type: slashing, Range: 5 ft",
            props: "Heavy, Two-Handed",
            rarity: "common",
            price: 30,
            weight: 7,
            amount: 1,
            bundle: 1
        },
        {
            name: "Greatsword",
            desc: "Greatsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 2d6, Damage Type: slashing, Range: 5 ft",
            props: "Heavy, Two-Handed",
            rarity: "common",
            price: 50,
            weight: 6,
            amount: 1,
            bundle: 1
        },
        {
            name: "Halberd",
            desc: "Halberd;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: slashing, Range: 10 ft",
            props: "Heavy, Reach, Two-Handed",
            rarity: "common",
            price: 20,
            weight: 6,
            amount: 1,
            bundle: 1
        },
        {
            name: "Lance",
            desc: "Lance;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d12, Damage Type: piercing, Range: 10 ft",
            props: "Reach, Special",
            rarity: "common",
            price: 10,
            weight: 6,
            amount: 1,
            bundle: 1
        },
        {
            name: "Longsword",
            desc: "Longsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: slashing, Alternate Damage: 1d10, Alternate Damage Type: slashing, Range: 5 ft",
            props: "Versatile",
            rarity: "common",
            price: 15,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Maul",
            desc: "Maul;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 2d6, Damage Type: bludgeoning, Range: 5 ft",
            props: "Heavy, Two-Handed",
            rarity: "common",
            price: 10,
            weight: 10,
            amount: 1,
            bundle: 1
        },
        {
            name: "Morningstar",
            desc: "Morningstar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
            props: "",
            rarity: "common",
            price: 15,
            weight: 4,
            amount: 1,
            bundle: 1
        },
        {
            name: "Pike",
            desc: "Pike;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d10, Damage Type: piercing, Range: 10 ft",
            props: "Heavy, Reach, Two-Handed",
            rarity: "common",
            price: 5,
            weight: 18,
            amount: 1
        },
        {
            name: "Rapier",
            desc: "Rapier;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
            props: "Finesse",
            rarity: "common",
            price: 25,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Scimitar",
            desc: "Scimitar;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft",
            props: "Finesse, Light",
            rarity: "common",
            price: 25,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Shortsword",
            desc: "Shortsword;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: slashing, Range: 5 ft",
            props: "Finesse, Light",
            rarity: "common",
            price: 10,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Trident",
            desc: "Trident;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d6, Damage Type: piercing, Alternate Damage: 1d8, Alternate Damage Type: piercing, Range: 20/60",
            props: "Thrown, Versatile",
            rarity: "common",
            price: 5,
            weight: 4,
            amount: 1,
            bundle: 1
        },
        {
            name: "War Pick",
            desc: "War Pick;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: piercing, Range: 5 ft",
            props: "",
            rarity: "common",
            price: 5,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Warhammer",
            desc: "Warhammer;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d8, Damage Type: bludgeoning, Alternate Damage: 1d10, Alternate Damage Type: bludgeoning, Range: 5 ft",
            props: "Versatile",
            rarity: "common",
            price: 15,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Whip",
            desc: "Whip;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Melee Weapon, Damage: 1d4, Damage Type: slashing, Range: 10 ft",
            props: "Finesse, Reach",
            rarity: "common",
            price: 2,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Blowgun",
            desc: "Blowgun;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1, Damage Type: piercing, Range: 25/100",
            props: "Ammunition, Loading",
            rarity: "common",
            price: 10,
            weight: 1,
            amount: 1,
            bundle: 1
        },
        {
            name: "Hand Crossbow",
            desc: "Hand Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d6, Damage Type: piercing, Range: 30/120",
            props: "Ammunition, Light, Loading",
            rarity: "common",
            price: 75,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Heavy Crossbow",
            desc: "Heavy Crossbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d10, Damage Type: piercing, Range: 100/400",
            props: "Ammunition, Heavy, Loading, Two-Handed",
            rarity: "common",
            price: 50,
            weight: 18,
            amount: 1,
            bundle: 1
        },
        {
            name: "Longbow",
            desc: "Longbow;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Damage: 1d8, Damage Type: piercing, Range: 150/600",
            props: "Ammunition, Heavy, Two-Handed",
            rarity: "common",
            price: 50,
            weight: 2,
            amount: 1,
            bundle: 1
        },
        {
            name: "Net",
            desc: "Net;Proficiency with this Weapon allows you to add your proficiency bonus to the attack roll for any attack you make with it.",
            mods: "Item Type: Ranged Weapon, Range: 5/15",
            props: "Thrown, Special",
            rarity: "common",
            price: 1,
            weight: 3,
            amount: 1,
            bundle: 1
        },
        {
            name: "Arrows",
            desc: "Arrows;Arrows are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
            mods: "Item Type: Ammunition",
            props: "",
            rarity: "common",
            price: 1,
            weight: 0.05,
            amount: 1,
            bundle: 20
        },
        {
            name: "Blowgun needles",
            desc: "Blowgun needles;Blowgun needles are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
            mods: "Item Type: Ammunition",
            props: "",
            rarity: "common",
            price: 1,
            weight: 0.02,
            amount: 1,
            bundle: 50
        },
        {
            name: "Crossbow bolts",
            desc: "Crossbow bolts;Crossbow bolts are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
            mods: "Item Type: Ammunition",
            props: "",
            rarity: "common",
            price: 1,
            weight: 0.075,
            amount: 1,
            bundle: 20
        },
        {
            name: "Sling bullets",
            desc: "Sling bullets;Sling bullets are used with a weapon that has the ammunition property to make a ranged attack. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield.",
            mods: "Item Type: Ammunition",
            props: "",
            rarity: "common",
            price: 0.04,
            weight: 0.075,
            amount: 1,
            bundle: 20
        }
    ],
    armor: [
        {
            name: "Padded Armor",
            desc: "Padded Armor;Padded armor consists of quilted layers of cloth and batting.",
            mods: "Item Type: Light Armor, AC: 11, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 5,
            weight: 8,
            amount: 1,
            bundle: 1
        },
        {
            name: "Leather Armor",
            desc: "Leather Armor;The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.",
            mods: "Item Type: Light Armor, AC: 11",
            props: "",
            rarity: "common",
            price: 10,
            weight: 10,
            amount: 1,
            bundle: 1
        },
        {
            name: "Studded Leather",
            desc: "Studded Leather Armor;Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.",
            mods: "Item Type: Light Armor, AC: 12",
            props: "",
            rarity: "common",
            price: 45,
            weight: 13,
            amount: 1,
            bundle: 1
        },
        {
            name: "Hide",
            desc: "Hide;This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, and other folk who lack access to the tools and materials needed to create better armor.",
            mods: "Item Type: Medium Armor, AC: 12",
            props: "",
            rarity: "common",
            price: 10,
            weight: 12,
            amount: 1,
            bundle: 1
        },
        {
            name: "Chain Shirt",
            desc: "Chain Shirt;Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armor offers modest protection to the wearer\'s upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers.",
            mods: "Item Type: Medium Armor, AC: 13",
            props: "",
            rarity: "common",
            price: 50,
            weight: 20,
            amount: 1,
            bundle: 1
        },
        {
            name: "Scale Mail",
            desc: "Scale Mail;This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish. The suit includes gauntlets.",
            mods: "Item Type: Medium Armor, AC: 14, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 50,
            weight: 45,
            amount: 1,
            bundle: 1
        },
        {
            name: "Breastplate",
            desc: "Breastplate;This armor consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armor provides good protection for the wearer\'s vital organs while leaving the wearer relatively unencumbered.",
            mods: "Item Type: Medium Armor, AC: 14",
            props: "",
            rarity: "common",
            price: 400,
            weight: 20,
            amount: 1,
            bundle: 1
        },
        {
            name: "Half Plate",
            desc: "Half Plate;Half plate consists of shaped metal plates that cover most of the wearer\'s body. It does not include leg protection beyond simple greaves that are attached with leather straps.",
            mods: "Item Type: Medium Armor, AC: 15, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 750,
            weight: 40,
            amount: 1,
            bundle: 1
        },
        {
            name: "Ring Mail",
            desc: "Ring Mail;This armor is leather armor with heavy rings sewn into it. The rings help reinforce the armor against blows from swords and axes. Ring mail is inferior to chain mail, and it\'s usually worn only by those who can\'t afford better armor.",
            mods: "Item Type: Heavy Armor, AC: 14, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 30,
            weight: 40,
            amount: 1,
            bundle: 1
        },
        {
            name: "Chain Mail",
            desc: "Chain Mail;Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.",
            mods: "Item Type: Heavy Armor, AC: 16, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 75,
            weight: 55,
            amount: 1,
            bundle: 1
        },
        {
            name: "Splint Mail",
            desc: "Splint Mail;This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.",
            mods: "Item Type: Heavy Armor, AC: 17, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 200,
            weight: 60,
            amount: 1,
            bundle: 1
        },
        {
            name: "Plate Armor",
            desc: "Plate Armor;Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armor. Buckles and straps distribute the weight over the body.",
            mods: "Item Type: Heavy Armor, AC: 18, Stealth:Disadvantage",
            props: "",
            rarity: "common",
            price: 1500,
            weight: 65,
            amount: 1,
            bundle: 1
        },
        {
            name: "Shield",
            desc: "Shield;A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2. You can benefit from only one shield at a time.",
            mods: "Item Type: Shield, AC +2",
            props: "",
            rarity: "common",
            price: 10,
            weight: 6,
            amount: 1,
            bundle: 1
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1,
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
            bundle: 1
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
};

class ItemStore {
    "use strict";
    
    constructor() {
        this.style = styles;
        this.default = defaults;
        this.list = state.store;
        this.items = items;
    };
    
    handleInput(msg) {
        let args = msg.content.split(/\s+--/);
        if (msg.type!=="api") return;

        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case "!store":
                    switch (args[1]) {
                        case undefined:
                            storeMenu();
                        return;
                        case "create":
                            if (!args[2]) {
                                sendChat("Item Store", `/w gm Incorrect usage!%NEWLINE%%NEWLINE%The correct usage is:%NEWLINE%<span ${store.style.span}>!store --create --name {Insert Name}</span>`);
                            } else {
                                args[2] = args[2].replace("create ","");
                                const store = {
                                    name: args[2]
                                };
                                if (args[2]=="" || args[2]==" ") {
                                    sendChat("Item Store", "/w gm Please define a Name for the Store you wish to create!");
                                } else {
                                    createStore(store);
                                    storeMenu(store);
                                }
                            }
                        return;
                        case "store":
                            const store = {
                                name: args[2].replace("store ", "")
                            };
                            switch (args[3]) {
                                case "inv view":
                                    if (!args[4]) {
                                        itemMenu(store);
                                    } else if (args[4].includes("item")) {
                                        let it = args[4].replace("item ","");
                                        const item = {
                                            id: null,
                                            name: null
                                        };
                                        if (Number(it)) {
                                            item.id = Number(it);
                                        } else {
                                            item.name = it;
                                        }
                                        itemMenu(store, item);
                                    }
                                return;
                                case "inv edit":
                                    
                                return;
                                case "inv gen" || "inv generate":

                                return;
                                case "inv reset":

                                return;
                                case "show" || "players":

                                return;
                                case "setname":

                                return;
                                case "sethdc":

                                return;
                                case "inf" || "inflate":

                                return;
                                case "def" || "deflate":

                                return;
                                case "act" || "activate":

                                return;
                                case "deact" || "deactivate":

                                return;
                                case "del" || "delete":

                                return;
                            }
                        return;
                    }
                return;
                case "!item":

                return;
                case "!haggle":

                return;
            }
        }
        switch (args[0]) {
            case "!shop":

            return;
        }
    };
    
    checkInstall() {
        if (!state.store) {
            setDefaults();
        }
    };

    checkStores() {
        log("Item Store - Checked Stores!");
    };

    registerEventHandlers() {
        on("chat:message", this.handleInput);
        log("Item Store - Registered Event Handlers!");
    };
}

const store = new ItemStore();

function setDefaults() {
    state.store = [];
    store.list = [];
    log("Item Store - Successfully registered defaults!");
};

function storeMenu(store = []) {
    sendChat("Item Store", "/w gm Coming soon!");
};

function createStore(store = []) {
    sendChat("Item Store", "/w gm Coming soon!");
};

function itemMenu(store = [], item = []) {
    sendChat("Item Store", "/w gm Coming soon!");
};

on("ready", () => {
    "use strict";
    store.checkInstall()
    store.checkStores();
    store.registerEventHandlers();
});