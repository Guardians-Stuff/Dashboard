const Mongoose = require('mongoose');

/**
 * @typedef {Object} Ticket
 * @property {string} guild
 * @property {string} user
 * @property {string} channel
 * @property {Array<TicketMessage>} messages
 * @property {boolean} active
 */

/**
 * @typedef {Object} TicketMessage
 * @property {string} user
 * @property {string} message
 * @property {number} time
 * @property {Array<string>} images
 */

const Tickets = new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    user: { type: String, required: true, index: true, immutable: true },
    channel: { type: String, required: true, index: true, immutable: true },
    messages : { type: [ {
        user   : { type: String, required: true },
        message: { type: String, required: true },
        time   : { type: Number, default: Date.now },
        images : { type: [ String ], default: [] }
    } ], default: [] },
    active: { type: Boolean, default: true }
});

export default Mongoose.models.Tickets || Mongoose.model('Tickets', Tickets);