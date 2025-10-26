import { Router } from "express";
import { authenticateJwt } from "../middleware/auth";
import { createContact } from "../controllers/contactController";



const route = Router()


route.post('/', authenticateJwt, createContact);


export default route;