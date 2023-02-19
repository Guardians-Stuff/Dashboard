/**
 * @typedef {Object} APIGuild
 * @property {string} id guild id
 * @property {string} name guild name (2-100 characters, excluding trailing and leading whitespace)
 * @property {string?} icon icon hash
 * @property {string?} icon_hash icon hash, returned when in the template object
 * @property {string?} iconURL url to icon image
 * @property {string?} splash splash hash
 * @property {string?} discovery_splash discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
 * @property {boolean?} owner * true if the user is the owner of the guild
 * @property {string} owner_id id of owner
 * @property {string?} permissions * total permissions for the user in the guild (excludes overwrites)
 * @property {string?} afk_channel_id id of afk channel
 * @property {number} afk_timeout afk timeout in seconds, can be set to: 60, 300, 900, 1800, 3600
 * @property {boolean?} widget_enabled true if the server widget is enabled
 * @property {string?} widget_channel_id the channel id that the widget will generate an invite to, or null if set to no invite
 * @property {number} verification_level verification level required for the guild
 * @property {number} default_message_notifications default message notifications level
 * @property {number} explicit_content_filter explicit content filter level
 * @property {Array<Role>} roles roles in the guild
 * @property {unknown} emojis custom guild emojis
 * @property {unknown} features enabled guild features
 * @property {number} mfa_level required MFA level for the guild
 * @property {string?} application_id application id of the guild creator if it is bot-created
 * @property {string?} system_channel_id the id of the channel where guild notices such as welcome messages and boost events are posted
 * @property {number} system_channel_flags system channel flags
 * @property {string?} rules_channel_id the id of the channel where Community guilds can display rules and/or guidelines
 * @property {number?} max_presences the maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
 * @property {number?} max_members the maximum number of members for the guild
 * @property {string?} vanity_url_code the vanity url code for the guild
 * @property {string?} description the description of a guild
 * @property {string?} banner banner hash
 * @property {number} premium_tier premium tier (Server Boost level)
 * @property {number} premium_subscription_count? the number of boosts this guild currently has
 * @property {string} preferred_locale the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US"
 * @property {string?} public_updates_channel_id the id of the channel where admins and moderators of Community guilds receive notices from Discord
 * @property {number?} max_video_channel_users the maximum amount of users in a video channel
 * @property {number?} approximate_member_count approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
 * @property {number?} approximate_presence_count approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
 * @property {unknown?} welcome_screen the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
 * @property {number} nsfw_level guild NSFW level
 * @property {unknown?} stickers custom guild stickers
 * @property {boolean} premium_progress_bar_enabled whether the guild has the boost progress bar enabled
 */