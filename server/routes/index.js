const cryptoRoutes = require('./crypto');

const constructorMethod = (app) => {
  
app.use('/', cryptoRoutes);
app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;