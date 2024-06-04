


import mongoose from 'mongoose';

const { Schema } = mongoose;

const ClickSchema = new Schema({
  insertedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  targetParamValue: { type: String }
});

const LinkSchema = new Schema({
  originalUrl: { type: String },
  clicks: [ClickSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  targetParamName: { type: String },
  targetValues: [{
    name: { type: String },
    value: { type: String }
  }]
});

export default mongoose.model('Link', LinkSchema);





