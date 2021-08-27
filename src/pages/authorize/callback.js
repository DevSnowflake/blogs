import cookie from 'cookie';
import { useEffect } from 'react';
import axios from 'axios';
import { getAuthID } from '../../utils';

export default function Callback({ redirect, forbidden, error }) {
    useEffect(() => {
        if (redirect) window.location.href = '/';
    });

    if (redirect) return 'Redirecting you...';
    else if (forbidden) return 'You are not allowed to enter the admin panel...';
    else if (error) return 'Caught an error. Check the console to debug...';
    else return null;
}

Callback.getInitialProps = async (ctx) => {
    if (!ctx.query.code || getAuthID(ctx.req)?.length) return { redirect: true };
    
    try {
        const { data } = await axios.get('https://backend.snowflakedev.org/api/authorize', {
            headers: { redirect_uri: `${process.env.URL}/authorize/callback` },
            params: { code: ctx.query.code }
        });

        const { data: staffs } = await axios.get('https://api.snowflakedev.org/api/d/staffs');
        if (!staffs.data.find(x => x.id === data.data.id)) return { forbidden: true };
        
        ctx.res.setHeader('Set-Cookie', [cookie.serialize('auth_id', data.data.accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 8.64e+8,
            domain: process.env.ORIGIN,
            path: '/',
            port: 3000
        })]);

        return {};
    } catch(e) {
        console.log(e);
        return { error: true }
    }

    return {};
}