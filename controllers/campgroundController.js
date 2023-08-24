import Campground from '../models/campground.js';
import { cloudinary } from '../cloudinary/index.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapBoxToken});

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
  const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
  // const updateCampground = await Campground.findById(id);
  // updateCampground = { ...req.body.campground }
  if(req.files){
    const images = req.files.map( file => ({filename: file.filename, url: file.path}) );
    updatedCampground.images.push(...images);
    await updatedCampground.save();
  }
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCampground.updateOne(
      {$pull:
        {images:
          {filename:
            {$in: req.body.deleteImages}
          }
        }
      }
    );
  }
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
  const geoData = await geocodingClient.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  req.body.campground.geometry = geoData.body.features[0].geometry;
  const { name, location, price, description, geometry } = req.body.campground;
  const camp = new Campground({
    name,
    location,
    geometry,
    price,
    description,
  });
  camp.images = req.files.map( file => ({ url: file.path, filename: file.filename }));
  camp.creator = req.user._id;
  // console.log('****CAMP', camp)
  // return res.send('OK')
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