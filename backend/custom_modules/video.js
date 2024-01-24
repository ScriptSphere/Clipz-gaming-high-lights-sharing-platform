const mongoose = require("mongoose");
const { UserModel } = require("./user");
const fs = require("fs");
const path = require("path");

class vidUtils {
  // Video Schema:
  videoSchema = new mongoose.Schema({
    title: { required: true, type: String },
    filePath: { required: true, type: String },
    thumbnail: { required: true, type: String },
    owner: { required: true, type: String },
    ownerName: { required: true, type: String },
    uploadDate: { default: new Date(), required: true, type: Date },
  });

  VideoModel = mongoose.model("video", this.videoSchema, "videos");
  // to add a new video:
  async add(data) {
    try {
      const ownerUser = await UserModel.findOne({ _id: data.owner });

      data.ownerName = ownerUser.name;
      data.uploadDate = new Date();

      const newVideo = new this.VideoModel(data);

      const savedDoc = await newVideo.save();

      if (savedDoc) {
        return savedDoc._id;
      } else return false;
    } catch (error) {
      console.log(error);
    }
  }

  // to get a video by it's id:
  async get(id) {
    const video = await this.VideoModel.findOne({ _id: id });

    if (video) {
      let videoWithIndex = await this.VideoModel.find().sort({
        uploadDate: -1,
      });
      let vidIndex = 0;
      videoWithIndex = videoWithIndex
        .filter((vid, index, arr) => {
          if (vid.filePath == video.filePath) vidIndex = index;

          return vid.filePath == video.filePath;
        })[0]
        .toObject();

      videoWithIndex.index = vidIndex;

      return videoWithIndex;
    } else {
      return false;
    }
  }

  // to get all the videos uploaded by a particular user:
  async getManyByUserId(id, sortBy) {
    if (sortBy === undefined) sortBy = -1;

    // sortBy will have 1 if we want the oldest uploaded and we'll get the newest uploaded when it's value will be -1
    const videos = await this.VideoModel.find({ owner: id }).sort({
      _id: sortBy,
    });
    if (videos) {
      return videos;
    } else {
      return false;
    }
  }

  deleteVideo(vidId) {
    return new Promise(async (resolve, reject) => {
      const video = await this.VideoModel.findOne({ _id: vidId });

      // deleting video:
      fs.unlinkSync(path.join(__dirname, `../public/${video.filePath}`));

      // deleting video:
      fs.unlinkSync(path.join(__dirname, `../public/${video.thumbnail}`));

      this.VideoModel.deleteOne({ _id: vidId })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  updateVideo(vidId, newData) {
    return new Promise(async (resolve, reject) => {
      this.VideoModel.findByIdAndUpdate({ _id: vidId }, newData, { new: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  // this function will return many clips reguardless of who uploaded it
  getMany(clipsNum, skipNum) {
    return new Promise(async (resolve, reject) => {
      console.log(skipNum, clipsNum);
      const clips = await this.VideoModel.find()
        .sort({ uploadDate: -1 })
        .skip(skipNum)
        .limit(clipsNum)
        .exec();

      if (clips) {
        console.log(clips);
        resolve(clips);
      } else {
        reject(false);
      }
    });
  }
}

module.exports = new vidUtils();
