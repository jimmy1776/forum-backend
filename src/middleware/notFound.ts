import { RequestHandler } from "express";

const notFound: RequestHandler = (req,res,next) => {
    return res.status(400).json({error:'Route not found, check your request URL'}); 
}

export default notFound;




