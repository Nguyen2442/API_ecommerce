const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getCount, getFeaturedCount, updateGalleryImages } = require('../controllers/products');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.split(' ').join('-');
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage })

//get all products 
router.get(`/`, getAllProducts);
//get a product by id
router.get(`/:id`, getProductById)
//add product
router.post(`/`, uploadOptions.single('image'), addProduct)
//update product
router.put('/:id', uploadOptions.single('image'),updateProduct)
//delete product
router.delete('/:id', deleteProduct)
//get count of product
router.get('/get/count', getCount);
//get count of featured product
router.get('/get/featured/:count', getFeaturedCount);

//update gallery image
router.put('/gallery-images/:id', uploadOptions.array('image', 10), updateGalleryImages);

module.exports = router;
