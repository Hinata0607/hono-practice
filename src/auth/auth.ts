import { Hono } from 'hono';

const app = new Hono();

app.get('/auth/page', (c) => {
	return c.text('You are authorized');
});

export default app;
