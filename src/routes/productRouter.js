import {
    Router
} from "express";
import * as fs from 'fs'
import ProductManager from "../managers/productManager.js";


const productManager = new ProductManager()
const router = Router()

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0
    const products = await productManager.getProducts(limit)
    res.status(200).send(products)
})

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid, 10)
        const product = await productManager.getProductById(id)
        res.status(200).send(product)
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    const product = req.body
    const respuesta = await productManager.addProduct(product)
    res.status(201).send(respuesta)
})


export default router