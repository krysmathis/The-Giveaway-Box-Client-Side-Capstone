/**
 * 
MOMS Club of East Nashville - Eastwood

MOMS Club of East Nashville-Inglewood

MOMS Club of East Nashville-Lockeland

MOMS Club of East Nashville-Rosebank
 */

"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("GroupsFactory", function ($http) {

    const _seedGroups = [
        {name: "MOMS Club of East Nashville - Eastwood"},
        {name: "MOMS Club of East Nashville-Inglewood"},
        {name: "MOMS Club of East Nashville-Lockeland"},
        {name: "MOMS Club of East Nashville-Rosebank"}
    ]

    return Object.create(null, {
        // create the initial list of groups
        "seedGroups": {
            value: function() {
                _seedGroups.forEach(sg => {
                    firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                        // add the userId as a property
                        return $http({
                            method: "POST",
                            url: `https://${firebasePath}/groups/.json?auth=${idToken}`,
                            data: sg
                        })
                    })
                })
            },
            enumerable: true
        },
        "getUsersGroups": {
            value: function(userId) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/userGroups/.json?orderBy="userId"&equalTo="${userId.uid}"`
                }).then(r => {
                    const data = r.data
                    return Object.keys(data).map(key => {
                        const groupObj = {}
                        groupObj.name = data[key].groupName,
                        groupObj.groupId = data[key].groupId,
                        groupObj.id = key
                        //data[key].id = key
                        return groupObj
                    })
                })
            },
            enumerable: true
        },
        "getGroupsFromInvite": {
            value: function(inviteCode) {
                return $http({
                    method: "GET",
                    //${firebaseURL}/.json?orderBy="userId"&equalTo="${UID}"
                    url: `https://${firebasePath}/inviteGroups/.json?orderBy="inviteCode"&equalTo="${inviteCode}"`
                }).then(r=> {
                     const data = r.data
                     // Make an array of objects so we can use filters
                     return Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                })
            },
            enumerable: true
        },
        "joinGroup": {
            value: function(user, userGroup) {

                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        userGroup.userId = user.uid
                        // add the userId as a property
                        return $http({
                            method: "POST",
                            url: `https://${firebasePath}/userGroups/.json?auth=${idToken}`,
                            data: userGroup
                    })
                })
            }
        }
    })

})