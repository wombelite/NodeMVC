

export interface validator {
    property: string;
    function: Function;
    errorMessage:string;
}

export class MVC {

    static fs: any = require("fs");
    static validators: Array<validator> = [];

    public static httpGet(route: string) {
        return this.http("get", route);
    }

    public static httpPost(route: string) {
        return this.http("post", route);
    }

    private static http(method: string, route: string) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            if (route !== "") {
                route = this.cleanRoute(route);
                var name = target.constructor.name; // controller name. 
                name = name.substr(0, name.toLowerCase().indexOf("controller")); // trims controller name IE PersonController -> Person
                target.constructor.router[method]("/" + name + route, descriptor.value);
                console.log("registering route: ", "'/" + name + route + "'");
            } else {
                throw "please provide a route for " + propertyKey
            }
        };
    }


    public static Authorize() {

        return (target: any) => {
            // do something here.
            console.log(target.name);
        };
    }


    public ModelBinderRequest<TModel>(request:any, model:TModel){

    }


    /// preppend slash to route if none exists.
    private static cleanRoute(route: string) {
        if (route.substr(0, 1) != "/") {
            route = "/" + route;
        }
        return route;
    }

    public static registerRoutes(router: any, controllerLocation: string) {

        this.fs.readdirSync(controllerLocation).forEach(function(file) {
            var controllerName = file.substring(0, file.indexOf(".js"));
            if (file.substr(-3) == '.js') {
                var controller = require(controllerLocation + '/' + file);
                try {
                    controller[controllerName]["router"] = router;
                }
                catch (err) {
                    console.error("cannot register: " + controllerName)
                }
            }
        });
    }

    
    //model binders.
    
    public static ModelBinder(request:any):any{
        
    }
    
    // viewmodel validation

    public static ValidateModel(model:any){
        let errors = [];
    
        for(var val in MVC.validators){
            let isValid = MVC.validators[val].function(MVC.validators[val].errorMessage,model);
            if(!isValid){
                errors.push(
                    {
                        property:MVC.validators[val].property,
                        isValid,
                        errorMessage: MVC.validators[val].errorMessage
                    });    
            }
        }
        return errors;
    }



    // decorators

    public static Required(errorMessage?:string,condition?: Function) {
        return (target: any, propertyKey: string) => {
            if (condition) {
                 MVC.validators.push({errorMessage:errorMessage, property: propertyKey, function: (errorMessage,model) => condition(errorMessage,model) });
            }
            else{
                MVC.validators.push({errorMessage:errorMessage, property: propertyKey, function: () => { return target !== undefined && target !== null && target !== ""; } });
            }
        }
    }

    public static Validator(errorMessage?:string,condition?: Function) {
        return (target: any, propertyKey: string) => {
            if (condition) {
                 MVC.validators.push({errorMessage:errorMessage, property: propertyKey, function: (errorMessage,model) => condition(errorMessage,model) });
            }
        }
    }




}
