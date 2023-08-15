const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/log-events');
const errorHandler = require('./middleware/error-handler');

const PORT = process.env.PORT || 3000;

const app = express();

// Custom middleware
app.use(logger);

const whiteList = ['http://localhost:3000', 'https://www.google.com.ua'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

app.use('/another-page', require('./routes/subdir'));
app.use('/', require('./routes/root'));

app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
  res.status(404);
  console.log(req);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
