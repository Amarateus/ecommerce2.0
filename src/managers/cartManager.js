import * as fs from 'fs'
import ProductManager from './productManager.js'

const archivo = './src/db/carts.json'
const productManager = new ProductManager()

class CartManager {
    async newCart() {
        try {
            const existFile = fs.existsSync(archivo)
            if (!existFile) {
                await fs.promises.writeFile(archivo, JSON.stringify([]))
            }
            const carts = JSON.parse(await fs.promises.readFile(archivo, 'utf-8'))

            const id = carts.reduce((idFinal, cart) => (cart.id > idFinal ? cart.id : idFinal), 0)

            const newCart = {
                id: id + 1,
                products: []
            }

            carts.push(newCart)
            const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(carts))
            return respuesta

        } catch (error) {
            console.log(error)
        }
    }

    async getCartById(id) {
        try {
            const carts = JSON.parse(await fs.promises.readFile(archivo, 'utf-8'))
            const idCart = carts.find((cart) => cart.id === id)
            if (!idCart) {
                return {
                    "error": `El carrito con id: ${id} no existe`
                }
            } else {
                return idCart
            }
        } catch (error) {
            console.log(error)
        }
    }

    async newProductCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid)
            if (cart.error) {
                return cart
            }
            const product = await productManager.getProductById(pid)
            if (product.error) {
                return product
            }

            const productsInCart = cart.products

            const prodExistInCart = productsInCart.find((prod) => prod.product === pid)

            if (!prodExistInCart) {
                const newProduct = {
                    product: pid,
                    quantity: 1
                }

                cart.products.push(newProduct)
                console.log(cart)

                const carts = JSON.parse(await fs.promises.readFile(archivo, 'utf-8'))
                console.log(carts)

                const newFileCarts = await carts.map((cart) => {
                    if (cart.id === cid) {
                        cart.products.push(newProduct)
                        console.log(cart)
                        return cart
                    } else {
                        return cart
                    }
                })
                console.log(newFileCarts[0])

                const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(newFileCarts))
                return respuesta
            }

            const newList = productsInCart.map((product) => {
                console.log(product)
                if (product.product != pid) {
                    return product
                } else {
                    product.quantity = product.quantity + 1
                    return product
                }
            })

            cart.products = newList

            const carts = JSON.parse(await fs.promises.readFile(archivo, 'utf-8'))

            const cartsReducido = carts.filter((cart) => cart.id != cid)

            cartsReducido.push(cart)
            console.log(cartsReducido)

            const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(cartsReducido))
            return respuesta

        } catch (error) {
            console.log(error)
        }
    }

}

export default CartManager