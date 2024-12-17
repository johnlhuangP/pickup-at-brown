import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

type Sport = {
  name: string;
  label: string;
  selected: boolean;
  skillLevel: string;
}

function Register() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    bio: '',
  });

  const [sports, setSports] = useState<Sport[]>([
    { name: "basketball", label: "Basketball", selected: false, skillLevel: "" },
    { name: "soccer", label: "Soccer", selected: false, skillLevel: "" },
    { name: "tennis", label: "Tennis", selected: false, skillLevel: "" },
    { name: "volleyball", label: "Volleyball", selected: false, skillLevel: "" },
    { name: "badminton", label: "Badminton", selected: false, skillLevel: "" },
    { name: "pickleball", label: "Pickleball", selected: false, skillLevel: "" },
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
  }, [user, navigate]);

  const handleFormDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSportChange = (
    index: number,
    field: "selected" | "skillLevel",
    value: boolean | string
  ) => {
    setSports((prevSports) => {
      const updated = [...prevSports];
      if (field === "selected" && typeof value === "boolean") {
        updated[index].selected = value;
      }
      if (field === "skillLevel" && typeof value === "string") {
        updated[index].skillLevel = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("No authenticated user found");
      return;
    }

    // Validate that selected sports have skill levels
    const invalidSports = sports
      .filter(sport => sport.selected && !sport.skillLevel);
    
    if (invalidSports.length > 0) {
      setFormError(`Please select skill levels for: ${invalidSports.map(s => s.label).join(', ')}`);
      return;
    }

    const chosenSports = sports
      .filter((sport) => sport.selected)
      .map((sport) => ({
        sport_name: sport.name,
        skill_level: sport.skillLevel,
        notification_enabled: true,
      }));

    if (chosenSports.length === 0) {
      setFormError("Please select at least one sport");
      return;
    }

    const requestBody = {
      email: user.email,
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      supabase_id: user.id,
      bio: formData.bio,
      sport_preferences: chosenSports
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.status === 400) {
        setFormError("Invalid request: " + (data.detail || 'Please check your input'));
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate("/");
    } catch (error) {
      console.error('Error creating profile:', error);
      setFormError("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Complete Your Profile</h3>
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
              onChange={handleFormDataChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleFormDataChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleFormDataChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <textarea
              className="form-control"
              name="bio"
              value={formData.bio}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Sports & Skill Levels</label>
            {sports.map((sport, index) => (
              <div key={sport.name} className="mb-3 border-bottom pb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id={`sport-${sport.name}`}
                    className="form-check-input"
                    checked={sport.selected}
                    onChange={(e) => handleSportChange(index, "selected", e.target.checked)}
                  />
                  <label htmlFor={`sport-${sport.name}`} className="form-check-label">
                    {sport.label}
                  </label>
                </div>
                {sport.selected && (
                  <select
                    className="form-select mt-2"
                    value={sport.skillLevel}
                    onChange={(e) => handleSportChange(index, "skillLevel", e.target.value)}
                  >
                    <option value="">Choose skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
