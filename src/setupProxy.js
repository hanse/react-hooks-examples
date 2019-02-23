module.exports = function(app) {
  const users = [
    { id: 1, name: 'johannes' },
    { id: 2, name: 'petter' },
    { id: 3, name: 'therese' }
  ];

  app.get('/api/users', (req, res) => {
    setTimeout(() => {
      res.send(users);
    }, 5000);
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === +req.params.id);
    if (!user) {
      return res
        .status(404)
        .send({ message: `user with id ${+req.params.id} not found` });
    }

    setTimeout(() => {
      res.send(user);
    }, 3000);
  });
};
