import express from 'express';
import type { NextFunction, Request } from 'express';
import type {Response} from 'express';
import prisma from '../prisma.js'; 


const getMany = async(req:Request, res:Response) => {
    const users = await prisma.user.findMany();
    res.json({users});
}


const create  = async(req:Request, res:Response, next: NextFunction) =>{
  try {
  const user = await prisma.user.create({
    data: { 
      email: req.body.email, username:req.body.username
    }
  });
  res.status(201).json({user});
} catch (err){
  next(err);
}

};


const get = async (req: Request<{ id: string }>, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const user = await prisma.user.findFirst({
    where: {id :id},
    include: { 
      posts:true,
    },
   });

   if (!user) { 
      res.status(404).json({error: 'user not found'});
      return; 
   }


   res.send(user.username);
};


export default {getMany,get,create}; 
