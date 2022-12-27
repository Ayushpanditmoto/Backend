const BootcampModel = require("../models/bootcampModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../utils/geocoders");

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  console.log(bootcamp);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

//{{URL}}/api/v1/bootcamps?averageCost[in]=10000,20000
//{{URL}}/api/v1/bootcamps?location.state=MA&housing=true
//{{URL}}/api/v1/bootcamps?careers[in]=Business,Healthcare
//{{URL}}/api/v1/bootcamps?select=name,description
//{{URL}}/api/v1/bootcamps?select=name,description&sort=-name
//{{URL}}/api/v1/bootcamps?select=name,description&sort=-name&limit=2
//{{URL}}/api/v1/bootcamps?select=name&limit=1&page=4

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query; // here we will store our query
  const reqQuery = { ...req.query }; // copy of req.query
  const removeFields = ["select", "sort", "page", "limit"]; // fields to be removed from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]); // remove fields from reqQuery

  //convert greter than, greater than equal to, less than, less than equal to, in to $gt, $gte, $lt, $lte, $in
  let queryStr = JSON.stringify(reqQuery); // convert reqQuery to string
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  ); // replace gt, gte, lt, lte, in with $gt, $gte, $lt, $lte, $in
  query = BootcampModel.find(JSON.parse(queryStr)); // find bootcamps with queryStr

  // select fields
  if (req.query.select) {
    // if select is present in req.query
    const fields = req.query.select.split(",").join(" "); // convert select to string
    // and replace , with space name description
    query = query.select(fields); // select fields
  }

  // sort
  if (req.query.sort) {
    // if sort is present in req.query
    const sortBy = req.query.sort.split(",").join(" "); // convert sort to string
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // sort by createdAt in descending order
  }
  // pagination
  const page = parseInt(req.query.page, 10) || 1; // if page is not present in req.query, set page to 1
  const limit = parseInt(req.query.limit, 10) || 25; // if limit is not present in req.query, set limit to 25
  const startIndex = (page - 1) * limit; // calculate startIndex
  const endIndex = page * limit; // calculate endIndex
  const total = await BootcampModel.countDocuments(); // count total documents
  query = query.skip(startIndex).limit(limit); // skip startIndex and limit to limit
  const bootcamps = await query; // execute query
  const pagination = {}; // pagination object
  if (endIndex < total) {
    // if endIndex is less than total
    pagination.next = {
      // set next object
      page: page + 1,
      limit, // limit: limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await BootcampModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
