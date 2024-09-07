import * as fs from 'fs'

const archivo = './src/db/products.json'

class ProductManager {
    static id = 0;


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
                return `No se encontro el producto con id: ${id}`
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


}


export default ProductManager