import express from 'express';
const app = express();
app.get('/', (req, res) => res.json({ ok: true }));
app.listen(3001, () => console.log('SERVER OK en 3001'));
