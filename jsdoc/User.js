/**
 * @typedef {Object} User
 * @property {string} id the user's id
 * @property {string} username the user's username, not unique across the platform
 * @property {string} discriminator the user's 4-digit discord-tag
 * @property {string?} avatar the user's avatar hash
 * @property {string} displayAvatarURL url of user avatar
 * @property {boolean?} bot whether the user belongs to an OAuth2 application
 * @property {boolean?} system whether the user is an Official Discord System user (part of the urgent message system)
 * @property {boolean?} mfa_enabled whether the user has two factor enabled on their account
 * @property {string?} banner the user's banner hash
 * @property {integer?} accent_color the user's banner color encoded as an integer representation of hexadecimal color code
 * @property {string?} locale the user's chosen language option
 * @property {boolean?} verified whether the email on this account has been verified
 * @property {string?} email the user's email
 * @property {integer?} flags the flags on a user's account
 * @property {integer?} premium_type the type of Nitro subscription on a user's account
 * @property {integer?} public_flags the public flags on a user's account
 */