const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
        name: {
			type: String,
			required: true
		},
        capital: {
			type: String,
			required: true
		},
        leader: {
			type: String,
			required: true
		},
        parentregion: {
			type: String,
			required: true
		},
		landmarks:[String],
        regions:[String],
		sortRule: {
			type: String, 
			required: true
		},
		sortDirection: {
			type: Number, 
			required: true
		}
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;