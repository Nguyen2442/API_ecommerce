const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');




exports.getAllProducts = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    try {
        const productList = await Product.find(filter).populate('category');
        res.send(productList);
    } catch (err) {
        res.status(500).json({ success: false }, { message: err })
    }

}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        res.send(product);
    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}

exports.addProduct =  async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid Category');
    }

    const file = req.file;
    if(!file){
        return res.status(400).send('No image in the request');
    } 
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    try {
        product = await product.save();
        return res.send(product);
    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}

exports.updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).send('Invalid Category');
        }

        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(400).send('Invalid Product')
        }

        const file = req.file;
        let imagepath;

        if(file){
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagepath = `${basePath}${fileName}`;
        }else{
            imagepath = product.image;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagepath,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            // { new: true }
        )

        res.status(200).json(updatedProduct);
    } catch (err){
        res.status(500).json({ success: false, error: err })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id);
        res.status(200).json({ success: true, message: 'The product is deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err })
    }
}

exports.getCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments((count) => count)
        res.send({
            productCount: productCount
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}

exports.getFeaturedCount = async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    try {
        const products = await Product.find({ isFeatured: true }).limit(+count);
        res.send({
            products: products
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err })
    }
}



exports.updateGalleryImages = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );
        res.send(product).status(200);
    }catch(err){
        res.status(500).json({ success: false, error: err }).send('The gallery cannot be updated!');
    }
}
