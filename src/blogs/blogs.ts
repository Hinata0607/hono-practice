import { Hono } from "hono";

const app = new Hono();

// ブログダミーデータ
let blogPosts = [
    {
      id: "1",
      title: "blog1",
      content: "Blog 1 Posts",
    },
    {
      id: "2",
      title: "blog2",
      content: "Blog 2 Posts",
    },
    {
      id: "3",
      title: "blog3",
      content: "Blog 3 Posts",
    },
  ]

// 第二火キスはコンテキストをcという名前で受け取るらしい(まあ何でもいいよ)
// cはjson形式にして出力するよ(軽量だから)
// /postsにアクセスして仮置きブログでーあにアクセスできることを確認
// /posts?prettyにアクセスすると見やすいJSON形式でデータにアクセス可能(ミドルウェア)
app.get("/", (c) => c.json({
    posts: blogPosts,
  }))
  
  
  // 特定のブログを取得するAPI
  // 書いてる途中にエラーが出るが、returnを書いてないだけなので気にしない
  
  // Expressと少し違うのは、Expressは第二引数にreqやresをとるが、honoはc(コンテキストのみ)という点
  app.get("/:id", (c) => {
    const id = c.req.param("id");
    const post = blogPosts.find((p) => p.id == id);
    if (post) {
      return c.json(post);
    } else {
      return c.json({ message: "not found this page" }, 404); // JSONの台に引数はステータスコード
    }
  })
  
  // 投稿作成API
  // postするときは非同期処理です
  // postman APIかなんかで試してみるべし
  app.post("/", async (c) => {
    const { title, content } = await c.req.json<{ title: string, content: string }>(); // 型ジェネリクスで指定できるよ
    const newPost = { id: String(blogPosts.length + 1), title, content };
    blogPosts = [...blogPosts, newPost ];
    return c.json(newPost, 201); // 上手くいった場合
  })
  
  // 記事更新API
  app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const index = blogPosts.findIndex((p) => p.id === id);
  
    if (index === -1) {
      return c.json({message: "Post not found"}, 404);
    }
  
    const { title, content } = await c.req.json();
    blogPosts[index] = {...blogPosts[index], title, content};
  
    return c.json(blogPosts[index]);
  })
  
  // 記事削除API
  app.put("/:id", async (c) => {
    const id = c.req.param("id");
    const index = blogPosts.findIndex((p) => p.id === id);
  
    if (index === -1) {
      return c.json({message: "Post not found"}, 404);
    }
  
    blogPosts = blogPosts.filter((p) => p.id !== id);
  
    return c.json({ message: "Blog post deleted" }, 201);
  })

export default app;