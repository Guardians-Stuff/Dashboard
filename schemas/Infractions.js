const Mongoose = require('mongoose');

/**
 * @typedef {Object} Infraction
 * @property {string} guild
 * @property {string} user
 * @property {string} issuer
 * @property { 'ban' | 'kick' | 'warning' | 'timeout' | 'block' } type
 * @property {boolean} active
 * @property {string} reason
 * @property {number} time
 * @property {number} duration
 * @property {number} expires
 */

const Infractions = new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    user: { type: String, required: true, index: true, immutable: true },
    issuer: { type: String, required: true, index: true, immutable: true },
    type: { type: String, index: true, required: true, immutable: true, lowercase: true, enum: [ 'ban' , 'kick', 'warning', 'timeout', 'block' ] },
    active: { type: Boolean, default: true },
    reason: { type: String, default: 'Unspecified reason.' },
    time: { type: Number, default: Date.now },
    duration: { type: Number, default: Infinity, required: true },
    expires: {
        type: Number,
        default: function () {
            return this.time + this.duration;
        }
    }
}, {
    virtuals: {
        permanent: {
            get() {
                return !isFinite(this.duration);
            }
        }
    }
});

export default Mongoose.models.Infractions || Mongoose.model('Infractions', Infractions);