"use strict";
var MVC = (function () {
    function MVC(router) {
        MVC.router = router;
        MVC.validators = [];
    }
    MVC.httpGet = function (route) {
        return this.http("get", route);
    };
    MVC.httpPost = function (route) {
        return this.http("post", route);
    };
    MVC.http = function (method, route) {
        var _this = this;
        return function (target, propertyKey, descriptor) {
            if (route !== "") {
                route = _this.cleanRoute(route);
                var name = target.constructor.name; // controller name. 
                name = name.substr(0, name.toLowerCase().indexOf("controller")); // prefixes controller name IE PersonController -> Person
                MVC.router[method]("/" + name + route, descriptor.value);
                console.log("registering route: ", "'/" + name + route + "'");
            }
            else {
                throw "please provide a route for " + propertyKey;
            }
        };
    };
    /// preppend slash to route if none exists.
    MVC.cleanRoute = function (route) {
        if (route.substr(0, 1) != "/") {
            route = "/" + route;
        }
        return route;
    };
    MVC.registerRoutes = function (router, controllerLocation) {
        this.fs.readdirSync(controllerLocation).forEach(function (file) {
            var controllerName = file.substring(0, file.indexOf(".js"));
            if (file.substr(-3) == '.js') {
                var controller = require(controllerLocation + '/' + file);
                try {
                    controller[controllerName](router);
                }
                catch (err) {
                    console.error("cannot register: " + controllerName);
                }
            }
        });
    };
    MVC.ValidateModel = function (model) {
        var errors = [];
        for (var val in MVC.validators) {
            var isValid = MVC.validators[val].function(MVC.validators[val].errorMessage, model);
            if (!isValid) {
                errors.push({
                    property: MVC.validators[val].property,
                    isValid: isValid,
                    errorMessage: MVC.validators[val].errorMessage
                });
            }
        }
        return errors;
    };
    MVC.Required = function (errorMessage, condition) {
        return function (target, propertyKey) {
            if (condition) {
                MVC.validators.push({ errorMessage: errorMessage, property: propertyKey, function: function (errorMessage, model) { return condition(errorMessage, model); } });
            }
            else {
                MVC.validators.push({ errorMessage: errorMessage, property: propertyKey, function: function () { return target !== undefined && target !== null && target !== ""; } });
            }
        };
    };
    MVC.fs = require("fs");
    MVC.validators = [];
    return MVC;
}());
exports.MVC = MVC;
//# sourceMappingURL=MVC.js.map