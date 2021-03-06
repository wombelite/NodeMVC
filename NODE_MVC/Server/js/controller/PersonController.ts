
import {Person} from '../models/person';
import "reflect-metadata";

import {MVC,Controller} from "../MVC";


@MVC.Authorize()
export class PersonController extends Controller 
{
    
    @MVC.httpGet('/:person_id')
    public GetPerson(model:any){
            
            let currentContext = this.CurrentContext;
            return {model};
        }

    @MVC.httpGet('/getperson/:and_stuff')
    public GetPerson2(model:any){
            
            let currentContext = this.CurrentContext;
            return {model}
        }

    @MVC.httpPost('/getpersonmodel')
    public GetPersonModel(model:any){
            let currentContext = this.CurrentContext;
            console.log(model);
            return {thing1:currentContext.request}
        }

    @MVC.httpGet('/getstudent/:student_id')    
    public GetStudent(req:any,res:any):void{
            res.json({ message: req.params.student_id});
    }
    
    @MVC.httpGet('/getstudentactionresult/:name/:surname/:student_id')    
    public GetStudentActionResult(person:Person,args:any){
            
            var p:Person  = new Person(person); 
            super.Log("in method log....................................");
            return super.View("person/index",p);
    }

    @MVC.httpPost('/:student_id')
    public CreatePerson(req:any,res:any):void{
            
            var person = new Person(req.body);
            person.validationErrors = MVC.ValidateModel(person);   
            if(person.isValid){
                // valid model
                res.json(
                    { 
                        params: req.params.student_id,
                        body: req.body
                });
                 
            }else{
            // invalid model.
            res.json({
                validationErrors:person.validationErrors
            })
            }

            
    }
    

    @MVC.httpPost('/:student_id')
    public ViewModelTest(person:Person):void{
        //req:any,res:any
    }

    
}


//export = PersonController;