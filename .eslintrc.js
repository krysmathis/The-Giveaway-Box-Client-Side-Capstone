module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "no-console": [
            "warn"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "angular/controller-as":
        ["off"],
        "angular/controller-name": [
            "off"
        ],
        "angular/controller-as-route": [
            "off"
        ],
        "no-undef": [
            "warn"
        ],
        "angular/file-name": [
            "off"
        ],
        "angular/module-setter": [
            "off"
        ]
        
    },
    "globals": {
        "moment": true,
        "exports": true,
        "angular": true
    }
    
    
};