var React = null;

module.exports = {
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
         "no-unused-vars": [
             "error",
             {
                 "vars": "all",
                 "args": "none"
             }
         ],
        "no-multiple-empty-lines": [
            "warn",
            {
                "max": 1,
                "maxBOF": 0,
                "maxEOF": 1,
            }

        ],
        "react/prop-types": [
          "off"
        ],
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "warn",
            "always"
        ]
    }
};
