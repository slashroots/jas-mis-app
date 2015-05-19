/**
 * Created by matjames007 on 4/29/15.
 */
var services = angular.module('jasmic.services', ['ngResource']);

/**
 * Factory to be used to retrieve the farmers listing.
 */
services.factory('FarmersFactory', function ($resource) {
    return $resource('/farmers', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to show a specific farmer by id,
 * to create a new farmer and to update a new farmer
 * based on id submitted as a request parameter.
 */
services.factory('FarmerFactory', function ($resource) {
    return $resource('/farmer/:id', {}, {
        show: { method: 'GET', params: {id: '@id'} },
        update: { method: 'PUT', params: {id: '@id'} },
        create: { method: 'POST' }
    })
});

/**
 * Factory to be used to retrieve array of comments for specific
 * farmer based on id submitted as a request parameter
 */
services.factory('FarmerCommentsFactory', function($resource) {
    return $resource('/farmer/:id/comments', {}, {
        query: { method: 'GET', params: {id: '@id'}, isArray: true}
    });
});

/**
 * Factory to be used to create a new Comment on a particular
 * Farmer. To do the association we submit an id in the request
 * parameter.
 */
services.factory('FarmerCommentFactory', function($resource) {
    return $resource('/farmer/:id/comment', {}, {
        create: { method: 'POST', params: {id: '@id'}}
    });
});

/**
 * Use this factory to get all the farms of a particular farmer
 * given by the id submitted in the request parameter.
 */
services.factory('FarmerFarmsFactory', function($resource) {
    return $resource('/farmer/:id/farms', {}, {
        query: { method: 'GET', params: {id: '@id'}}
    });
});

/**
 * This factory is to be used to create and update a particular
 * farm based on the farmer's id.
 */
services.factory('FarmerFarmFactory', function($resource) {
    return $resource('/farmer/:id/farm', {}, {
        create: {method: 'POST', params: {id: '@id'}},
        update: {method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * This factory allows us to do a search across multiple entities
 * including, Farmer, transactions, Buyers and Calls (limited to
 * 10 per entity)
 */
services.factory('SearchAllFactory', function($resource) {
    return $resource('/common/search', {}, {
        query: { method: 'GET'}
    });
});

/**
 * Factory to be used to retrieve the Parishes.
 */
services.factory('ParishesFactory', function ($resource) {
    return $resource('/common/parishes', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to retrieve the Transactions.
 */
services.factory('TransactionsFactory', function ($resource) {
    return $resource('/transactions', {}, {
        query: { method: 'GET', isArray: true }
    })
});

/**
 * Factory to be used to create and modify a transaction
 */
services.factory('TransactionFactory', function($resource) {
    return $resource('/transaction/:id', {}, {
        create: { method: 'POST'},
        update: { method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * Allows for retrieval of multiple buyers to populate listing
 * screens.
 */
services.factory('BuyersListingFactory', function($resource) {
    return $resource('/buyers', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
});

/**
 * Factory to be used to create and modify a transaction
 */
services.factory('BuyerFactory', function($resource) {
    return $resource('/buyer/:id', {}, {
        show: { method: 'GET'},
        create: { method: 'POST'},
        update: { method: 'PUT', params: {id: '@id'}}
    });
});

/**
 * Allows for retrieval of multiple buyer types to populate pickers.
 */
services.factory('BuyerTypesListingFactory', function($resource) {
    return $resource('/buyertypes', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
});

/**
 * This is the factory used to create a representative based on a given
 * Buyer.
 */
services.factory('RepFactory', function($resource) {
    return $resource('/buyer/:id/rep', {}, {
        create: { method: 'POST', params: {id: '@id'}}
    });
});