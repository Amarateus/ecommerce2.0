import {
    Router
} from "express";
import CartManager from "../managers/cartManager.js";

const router = Router()
const cartManager = new CartManager()


router.post('/', async (req, res) => {
    try {
        const respuesta = await cartManager.newCart()
        res.status(201).send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid, 10)
        const respuesta = await cartManager.getCartById(id)
        res.status(200).send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid, 10)
        const pid = parseInt(req.params.pid, 10)
        const respuesta = await cartManager.newProductCart(cid, pid)
        res.status(201).send(respuesta)
    } catch (error) {
        console.log(error)
    }
})

export default router