require('dotenv').config();
const sub_Category = require('../model/subCategory');
const category = require('../model/category');

//add Category
exports.addCategory = async function (req, res, next) {
  const { category_name, restaurant_id } = req.body;
  console.log(req.file);
  // console.log(restaurant_id)
  try {
    // console.log(req.file)
    if (req.file) {
      var CategoryRecords = new category({
        category_name: category_name,
        restaurant_id: restaurant_id,
        image: req.file.location,
        status: 'Active',
      });
      // console.log(CategoryRecords)
    } else {
      var CategoryRecords = new category({
        category_name: category_name,
        restaurant_id: restaurant_id,
        status: 'Active',
      });
    }

    const check = await category.findOne({ category_name: category_name, restaurant_id: restaurant_id });

    // console.log(check,"ffff")
    if (check) {
      res.status(400).json({
        status: false,
        message: 'category already exist',
      });
    } else {
      await CategoryRecords.save();
      res.status(200).json({
        status: true,
        message: 'Successfully Signed up',
        results: CategoryRecords,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
      message: 'category already exist with this restaurant',
    });
  }
};

//get sub category
exports.getCategoryDetails = async (req, res) => {
  try {
    const result = await category.find();
    res.status(200).json({
      status: true,
      message: 'Successfully Fetched Category Details',
      total: result.length,
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

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
    const category_result = await category.findByIdAndDelete(req.params.id);
    const sub_category_result = await sub_Category.deleteMany({ category: req.params.id });
    res.status(200).json({
      status: true,
      message: 'Successfully Deleted Category',
      results: {
        category_result: category_result,
        sub_category_result: sub_category_result,
      },
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// update category
exports.updateCategory = async (req, res) => {
  try {
    if (req.file) {
      const result = await category.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name,
        // category_id: req.body.category_id,
        image: req.file.location,
      });
    } else {
      const result = await category.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name,
        // category_id: req.body.category_id,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Successfully Updated Category Details',
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//Sub-Category
// Adding Sub-Category
exports.subCategory = async function (req, res, next) {
  const check = await sub_Category.findOne({ sub_category_name: req.body.sub_category_name });
  if (check !== null) {
    res.status(400).json({
      status: false,
      message: 'subcategory already exist',
    });
  } else {
    const categoryRecords = new sub_Category({
      sub_category_name: req.body.sub_category_name,
      category_name:req.body.category_name,
      category: req.body.category,
    });

    await categoryRecords.save();
    res.status(200).json({
      status: true,
      message: 'Successfully Added Sub-Category',
      results: categoryRecords,
    });
  }
  
};

//get sub category
exports.getSubCategoryDetails = async (req, res) => {
  try {
    const result = await sub_Category.find();
    res.status(200).json({
      status: true,
      message: 'Successfully Fetched Sub-Category Details',
      total: result.length,
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getSubCategorybycategory = async (req, res) => {
  const category = req.params.id;
  try {
    const result = await sub_Category.find({ category });
    res.status(200).json({
      status: true,
      message: 'Successfully Fetched Sub-Category Details',
      total: result.length,
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//Delete sub category
exports.deleteSubCategory = async (req, res) => {
  try {
    const result = await sub_Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: 'Successfully Deleted Sub-Category',
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// update sub category
exports.updateSubCategory = async (req, res) => {
  try {
    if (req.file) {
      const result = await sub_Category.findByIdAndUpdate(req.params.id, {
        sub_category_name: req.body.sub_category_name,
        // category_id: req.body.category_id,
        image: req.file.location,
      });
    } else {
      const result = await sub_Category.findByIdAndUpdate(req.params.id, {
        sub_category_name: req.body.sub_category_name,
        // category_id: req.body.category_id,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Successfully Updated Sub-Category Details',
      // 'results': result
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
