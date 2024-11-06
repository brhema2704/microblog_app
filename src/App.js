import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [currentUser, setCurrentUser] = useState('Hema');
  const [following, setFollowing] = useState([]);
  const [users] = useState(['Hema', 'Rithika', 'Esther']);
  const [likes, setLikes] = useState({});

  // Load data from local storage when the app is first loaded
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const storedFollowing = JSON.parse(localStorage.getItem('following')) || [];
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
    setPosts(storedPosts);
    setFollowing(storedFollowing);
    setLikes(storedLikes);
  }, []);

  // Save posts, following, and likes to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (following.length > 0) {
      localStorage.setItem('following', JSON.stringify(following));
    }
  }, [following]);

  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
  }, [likes]);

  const handlePost = () => {
    if (postText || postImage) {
      const newPost = {
        text: postText,
        image: postImage ? URL.createObjectURL(postImage) : null,
        author: currentUser,
        timestamp: new Date().toLocaleString(),
      };
      setPosts([newPost, ...posts]);
      setPostText('');
      setPostImage(null);
    }
  };

  const handleImageUpload = (e) => {
    setPostImage(e.target.files[0]);
  };

  const handleFollow = (user) => {
    setFollowing((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleLike = (index) => {
    const newLikes = { ...likes };
    newLikes[index] = newLikes[index] ? newLikes[index] + 1 : 1;
    setLikes(newLikes);
  };

  return (
    <div>
      <header>
        <h3>Microblog App</h3>
        <div className="user-switcher">
          <span>Logged in as: </span>
          <select onChange={(e) => setCurrentUser(e.target.value)} value={currentUser}>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="container">
        {/* Follow/Subscribe Section */}
        <div className="follow-section">
          <h4>People to Follow</h4>
          {users
            .filter((user) => user !== currentUser)
            .map((user) => (
              <div key={user} className="follow-item">
                <span>{user}</span>
                <button className="follow-btn" onClick={() => handleFollow(user)}>
                  {following.includes(user) ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
            ))}
        </div>

        {/* Create Post Section */}
        <div className="create-post">
          <textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <button onClick={handlePost}>Post</button>
        </div>

        {/* Display Posts */}
        <div className="posts">
          {posts.length === 0 ? (
            <div className="no-posts">No posts yet</div>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="post">
                <div className="post-avatar">
                  <img src="https://via.placeholder.com/50" alt="avatar" />
                </div>
                <div className="post-content">
                  <div className="post-author">{post.author}</div>
                  <div className="post-timestamp">{post.timestamp}</div>
                  <div className="post-text">{post.text}</div>
                  {post.image && (
                    <div className="post-image">
                      <img src={post.image} alt="Post" />
                    </div>
                  )}
                  <div className="post-actions">
                    <button onClick={() => handleLike(index)}>
                      Like {likes[index] ? `(${likes[index]})` : ''}
                    </button>
                    <span> {likes[index] || 0} likes</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

