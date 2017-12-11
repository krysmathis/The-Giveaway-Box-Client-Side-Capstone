"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("InviteFactory", function ($http) {

    return Object.create(null, {
        "getInviteCode": {
            value: function (request) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                    // add the userId as a property
                        return $http({
                            method: "POST",
                            url: `https://${firebasePath}/invitesCodes/.json?auth=${idToken}`,
                            data: request
                        }).then(r => {
                            const id = r.data.name
                            return id
                        })
            })
            }
        },
        "setGroupInviteCodes": {
            value: function(inviteCode, groups) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {
                    groups.forEach(g=> {
                    $http({
                        method: "POST",
                        url: `https://${firebasePath}/inviteGroups/.json?auth=${idToken}`,
                        data: { groupId: g.groupId, groupName: g.name, inviteCode: inviteCode }
                        })
                    })
                })
            },
            enumerable: true
        }
    })

})