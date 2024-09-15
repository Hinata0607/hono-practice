import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import blogs from './blogs/blogs';
import auth from './auth/auth';
import { basicAuth } from 'hono/basic-auth';

const app = new Hono();

// Expressと同じくapp.useでミドルウェアを追加可能

// アスタリスクですべてのエンドポイントに対してprettyJSON(JSONを見やすくするミドルウェア)を追加
app.use('*', prettyJSON());
// APIを実行する前に認証を挟むミドルウェアの例
// /auth/* とすることで/authのAPIを実行する際に認証可能
app.use(
	'/auth/*',
	basicAuth({
		username: 'hinata',
		password: 'hinata',
	})
);
// CORS矢firebase認証, cash周りのミドルウェアもあるので見ておくべし

// ブログ関連のエンドポイントをリファクタリングする例(Expressとほぼ同じ)
app.route('/posts', blogs);
app.route('/auth', auth);

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

export default app;
