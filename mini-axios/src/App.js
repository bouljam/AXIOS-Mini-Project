import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [currentPost, setCurrentPost] = useState({ id: null, title: '', body: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(result => {
        setPosts(result.data);
        setFilteredPosts(result.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    if (searchId === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(function (post) {
        return post.id === parseInt(searchId);
      });
      setFilteredPosts(filtered);
    }
  };

  const openModal = (post = { id: null, title: '', body: '' }, mode = "add") => {
    if (mode === "add") {
        post.id = posts.length > 0 ? posts.length + 1 : 1; 
    }
    setCurrentPost(post);
    setIsModalOpen(true);
    setIsEditMode(mode === "edit");
    setIsReadOnly(mode === "view");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPost({ id: null, title: '', body: '' });
    setIsEditMode(false);
    setIsReadOnly(false);
  };

  const handleSavePost = () => {
    if (isEditMode) {
      const updatedPosts = posts.map(function (post) {
        return post.id === currentPost.id ? { ...post, ...currentPost } : post;
      });
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } else {
      const postToAdd = { ...currentPost };
      setPosts(posts.concat(postToAdd));
      setFilteredPosts(filteredPosts.concat(postToAdd));
    }
    closeModal();
  };

  return (
    <div className="container-fluid px-5 py-4 bg-dark">
      <form>
        <input
          type="text" style={{border:'none', borderRadius:'5px', padding:'7px 5px'}}
          placeholder="Rechercher par ID"
          onChange={function (e) { setSearchId(e.target.value); }}
        />
        <button type="button" className="btn btn-outline-warning m-2" onClick={handleSearch}>Rechercher</button>
        <button type="button" className="btn btn-outline-success m-2" onClick={function () { openModal(); }}>Ajouter</button>

        <h2 className='text-center text-white mb-3'>Liste des publications</h2>
        <table className="table table-hover">
          <thead>
            <tr className='text-center'>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredPosts.length > 0 ? filteredPosts.map(function (post) {
                return (
                  <tr key={post.id}>
                    <td className='text-center'>{post.id}</td>
                    <td>{post.title}</td>
                    <td className='text-center'>
                      <button type="button" className="btn btn-outline-danger m-2" onClick={function () {
                        setFilteredPosts(filteredPosts.filter(function (item) { return item.id !== post.id; }));
                        setPosts(posts.filter(function (item) { return item.id !== post.id; }));
                      }}>Supprimer</button>
                      <button type="button" className="btn btn-outline-info m-2" onClick={function () { openModal(post, "view"); }}>Voir Détails</button>
                      <button type="button" className="btn btn-outline-dark m-2" onClick={function () { openModal(post, "edit"); }}>Modifier</button>
                    </td>
                  </tr>
                );
              }) : <td colSpan={3} className="text-center fw-bold">Aucune publication</td>
            }
          </tbody>
        </table>

        {
          isModalOpen && (
            <div className="modale">
              <div className="modale-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <label>ID : </label>
                <input type="text" className="form-control" readOnly value={currentPost.id} />
                <label>Titre : </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentPost.title}
                  readOnly={isReadOnly}
                  onChange={function (e) { setCurrentPost({ ...currentPost, title: e.target.value }); }}
                />
                <label>Body : </label>
                <textarea
                  className="form-control"
                  value={currentPost.body}
                  readOnly={isReadOnly}
                  onChange={function (e) { setCurrentPost({ ...currentPost, body: e.target.value }); }}
                />
                {!isReadOnly && (
                  <button type="button" className="btn btn-dark mt-2" onClick={handleSavePost}>
                    {isEditMode ? 'Modifier' : 'Ajouter'}
                  </button>
                )}
              </div>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default App;
