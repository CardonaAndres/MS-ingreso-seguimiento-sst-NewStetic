import 'dotenv/config';
import app from './configs/app.js';

app.listen(process.env.PORT, '0.0.0.0', () => console.log('SERVER RUNNING ON PORT: ' + process.env.PORT));
