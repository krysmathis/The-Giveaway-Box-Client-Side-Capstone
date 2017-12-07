module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended","plugin:angular/johnpapa"],
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
        // "angular/controller-as":
        // ["warn"],
        // "angular/controller-name": [
        //     "warn"
        // ],
        // "angular/controller-as-route": [
        //     "none"
        // ],
        "no-undef": [
            "warn"
        ],
        "angular/file-name": [
            "none"
        ],
        "angular/module-setter": [
            "none"
        ]
        
    },
    "globals": {
        "moment": true,
        "exports": true,
        "angular": true
    }
    
    
};