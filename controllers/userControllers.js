const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const userModel = require("../models/userModel");

// @desc   get all users
// @route  GET /api/v1/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   get single user
// @route  GET /api/v1/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   create user
// @route  POST /api/v1/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc   update user
// @route  PUT /api/v1/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   delete user
// @route  DELETE /api/v1/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
