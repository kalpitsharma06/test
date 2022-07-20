require('dotenv').config()
const sub_Category = require('../model/subCategory')
const category = require('../model/category')

//add Category
exports.addCategory = async function (req, res, next) {
    const { category_name, category_id } = req.body
    const CategoryRecords = new category({
        category_name: category_name,
        category_id: category_id,
        image: req.file.filename,
    })
    try {
        const check = await category.findOne({ category_name: category_name })
        if (check !== null) {
            res.status(400).json(' category already exsist !')
        } else {
            await CategoryRecords.save();
            res.status(200).json({
                status: true,
                message: "Successfully Signed up",
                'results': CategoryRecords,
            })
        }
    } catch (err) {
        res.status(400).json(err.message)
    }
};

//get sub category
exports.getCategoryDetails = async (req, res) => {
    try {
        const result = await category.find()
        res.status(200).json({
            status: true,
            message: "Successfully Fetched Category Details",
            'total': result.length,
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

//Delete category
// exports.deleteCategory = async (req, res) => {
//     try {
//         const result = await category.findByIdAndDelete(req.params.id)
//         res.status(200).json({
//             status: true,
//             message: "Successfully Deleted Category",
//             'results': result
//         })

//     } catch (error) {
//         res.status(400).json(error.message)
//     }
// }

// Delete Category and relative sub-categorys together
exports.deleteCategory = async (req, res) => {
    try {
        const category_result = await category.findByIdAndDelete(req.params.id)
        const sub_category_result = await sub_Category.deleteMany({ category: req.params.id })
        res.status(200).json({
            status: true,
            message: "Successfully Deleted Category",
            'results': {
                'category_result': category_result,
                'sub_category_result': sub_category_result
            }
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// update category
exports.updateCategory = async (req, res) => {
    try {
        const result = await category.findByIdAndUpdate(req.params.id, {
            category_name: req.body.category_name,
            category_id: req.body.category_id,
            image: req.file.filename
        })

        res.status(200).json({
            status: true,
            message: "Successfully Updated Category Details",
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }

}

//Sub-Category
// Adding Sub-Category
exports.subCategory = async function (req, res, next) {

    const check = await sub_Category.findOne({ sub_category_name: req.body.sub_category_name })
    if (check !== null) {
        res.status(400).json({
            status: false,
            message: 'Category already exist'
        })
    } else {
        const categoryRecords = new sub_Category({
            sub_category_name: req.body.sub_category_name,
            image: req.file.filename,
            category: req.body.category
        })

        await categoryRecords.save();
        res.status(200).json({
            status: true,
            message: "Successfully Added Sub-Category",
            'results': categoryRecords,
        })
    }
}

//get sub category
exports.getSubCategoryDetails = async (req, res) => {
    try {
        const result = await sub_Category.find()
        res.status(200).json({
            status: true,
            message: "Successfully Fetched Sub-Category Details",
            'total': result.length,
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

//Delete sub category
exports.deleteSubCategory = async (req, res) => {
    try {
        const result = await sub_Category.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: true,
            message: "Successfully Deleted Sub-Category",
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// update sub category
exports.updateSubCategory = async (req, res) => {
    try {
        const result = await sub_Category.findByIdAndUpdate(req.params.id, {
            sub_category_name: req.body.sub_category_name,
            image: req.file.filename,
        })

        res.status(200).json({
            status: true,
            message: "Successfully Updated Sub-Category Details",
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}





