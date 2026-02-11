import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overviewTab");
  const [error, setError] = useState(null);
  const [textToFilter, TextToFilter] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const usersURL = "https://jsonplaceholder.typicode.com/users";
  const postsURL = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        setLoading(true);

        const [postsRes, usersRes] = await Promise.all([
          fetch(postsURL),
          fetch(usersURL),
        ]);

        console.log("postsRes", postsRes);

        const postsData = await postsRes.json();
        const usersData = await usersRes.json();

        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError("Failed to Fetech data");
      } finally {
        setLoading(false);
      }
    }

    fetchDataFromAPI();
  }, []);

  const topFivePosts = posts?.filter((post) => post.id > 95); // filtering the top 5 posts having ids greater than 95
  console.log("Top 5 posts are: ", topFivePosts);

  const descendingOrderTopfivePosts = topFivePosts?.sort((a, b) => b.id - a.id); // sorting the top 5 posts in descending order based on id

  console.log("Top 5 posts are: ", descendingOrderTopfivePosts);

  const filteredTopFive = descendingOrderTopfivePosts?.filter((post) =>
    post.title.includes(textToFilter),
  ); // function to handle the filtering of the top 5 posts from the user with the textbox in the UI

  const userPosts = posts?.filter(
    (post) => post.userId === Number(selectedUserId),
  ); // To select the posts by a particular user

  console.log("user posts", userPosts);

  const highlightRandomPost = () => {
    if (userPosts.length === 0) return;

    const random = userPosts[Math.floor(Math.random() * userPosts?.length)];
    setHighlightedPostId(random.id);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading data...!</div>;
  if (error) return <div style={{ padding: 20 }}> {error} </div>;

  return (
    <div className="App">
      <h2>Posts and USers Dashboard</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("overviewTab")}>Overview</button>
        <button onClick={() => setActiveTab("detailsTab")}>Details</button>
      </div>

      {activeTab === "overviewTab" && (
        <div>
          <h3>Overview</h3>
          <p>Total No. of Users: {users?.length}</p>
          <p>Total No. of Posts: {posts?.length}</p>
          <input // Input textbox for the user to type text for filtering the top 5 posts.
            type="text"
            placeholder="Filter posts..."
            value={textToFilter}
            onChange={(e) => TextToFilter(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <ul>
            {filteredTopFive?.map((post) => (
              <li key={post.id}>{post?.title}</li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === "detailsTab" && (
        <div>
          <h3>Details</h3>

          <select //
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setHighlightedPostId(null);
            }}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user?.id}>
                {user?.name}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 10 }}>
            <button onClick={highlightRandomPost}>Highlight random post</button>
          </div>
          <ul style={{ marginTop: 10 }}>
            {userPosts.map((post) => (
              <li
                key={post.id}
                style={{
                  background:
                    post.id === highlightedPostId ? "yellow" : "transparent",
                  padding: "5px",
                }}
              >
                {post?.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
