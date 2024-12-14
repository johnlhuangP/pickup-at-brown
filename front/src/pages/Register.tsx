import "bootstrap/dist/css/bootstrap.min.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

type Sport = {
  name: string;
  label: string;
  selected: boolean;
  skillLevel: string;
}

function Register() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [clerkUserId, setClerkUserId] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [first_name, setFirstName] = useState<string | null>("");
  const [last_name, setLastName] = useState<string | null>("");
  const [user_profile_created, setUserProfileCreated] = useState<boolean>(false);

    const [sports, setSports] = useState<Sport[]>([
    { name: "basketball", label: "Basketball", selected: false, skillLevel: "" },
    { name: "soccer", label: "Soccer", selected: false, skillLevel: "" },
    { name: "tennis", label: "Tennis", selected: false, skillLevel: "" },
    { name: "volleyball", label: "Volleyball", selected: false, skillLevel: "" },
    { name: "badminton", label: "Badminton", selected: false, skillLevel: "" },
    { name: "pickleball", label: "Pickleball", selected: false, skillLevel: "" },
  ]);


  const [formData, setFormData] = useState({
    username: '',
    skillLevel: '',
    bio: '',
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

  const handleFormDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes in the sports checkboxes/dropdowns
  const handleSportChange = (
    index: number,
    field: "selected" | "skillLevel",
    value: boolean | string
  ) => {
    setSports((prevSports) => {
      const updated = [...prevSports];
      // If toggling the checkbox:
      if (field === "selected" && typeof value === "boolean") {
        updated[index].selected = value;
      }
      // If changing the skill level:
      if (field === "skillLevel" && typeof value === "string") {
        updated[index].skillLevel = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null); // Reset error state

    const chosenSports = sports
      .filter((sport) => sport.selected)
      .map((sport) => ({
        sport_name: sport.name,
        skill_level: sport.skillLevel || "beginner", // default if blank
        notification_enabled: true,
      }));

    console.log(formData);

    const requestBody = {
      "email": email,
      "username": formData.username,
      "password": "password",
      "first_name": first_name,
      "last_name": last_name,
      "bio": formData.bio,
      "sport_preferences": chosenSports,
      "skill_level": formData.skillLevel,
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
              onChange={handleFormDataChange}
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
              onChange={handleFormDataChange}
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
              onChange={handleFormDataChange}
            />
          </div>

          {/* Sports & Skill Levels */}
          <label className="form-label">Sports Interested In</label>
          {sports.map((sport, index) => (
            <div key={sport.name} className="mb-3">
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
              {/* If the sport is selected, show skill dropdown */}
              {sport.selected && (
                <select
                  className="form-select mt-1"
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

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Save
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default Register;
