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
                    url: `https://${firebasePath}/users/${key}/.json`
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
                        url: `https://${firebasePath}/users/.json`,
                        data: user
                    })
                })
            }
        },
        "fire": {
            value: function (employee,key) {
                return $http({
                    method: "PUT",
                    url: `https://${firebasePath}/users/${key}/.json`,
                    data: {
                        "firstName": employee.firstName,
                        "lastName": employee.lastName,
                        "employmentStart": employee.employmentStart,
                        "employmentEnd": Date.now()
                    }
                })
            }
        },
        "kill": {
            value: function (key) {
                return $http({
                    method: "DELETE",
                    url: `https://${firebasePath}/users/${key}/.json`
                })
            }
        },
        "resetEmployment":  {
            value: function (employee,key) {
                return $http({
                    method: "PUT",
                    url: `https://${firebasePath}/users/${key}/.json`,
                    data: {
                        "firstName": employee.firstName,
                        "lastName": employee.lastName,
                        "employmentStart": employee.employmentStart,
                        "employmentEnd": 0
                    }
                })
            }
        },
        "find": {
            value: function (searchString) {
                const result = this.cache.find(employee => {
                    return employee.firstName.includes(searchString) ||
                            employee.lastName.includes(searchString)
                })
                return result;
            },
            enumerable: true
        }
    })
})