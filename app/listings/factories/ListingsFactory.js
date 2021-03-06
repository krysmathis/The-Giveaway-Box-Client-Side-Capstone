"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("ListingsFactory", function ($http) {
    
    return Object.create(null,{
        
        "listings": {
            value: [],
            enumerable: true,
            writable: true
        },
        "itemAttributes": {
            value: [],
            enumerable: true,
            writable: true
        },

        "displayListing": {
            value: "",
            enumerable: true,
            writable: true
        },
        "attributes": {
            value: [],
            enumerable: true,
            writable: true
        },
       
        "tags": {
            value: [],
            enumerable: true,
            writable: true
        },
        "userGroups":{
            value: [],
            enumerable: true,
            writable: true
        },
        "approvedUsers": {
            value: [],
            enumerable: true,
            writable: true
        },
        "updateApprovedUsers": {
            value: function(groups) {
                this.approvedUsers = []
                groups.forEach(g=> {
                    this.userGroups.filter(ug=> ug.groupId === g.groupId)
                    .forEach(ug => {
                        if (this.approvedUsers.indexOf(ug.userId) == -1) {
                            this.approvedUsers.push(ug.userId);
                        }
                    })
                })
            },
            enumerable: true
        },
        "getApprovedUsers": {
            value: function(user) {
                
                return $http({
                    url: `https://${firebasePath}/userGroups/.json`,
                    method: "GET"
                }).then(r => {
                    const data = r.data
                    
                        // Make an array of objects so we can use filters
                        this.userGroups = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]    
                        })

                        const activeGroups = this.userGroups.filter(g=> user.uid === g.userId)
                        this.updateApprovedUsers(activeGroups)
                    
                    return this.approvedUsers
                })
            },
            enumerable: true
        },
        // 1. First retrieve the record from the database
        // 2. Then update the item attributes for the retrieved record
        // 3. Update the cached version of the item
        // 4. Update the database with the modified item
        // Parameters:
        // listingId = the Id # from the listing record
        // user = the current use
        "purchase": {
            value: function(listingId, user) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/${listingId}.json`
                }).then(response => {
                    const item = response.data

                    // update item values based on what we're modifying
                    item.buyer = user.uid
                    item.buyerEmail = user.email
                    item.requestedDate = Date.now()

                    // update the cached listings
                    const cachedItem = this.listings.find(l=> l.id === listingId)
                    cachedItem.buyer = user.uid
                    cachedItem.requestedDate = Date.now()
                    cachedItem.buyerEmail = user.email
                    
                    // update the record in the database
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `https://${firebasePath}/itemListings/${listingId}.json?auth=${idToken}`,
                                data: item
                            })
                        })

                })
            },
            enumerable: true
        },
        
        // 1. First retrieve the record from the database
        // 2. Then update the item attributes for the retrieved record
        // 3. Update the cached version of the item
        // 4. Update the database with the modified item
        "closeListing":{
            value: function(listingId) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/${listingId}.json`
                }).then(response => {
                    const item = response.data
                    // update item values based on what we're modifying
                    item.purchaseCompletedOn = Date.now()
                    
                    // update the cached item
                    const cachedListing = 
                        this.listings
                            .find(l=> l.id === listingId)
                            
                    if (cachedListing) {
                        cachedListing.purchaseCompletedOn = Date.now()
                    }
                    
                    // update the item in the database
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `https://${firebasePath}/itemListings/${listingId}.json?auth=${idToken}`,
                                data: item
                            })
                        })
                })
            },
            enumerable: true
        },
        "addAttributeLabels": {
            value: function(item,database) {
                if (item.hasOwnProperty("attributes")){
                    item.attributes.forEach(a=> {
                        const matchingAttribute = database.attributes.find(attr=> attr.externalId === a.attributeId)
                        if (matchingAttribute !== undefined) {
                            a.attributeName = matchingAttribute.label
                        }
                    })
                }
                return item
            },
            enumerable: true
        },
        "addTags": {
            value: function(item) {
                item.tags = this.tags.filter(t=> t.listingId === item.id)
                return item
            }, 
            enumerable: true
        },
        "extractStreetFromUserAddress": {
            value: function(user) {
                try {
                    let re = /^\d+\w*\s*(?:[\-\/]?\s*)?\d*\s*\d+\/?\s*\d*\s*/;
                    let address = user.address
                    let number = address.match(re)
                    let street = address.split(number[0])[1]
                    return street
                } catch(err) {
                    return user.address.split(" ")[1]
                }
            },
            enumerable: true
        },
        // This function breaks up the calculation of additional properties
        // on the listing that do not involve pulling data from the database
        // This applies the rules that enrich the listing.
        // Parameters:
        // listing: One listing returned from the database
        // database: master data with all categories and subcategories 
        "addAdditionalData": {
            value: function(listing,database) {
                
                // pricing
                if (!listing.price > 0) { listing.price = "FREE"}

                // user data
                listing.user = database.users.find(u=> u.userId === listing.userId)
                listing.user.street = this.extractStreetFromUserAddress(listing.user)

                // category / subCategory data
                listing.category = database.categories.find(c=> listing.categoryExternalId === c.externalId)
                listing.subCategory = database.subCategories.find(s=> listing.subCategoryExternalId === s.externalId)
                
                // expiration date
                if (listing.hasOwnProperty("expirationDate")) {
                    listing.expiresInDays = moment(listing.expirationDate).diff(moment(),"days")
                } else {
                    listing.expiresInDays = 90
                }

                return listing
            },
            enumerable: true
        },
        "getListings": {
            value: function(database) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/.json`
                    
                }).then(response => {
                    
                    const data = response.data
                    // Make an array of objects so we can use filters
                    const _listings =  Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]    
                        })
                    
                    if (this.approvedUsers.length > 0) {
                        this.listings = _listings.filter(l=> {
                            return this.approvedUsers.findIndex(x=> x === l.userId) > -1
                        })
                    } else {
                        this.listings = _listings
                    }

                    this.listings.map(l=> {
                        return this.addAdditionalData(l,database)
                    })

                    return this.listings
                         
                    })
            },
            enumerable: true,
        },
        "getTags": {
            value: function () {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/tags/.json`
                }).then(response => {
                    const data = response.data

                    // Make an array of objects so we can use filters
                    this.tags = Object.keys(data).map(key => {
                        data[key].id = key
                        return data[key]
                    })
                    console.log("tags", this.tags);
                    return this.tags
                })
            },
        },
        "getCurrentUserListings":{
            value: function(user) {
                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/itemListings/.json?orderBy="userId"&equalTo="${user.uid}"`
                    }).then(response => {
                        const data = response.data
                            // Make an array of objects so we can use filters
                            return Object.keys(data).map(key => {
                                data[key].id = key
                                return data[key]    
                            })
                    })
            }, enumerable: true
        },
        "getSingleListing":{
            value: function(listingId) {
                    return $http({
                        method: "GET",
                        url: `https://${firebasePath}/itemListings/${listingId}/.json`
                    }).then(response => {
                        const data = response.data
                        data.id = listingId
                            // Make an array of objects so we can use filters
                            return data
                    })
            }, enumerable: true
        },
        "deleteListing": {
            value: function(listingId) {
                if (listingId) {
                    return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $http({
                            method: "DELETE",
                            url: `https://${firebasePath}/itemListings/${listingId}/.json?auth=${idToken}`,
                        }).then(r=> {
                            //delete from the cache
                            const index = this.listings.findIndex(l=> l.id === listingId)
                            this.listings.splice(index, 1)
                        })
                    })
                }
            },
            enumerable: true
        },
        "updateListing": {
            value: function(listingId, item) {
                return $http({
                    method: "GET",
                    url: `https://${firebasePath}/itemListings/${listingId}.json`
                }).then(response => {
                    const _item = response.data

                    // update item values based on what we're modifying
                    _item.label = item.label
                    _item.desc= item.desc
                    _item.price = item.price
                    _item.attributes = item.attributes
                    _item.tags = item.tags 

                    // update the cached listings
                    const cachedItem = this.listings.find(l=> l.id === listingId)
                    cachedItem.label = item.label
                    cachedItem.desc= item.desc
                    cachedItem.price = item.price
                    cachedItem.attributes = item.attributes
                    cachedItem.tags = item.tags 
                    

                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            return $http({
                                method: "PUT",
                                url: `https://${firebasePath}/itemListings/${listingId}.json?auth=${idToken}`,
                                data: _item
                            })
                        })

                })
            },
            enumerable: true
        },
        "distanceBetweenPoints": {
            value: function(lat1, lon1, lat2, lon2) {
               
                    var radlat1 = Math.PI * lat1/180
                    var radlat2 = Math.PI * lat2/180
                    var theta = lon1-lon2
                    var radtheta = Math.PI * theta/180
                    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                    dist = Math.acos(dist)
                    dist = dist * 180/Math.PI
                    dist = dist * 60 * 1.1515
                    return dist
            },
            enumerable: true
        },
        
    })

})