//Require Moongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//Walk Schema
var WalkSchema = new Schema({
    created_at: { type: Date, default: new Date() }, 
    name: { type: String, required: true }, 
    date: { type: Date, required: true }, 
    location: { type: Object, required: true }, 
    distance: { type: String, required: true }, 
    owner: [{type: Schema.Types.ObjectId, ref: 'User'}], 
    rsvps: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

//Before saving walk
// WalkSchema.pre('save', function(next){
//   // Set Created At and Updated At
//   now = new Date();
//   this.updated_at = now;
//   if ( !this.created_at ) {
//     this.created_at = now;
//   }
// });

var Walk = mongoose.model('Walk', WalkSchema);

module.exports = Walk;