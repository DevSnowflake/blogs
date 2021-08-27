export default (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${process.env.DISCORD_CLIENT_ID}&scope=identify&state=&redirect_uri=${encodeURIComponent(`${process.env.ORIGIN}/authorize/callback`)}&prompt=consent`);
}