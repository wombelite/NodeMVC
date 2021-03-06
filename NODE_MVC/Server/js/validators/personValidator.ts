

import {Validators} from "./Validators"

export class PersonValidator extends Validators{

 
public static  NameValidation(errorMessage,model):boolean{

    if(model.name != "james"){
        console.log("Please provide a valid First name:", model.name);
        return false;
    }
    return true;
}

public  static  SurNameValidation(errorMessage,model):boolean{
    
    if(model.surname != "burt"){
        console.log("Please provide a valid First name:", model.surname);
        return false;
    }
    return true;
}

public  static  DOBDateValidation(errorMessage,model):boolean{
    
    if(!model.dob){
        console.log("Please provide a valid date of birth:", model.dob);
        return false;
    }
    
    return true;
}

public  static  DOBAgeValidation(errorMessage,model):boolean{
    
    var birthday:any = new Date(model.dob);
    var age:Number = parseInt(new Number((new Date().getTime() - birthday.getTime()) / 31536000000).toFixed(0));
    
    if(isNaN(<number>age))
            return false;
    
    if(age < 40 )
            return false;
      
    return true;
}
}