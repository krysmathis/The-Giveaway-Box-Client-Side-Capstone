angular
.module("TheGiveawayBoxApp")
.factory("UserFactory", function ($http, AuthFactory) {

    const firebasePath = "the-giveaway-box-app.firebaseio.com"
    
    return Object.create(null, {
        "cache": {
            value: [],
            enumerable: true,
            writable: true
        },
        "get": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/users/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.cache = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log(this.cache);
                    return this.cache;
                })
            }
        },
        "singleUser": {
            value: function (key) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/users/.json?orderBy="userId"&equalTo="${key}"`
                }).then(r=> {
                    const data = r.data
                    return Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                })
            }
        },
        "add": {
            value: function (user) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    // add the userId as a property
                    user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/users/.json?auth=${idToken}`,
                        data: user
                    })
                })
            }
        },
        "update": {
            value: function (record, id) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    // add the userId as a property
                    return $http({
                        method: "PUT",
                        url: `https://${firebasePath}/users/${id}.json?auth=${idToken}`,
                        data: record
                    })
                })
            }
        },
        
    })
})