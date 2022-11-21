const BootcampModel = require('../models/bootcampModel');
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: `Bootcamp not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({ success: false, msg: err.message });
    next(err);
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: `Bootcamp not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        msg: `Bootcamp not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampModel.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
