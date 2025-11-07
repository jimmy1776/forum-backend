import express from 'express';
import type { NextFunction, Request, RequestHandler } from 'express';
import type {Response} from 'express';
import prisma from '../prisma.js'; 


export const getReply: RequestHandler = (req,res) => { 
  res.json({message:'hit'});
}


export const updateReply: RequestHandler = (req,res) => { 
  res.json({message:'hit'});
}

export const deleteReply: RequestHandler = (req,res) => { 
  res.json({message:'hit'});
}

