const request = require('request');
const UserModel = require('../database/Models/user.model');

exports.getRepository = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=10
               &sort=created:asc
               &client_id=${process.env.GITHUB_CLIENT_ID}
               &client_secret=${process.env.GITHUB_CLIENT_SECRET}`,

      method: 'GET',

      headers: { 'user-agent': 'node.js' },
    };
    request(options, async (error, response, body) => {
      if (error) return res.status(500).json({ message: 'Something went wrong', err: error, status: 500 });
      body = JSON.parse(body);
      if (response.statusCode !== 200) {
        return res.status(404).json({ message: 'User Handle Not Found', status: 404 });
      }
      if (body.length == 0)
        return res.status(404).json({ message: 'No Repository Found For This User Handle', status: 404 });

      const data = [];
      await Promise.all(
        body.map(item => {
          data.push({
            repoName: item.name,
            ownerName: item.owner.login,
            description: item.description,
            stars: item.stargazers_count,
            url: item.clone_url,
          });
        }),
      );
      res.status(200).json({ message: 'Respositories fetched successfully', data: data, status: 200 });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: 'Server Error!', status: 500 });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (user)
      return res
        .status(200)
        .json({ message: 'User Handle fetched successfully', data: user, type: 'database', status: 200 });

    const options = {
      uri: `https://api.github.com/users/${req.params.username}?client_id=${process.env.GITHUB_CLIENT_ID}
             &client_secret=${process.env.GITHUB_CLIENT_SECRET}`,

      method: 'GET',

      headers: { 'user-agent': 'node.js' },
    };
    request(options, async (error, response, body) => {
      body = JSON.parse(body);
      if (error) return res.status(500).json({ message: 'Something went wrong', status: 500 });

      if (response.statusCode !== 200) {
        res.status(404).json({ message: 'User Handle Not Found', status: 404 });
      }

      const data = {
        username: body.login,
        email: '',
        image: body.avatar_url,
        github_url: body.url,
        followers: body.followers,
        followingCount: body.following,
        repoCount: body.public_repos,
        memberSince: body.created_at,
      };
      const newUser = await UserModel.create(data);

      res.status(200).json({ message: 'User Handle fetched successfully', data: data, type: 'github', status: 200 });
    });
  } catch (err) {
    res.status(500).send({ message: 'Server Error!', status: 500 });
  }
};
