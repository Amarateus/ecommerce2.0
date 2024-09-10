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

router.put('/:pid', async (req, res)=>{
    try {
        const id = parseInt(req.params.pid, 10)
        const cambios = req.body
        const resultado = await productManager.updateProductById(id, cambios)
        res.status(201).send(resultado)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:pid', async (req, res)=>{
    try {
        const id = parseInt(req.params.pid, 10)
        const resultado = await productManager.deleteProductById(id)
        res.status(200).send(`Producto con id: ${id} eliminado`)
    } catch (error) {
        console.log(error)
    }
})


export default router