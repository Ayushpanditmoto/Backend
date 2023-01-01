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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await BootcampModel.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await BootcampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }
  bootcamp.remove();
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
  query = BootcampModel.find(JSON.parse(queryStr)).populate("courses"); // find bootcamps with queryStr

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

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
