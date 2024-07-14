import { FormGroup } from "@angular/forms"

export const validatePassword = (password: string, confirmPassword: string)=>{
   return (formGroup:FormGroup) =>{
     let pass = formGroup.controls[password]
     let confirmPass = formGroup.controls[confirmPassword]   
     
     if(pass.value !== confirmPass.value)
     {
       confirmPass.setErrors({validatePassword: true})                                                                                   
     }else{
       confirmPass.setErrors(null)                                                                                   
     }
   }

}