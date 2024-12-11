import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle saving user's data here
    navigate("/");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
    >
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Complete Your Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input type="text" className="form-control" id="name" required />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="skillLevel" className="form-label">
              Skill Level
            </label>
            <select className="form-select" id="skillLevel" required>
              <option value="">Select a skill level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <textarea
              className="form-control"
              id="bio"
              rows={3}
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="sports" className="form-label">
              Sports Interested In
            </label>
            <select className="form-select" id="sports" multiple>
              <option value="basketball">Basketball</option>
              <option value="soccer">Soccer</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
              <option value="Badminton">Badminton</option>
              <option value="Pickleball">Pickleball</option>
            </select>
            <small className="text-muted">
              Hold Ctrl (Windows) or Command (Mac) to select multiple options.
            </small>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
