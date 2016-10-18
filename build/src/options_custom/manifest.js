// SAMPLE
this.manifest = {
    "name": "NeatTabs",
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("sessions"),
            "group": i18n.get("saved-sessions"),
            "name": "save",
            "label": i18n.get("Save All Open Tabs"),
            "text": i18n.get("save"),
            "type": "button"
        },
        {
            "tab": i18n.get("sessions"),
            "group": i18n.get("saved-sessions"),
            "name": "restore",
            "label": i18n.get("Restore Previous Session"),
            "text": i18n.get("restore"),
            "type": "button"
        },
        {
            "tab": i18n.get("sessions"),
            "group": i18n.get("saved-sessions"),
            "name": "sessions",
            "label": i18n.get("saved-user-sessions"),
            "type": "listBox"
        },
        {
            "tab": i18n.get("analytics"),
            "group": i18n.get("popular-domains"),
            "name": "analytics",
            "label": i18n.get("most-visited"),
            "type": "listBox"
        },
        {
            "tab": i18n.get("options"),
            "group": i18n.get("preferences"),
            "name": "options",
            "label": i18n.get("extension-settings"),
            "type": "listBox"
        },
        {
            "tab": i18n.get("about"),
            "group": i18n.get("who"),
            "name": "who",
            "label": i18n.get("what"),
            "type": "description",
            "text": i18n.get("description1")
        },
        {
            "tab": i18n.get("about"),
            "group": i18n.get("what"),
            "name": "what",
            "label": i18n.get("what"),
            "type": "description",
            "text": i18n.get("description2")
        },
        {
            "tab": i18n.get("about"),
            "group": i18n.get("why"),
            "name": "why",
            "label": i18n.get("what"),
            "type": "description",
            "text": i18n.get("description3")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username"),
            "text": i18n.get("x-characters")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "password",
            "type": "text",
            "label": i18n.get("password"),
            "text": i18n.get("x-characters-pw"),
            "masked": true
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "myDescription",
            "type": "description",
            "text": i18n.get("description")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("logout"),
            "name": "myCheckbox",
            "type": "checkbox",
            "label": i18n.get("enable")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("logout"),
            "name": "myButton",
            "type": "button",
            "label": i18n.get("disconnect"),
            "text": i18n.get("logout")
        },
        {
            "tab": "Details",
            "group": "Sound",
            "name": "noti_volume",
            "type": "slider",
            "label": "Notification volume:",
            "max": 1,
            "min": 0,
            "step": 0.01,
            "display": true,
            "displayModifier": function (value) {
                return (value * 100).floor() + "%";
            }
        },
        {
            "tab": "Details",
            "group": "Sound",
            "name": "sound_volume",
            "type": "slider",
            "label": "Sound volume:",
            "max": 100,
            "min": 0,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + "%";
            }
        },
        {
            "tab": "Details",
            "group": "Food",
            "name": "myPopupButton",
            "type": "popupButton",
            "label": "Soup 1 should be:",
            "options": {
                "groups": [
                    "Hot", "Cold",
                ],
                "values": [
                    {
                        "value": "hot",
                        "text": "Very hot",
                        "group": "Hot",
                    },
                    {
                        "value": "Medium",
                        "group": 1,
                    },
                    {
                        "value": "Cold",
                        "group": 2,
                    },
                    ["Non-existing"]
                ],
            },
        },
        {
            "tab": "Details",
            "group": "Food",
            "name": "myListBox",
            "type": "listBox",
            "label": "Soup 2 should be:",
            "options": [
                ["hot", "Hot and yummy"],
                ["cold"]
            ]
        },
        {
            "tab": "Details",
            "group": "Food",
            "name": "myRadioButtons",
            "type": "radioButtons",
            "label": "Soup 3 should be:",
            "options": [
                ["hot", "Hot and yummy"],
                ["cold"]
            ]
        }
    ],
    "alignment": [
        [
            "username",
            "password"
        ],
        [
            "noti_volume",
            "sound_volume"
        ],
        [
            "save",
            "restore"
        ]
    ]
};
