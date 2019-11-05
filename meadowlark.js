const express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
const path = require('path');
const fortune = require('./lib/fortune');

const app = express();

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', {fortunes: fortune.getFortune() });
});

// custom 404 page
app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log(`Express started on http://localhost:${app.get('port')} ; press Ctrl-C to terminate`);
});