/*
Item Store Generator for D&D 5e
Original created by Kirsty (https://app.roll20.net/users/1165285/kirsty)
Updated Version by Julexar (https://app.roll20.net/users/9989180/julexar)

API Commands:
*/

class ItemStore {
    "use strict";
    constructor() {};

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
                                sendChat("Item Store", `/w gm Incorrect usage!%NEWLINE%%NEWLINE%The correct usage is:%NEWLINE%<span ${state.style.span}>!store --create --name {Insert Name}</span>`);
                            } else {
                                args[2] = args[2].replace("create ","");
                                if (args[2]=="" || args[2]==" ") {
                                    sendChat("Item Store", "/w gm Please define a Name for the Store you wish to create!");
                                } else {
                                    
                                }
                            }
                        return;
                        case "store":

                        return;
                    }
                return;
            }
        }
        switch (args[0]) {
            case "!shop":

            return;
            case "!cart":

            return;
            case "!checkout":

            return;
        }
    };
    
    checkInstall() {
        if (!state.store) {
            setDefaults();
        }
        if (!state.default) {
            setBasics();
        }
        if (!state.style) {
            setStyles();
        }
        if (!state.cart) {
            setCartDefaults();
        }
        if (!state.list) {
            setItemDefaults();
        }
    }

    checkStores() {
        log("Item Store - Checked Stores!");
    };

    checkCarts() {
        log("Item Store - Checked Carts!");
    };

    registerEventHandlers() {
        on("chat:message", this.handleInput);
        log("Item Store - Registered Event Handlers!");
    };
}

function setDefaults() {
    state.store = [];
    log("Item Store - Successfully set Store defaults!");
};

function setBasics() {
    state.default = {
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
    log("Item Store - Successfully registered basics!");
};

function setStyles() {
    state.style = {
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
    log("Item Store - Successfully registered Styles!");
};

function setCartDefaults() {
    state.cart = [];
    log("Item Store - Successfully set Cart defaults!");
};

function setItemDefaults() {
};

function storeMenu(store) {
    sendChat("Item Store", "/w gm Coming soon!");
};

const store = new ItemStore();

on("ready", () => {
    "use strict";
    store.checkInstall()
    store.checkStores();
    store.checkCarts();
    store.registerEventHandlers();
});