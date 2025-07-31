const validator=require('validator')

const validate=(data)=>{

    const mandatoryField=['firstName','password','emailId'];
   

    const IsAllow=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(IsAllow==0){
        throw new Error("Some Fields are missing.");
    }

    if(validator.isEmail(data.emailId)==0){
        throw new Error("Wrong Credentials")
    }
    
    if(validator.isStrongPassword(data.password)==0){
        throw new Error("Make Strong Password")
    }

    if(data.firstName.length<3){
        throw new Error("firstName requires more than 3 letters")
    }
}

module.exports=validate;