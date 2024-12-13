import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [clerkUserId, setClerkUserId] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [first_name, setFirstName] = useState<string | null>("");
  const [last_name, setLastName] = useState<string | null>("");
  const [user_profile_created, setUserProfileCreated] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: '',
    skillLevel: '',
    bio: '',
    sports: [] as string[]
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    setClerkUserId(user.id);
    setEmail(user.primaryEmailAddress?.emailAddress);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setUserProfileCreated(true);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'sports') {
      const select = e.target as HTMLSelectElement;
      const selectedSports = Array.from(select.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedSports
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null); // Reset error state

    console.log(formData);

    const requestBody = {
      "email": email,
      "username": formData.username,
      "password": "password",
      "first_name": first_name,
      "last_name": last_name,
      "bio": formData.bio,
      "sport_preferences": formData.sports.map((sport) => ({ "sport_name": sport, "skill_level": "placeholder", "notification_enabled": true })),
      "user_profile_created": user_profile_created,
      "clerk_id": clerkUserId,
    };
    console.log(requestBody);

    async function createUserProfile() {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (response.status === 400) {
        setFormError("Invalid request: " + (data.detail || 'Please check your input'));
        return null
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return data;
    }
    const result = await createUserProfile();
    if (result) {
      navigate("/");
    };
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
        {formError && (
          <div className="alert alert-danger mt-3" role="alert">
            {formError}
            <p>Please fix the error and try again.</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="skillLevel" className="form-label">
              Skill Level
            </label>
            <select
              className="form-select"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              required
            >
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
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sports" className="form-label">
              Sports Interested In
            </label>
            <select
              className="form-select"
              name="sports"
              multiple
              value={formData.sports}
              onChange={handleChange}
              required
            >
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
