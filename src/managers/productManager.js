import * as fs from 'fs'

const archivo = './src/db/products.json'

class ProductManager {

    async readFile() {
        try {
            const fileExist = fs.existsSync(archivo)
            if (!fileExist) {
                await fs.promises.writeFile(archivo, JSON.stringify([]))
            }
            let contenido = await fs.promises.readFile(archivo, 'utf-8')
            return JSON.parse(contenido)
        } catch (error) {
            console.log(error)
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readFile()
            if (limit != 0) {
                return products.slice(0, limit)
            }
            return products
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(id) {
        try {
            const products = await this.readFile()
            const idProduct = products.find((product) => product.id === id)
            if (!idProduct) {
                return {
                    "error": `No se encontro el producto con id: ${id}`
                }
            } else {
                return idProduct
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(product) {
        const {
            title,
            description,
            price,
            code,
            stock,
            category
        } = product
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log('Campo incompleto. El producto debe contener: title, description, price, code, stock y category')
                return
            }

            const products = await this.readFile()

            const codeExist = products.find((prod) => prod.code === code)

            if (!codeExist) {

                const id = products.reduce((idFinal, product) => (product.id > idFinal ? product.id : idFinal), 0)

                const newProd = {
                    title,
                    description,
                    price,
                    thumbnail: 'img',
                    code,
                    stock,
                    status: true,
                    category,
                    id: id + 1
                }

                products.push(newProd)
                console.log(products)
                const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(products))

                ProductManager.id++
                return respuesta
            } else {
                return console.log(`El producto ${title} ya existe`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async updateProductById(id, cambios) {
        try {
            const cambiosObj = cambios[0]
            const product = await this.getProductById(id)
            if (!product.error) {
                const newProduct = {
                    ...product,
                    ...cambiosObj
                }
                const products = await this.getProducts()
                const listaReducida = products.filter((prod) => prod.id != id)
                listaReducida.push(newProduct)
                const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(listaReducida))
                return respuesta
            } else {
                return product.error
            }

        } catch (error) {
            console.log(error)
        }
    }

    async deleteProductById(id) {
        try {
            const products = await this.getProducts()
            const newList = products.filter((prod) => prod.id != id)
            const respuesta = await fs.promises.writeFile(archivo, JSON.stringify(newList))
            return respuesta

        } catch (error) {
            console.log(error)
        }
    }


}



export default ProductManager