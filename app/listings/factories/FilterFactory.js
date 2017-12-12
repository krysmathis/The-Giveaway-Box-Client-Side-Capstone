"use strict"

angular
.module("TheGiveawayBoxApp")
.factory("FilterFactory", function ($http,$sce) {
    
    return Object.create(null,{
        "filteredListings": {
            value: [],
            enumerable: true,
            writable: true
        },
        "filter": {
            value: {},
            enumerable: true,
            writable: true
        },
        "getfilteredListings": {
            value: function(listings,filter) {
                this.filter = filter
                // clear the filtered listings before proceeding
                this.filteredListings = []
                //go through keywords
                listings.forEach(
                    l=>{
                        if (this.searchKeywords(l)) {
                            return
                        } else if (this.searchKeywords(l)) {
                            return
                        }
                    })

                return this.filteredListings


            },
            enumerable: true
        },
        "searchTags": {
            value: function(item, word) {
                return item.tags.some(t=> t.toLowerCase().includes(word))
            },
            enumerable: true
        },
        "searchAttributes": {
            value: function(item, word) {
                if (item.hasOwnProperty("attributes")){
                    return item.attributes.some(a => a.value.toLowerCase().includes(word))
                } else {
                    return false
                }
            },
            enumerable: true
        },
        "searchKeywords": {
            value: function (listing){
                let matched = false
                const l = listing
                //
                if (!matched) {
                    this.filter.keywords.forEach(word => {
                        // label
                        // description
                        // attribute values
                        // tags
                        // looking for lowercase
                        word = word.toLowerCase()
                        if (
                            l.label.toLowerCase().includes(word) ||
                            l.desc.toLowerCase().includes(word)  ||
                            this.searchTags(l,word) ||
                            this.searchAttributes(l, word)
                        ) {
                                this.filteredListings.push(l)
                                matched = true
                                return matched
                            }
                    })
                } else {
                    // end it here if it matched
                    return matched
                }
                return matched
            },
            enumerabele: true
        }
      
    })

})