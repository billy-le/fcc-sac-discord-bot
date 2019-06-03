import axios from 'axios';
import config from '../../../../config';
import express from 'express';

const router = express.Router();

router.get('/oauth/meetup', (_req, res) => {
    const meetupAuthorizationPage = `https://secure.meetup.com/oauth2/authorize?client_id=${
        config.meetup.clientId
    }&response_type=code&redirect_uri=${config.meetup.oauthCallbackUrl}`;
    return res.redirect(meetupAuthorizationPage);
});

router.get('/oauth/meetup/callback', (req, res) => {
    const { code } = req.query;
    const meetupAccessTokenUrl = `https://secure.meetup.com/oauth2/access?client_id=${
        config.meetup.clientId
    }&client_secret=${
        config.meetup.secret
    }&grant_type=authorization_code&redirect_uri=${
        config.meetup.oauthCallbackUrl
    }&code=${code}`;

    axios
        .post(
            meetupAccessTokenUrl,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        .then(res => {
            const { data } = res;
            console.log(data);
        })
        .catch(err => console.log(err))
        .finally(() => res.status(200).end());
});

export default router;
