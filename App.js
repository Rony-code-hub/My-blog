import { useState, useEffect, createContext, useContext } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//1. Create a context
const PostContext = createContext();

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [isFakeDark, setIsFakeDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );
  return (
    //2. Provide value to child components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      <section>
        <button
          className="btn-fake-dark-mode"
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        >
          {isFakeDark ? "🌙" : "☀️"}{" "}
        </button>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </section>
    </PostContext.Provider>
  );
}

function Header() {
  //3. Consuming context value
  const { onClearPosts } = useContext(PostContext);
  return (
    <header>
      <h1>
        <span>🌼</span> The Atomic Blog
      </h1>
      <div>
        <Result />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = useContext(PostContext);
  return (
    <input
      placeholder="Search posts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

function Result() {
  const { posts } = useContext(PostContext);
  return <p>🚀 {posts.length} atomic post found</p>;
}

function Main() {
  return (
    <main>
      <FormAddPost />
      <Post />
    </main>
  );
}

function FormAddPost() {
  const { onAddPost } = useContext(PostContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Post body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button>Add post</button>
    </form>
  );
}

function Post() {
  return (
    <section>
      <List />
    </section>
  );
}

function List() {
  const { posts } = useContext(PostContext);
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  const { onAddPost } = useState(PostContext);
  const [posts] = useState(() =>
    Array.from({ length: 50 }, () => createRandomPost())
  );
  const [showArchive, setShowArchive] = useState(false);
  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((showArchive) => !showArchive)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as a new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
