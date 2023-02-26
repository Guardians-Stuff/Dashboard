import React from 'react';
import Link from 'next/link';

import { Avatar, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function TextAvatar(props){
    /** @type {String} */ const src = props.src || '';
    /** @type {String} */ const alt = props.alt || '';
    /** @type {String} */ const font = props.font || '40px';
    /** @type {String} */ const size = props.size || '128px';
    /** @type {String} */ const variant = props.variant || 'inline';
    /** @type {String} */ const typography = props.typography || 'body1';
    /** @type {String} */ const margin = props.margin || '5px';

    return (
        <Box sx={variant == 'inline' ? { display: 'flex', flexDirection: 'row', alignItems: 'center' } : variant == 'column' ? { display: 'flex', flexDirection: 'column', alignItems: 'center' } : {}}>
            <Avatar src={src} style={{ marginRight: margin, width: size, height: size, fontSize: font }}>
                {alt}
            </Avatar>
            <Typography variant={typography}>{props.children}</Typography>
        </Box>
    );
}