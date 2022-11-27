const { request, response } = require("express");
const express=require("express");
const {v4:uuidv4}=require("uuid");
const app=express();

app.use(express.json());
const customers=[];
function verifyIfAlreadyExistist(request,response,next){
    const {rg}=request.headers;
    const customer=customers.find((customer)=>customer.rg === rg);
    if(!customer)
    {
        response.status(400).json({error:"Customer not found"});
    }
    request.customer=customer;

    return next();
}
function getBalance(statment){
    const balance=statment.reduce((acc,operation)=>{
        if(operation.type==="credito")
        {
            return acc+operation.amount;
        }
        else{
            return acc - operation.amount;
        }


    },0);
    return balance;
}
app.post("/account",(request,response)=>{
    const {rg,cpf,nome}=request.body;
    const id=uuidv4();
const customerAlreadyExistist=customers.some((customer)=>customer.rg===rg);
if(customerAlreadyExistist)
{
    response.status(400).json({error:"Customer already existist"});
}
    customers.push({
nome,cpf,rg,id,statment:[]
    });
    response.status(201).send();
});
app.get("/statment",verifyIfAlreadyExistist,(request,response)=>{
const {customer}=request;


response.status(200).json(customer.statment);
});
app.post("/deposit",verifyIfAlreadyExistist,(request,response)=>{
const {customer}=request;
const {amount,description}=request.body;
  
 const operation={
    amount,description,created_at:new Date(),type:'credito'
 }
 customer.statment.push(operation);
 response.status(200).send();
});
app.post("/withdraw",verifyIfAlreadyExistist,(request,response)=>{
const {customer}=request;
const {amount}=request.body;
const balance=getBalance(customer.statment);
if(balance<amount)
{
    response.status(400).json({error:"Saldo insuficiente"});
}
const operation={
    amount,created_at:new Date(),type:"debito"
}
customer.statment.push(operation);
response.status(200).send();

});
app.get("/statment/date",verifyIfAlreadyExistist,(request,response)=>{
const {customer}=request;
const {date}=request.query;

const dateformat=new Date(date + " 00:00");

const statment=customer.statment.filter((statment)=>statment.
created_at.toDateString() === new Date
(dateformat).toDateString());
return response.status(200).json(statment);

});








app.listen(10);