module.exports = {
    "extends": "airbnb-base",
    "globals": {
        "__dirname": false
    },"env": {
        "mocha": true,
        "node": true
      },
      "rules": {
        "prefer-destructuring": ["error", {"object": false}]
      }
};