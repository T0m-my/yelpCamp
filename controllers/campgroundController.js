import Campground from "../models/campground.js";

const getAllCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find();
  if(!campgrounds){
    req.flash('error', 'Cannot find any campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/index', { campgrounds });
};

const viewCampCreateForm = (req, res) => {
  res.render('campgrounds/new');
};

const viewCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('creator');
  if(!campground){
    req.flash('error', 'Cannot find that campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  // const { name, location } = req.body.campground;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground});
  req.flash('success', 'Campground updated successfully!');
  res.redirect(`/campgrounds/${id}`);
};

const editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Cannot find that campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
  
};

const createCampground = async (req, res) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 404);
  const { name, location, price, description, image } = req.body.campground;
  const camp = new Campground({
    name,
    location,
    price,
    description,
    image
  });
  camp.creator = req.user._id;
  await camp.save();
  req.flash('success', 'Successfully created campground!');
  res.redirect(`campgrounds/${camp._id}`);
};

const deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash('success', 'Campground deleted successfully!');
  res.redirect('/campgrounds');
}

export { 
  getAllCampgrounds,
  viewCampCreateForm,
  viewCampground,
  updateCampground,
  editCampground,
  createCampground,
  deleteCampground
 };