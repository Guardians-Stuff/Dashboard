const Mongoose = require('mongoose');

/**
 * @typedef {Object} Guild
 * @property {string} guild
 * @property {Array<string>} members
 * @property {GuildVerification} verification
 * @property {GuildLogs} logs
 * @property {GuildAutoRole} autorole
 * @property {GuildAntiRaid} antiraid
 * @property {GuildSuggestion} suggestion
 * @property {GuildTickets} tickets
 */

/**
 * @typedef {Object} GuildVerification
 * @property {boolean} enabled
 * @property {null | 'button' | 'command' | 'captcha'} version
 * @property {string} role
 * @property {string} channel
 */

/**
 * @typedef {Object} GuildLogs
 * @property {boolean} enabled
 * @property {string} basic
 * @property {string} moderator
 */

/**
 * @typedef {Object} GuildAutoRole
 * @property {boolean} enabled
 * @property {string} member
 * @property {string} bot
 */

/**
 * @typedef {Object} GuildAntiRaid
 * @property {boolean} enabled
 * @property {boolean} raid
 * @property {number} joinAmount
 * @property {number} joinWithin
 * @property {null | 'kick' | 'ban'} action
 * @property {GuildAntiRaidLockdown} lockdown
 * @property {string} channel
 */

/**
 * @typedef {Object} GuildAntiRaidLockdown
 * @property {boolean} enabled
 * @property {boolean} active
 */

/**
 * @typedef {Object} GuildSuggestion
 * @property {boolean} enabled
 * @property {string} channel
 * @property {boolean} reactions
 */

/**
 * @typedef {Object} GuildTickets
 * @property {boolean} enabled
 * @property {string} category
 * @property {string} channel
 * @property {string} role
 */

const Guilds = new Mongoose.Schema({
    guild: { type: String, required: true, index: true, immutable: true },
    members: { type: [ String ], index: true, default: [] },
    verification: {
        enabled: { type: Boolean, default: false },
        version: { type: String, enum: [ null, 'button', 'command', 'captcha' ], default: null },
        role: { type: String, default: null },
        channel: { type: String, default: null }
    },
    logs: {
        enabled: { type: Boolean, default: false },
        basic: { type: String, default: null },
        moderator: { type: String, default: null }
    },
    autorole: {
        enabled: { type: Boolean, default: false },
        member: { type: String, default: null },
        bot: { type: String, default: null }
    },
    antiraid: {
        enabled: { type: Boolean, default: false },
        raid: { type: Boolean, default: false },
        joinAmount: { type: Number, default: null },
        joinWithin: { type: Number, default: null },
        action: { type: String, enum: [ null, 'kick', 'ban' ], default: null },
        lockdown: {
            enabled: { type: Boolean, default: false },
            active: { type: Boolean, default: false }
        },
        channel: { type: String, default: null }
    },
    suggestion: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        reactions: { type: Boolean, default: false }
    },
    tickets: {
        enabled: { type: Boolean, default: false },
        category: { type: String, default: null },
        channel: { type: String, default: null },
        role: { type: String, default: null }
    }
});

export default Mongoose.models.Guilds || Mongoose.model('Guilds', Guilds);