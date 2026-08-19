import { useState } from "react";
import "./Register.css";
import { registerFamily } from "../api/familyApi";

export default function Register() {
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const [data, setData] = useState({
    family: {
      family_name: "",
      family_origin: "",
      family_description: "",
    },

    founder: {
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
      phone: "",
      email: "",
      username: "",
      password: "",
    },

    parents: {
      enabled: false,

      father: {
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "Male",
        date_of_birth: "",
        national_id: "",
        is_alive: true,
        phone: "",
        email: "",
      },

      mother: {
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "Female",
        date_of_birth: "",
        national_id: "",
        is_alive: true,
        phone: "",
        email: "",
      },
    },

    siblings: {
      enabled: false,
      list: [],
    },

    spouse: {
      enabled: false,

      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
      is_alive: true,
      phone: "",
      email: "",

      createAccount: false,
      username: "",
      password: "",
    },
  });

  // ---- UPDATE HANDLERS ----
  const updateSection = (section, e) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [e.target.name]: e.target.value,
      },
    });
    // Clear error for this field
    clearFieldError(e.target.name);
  };

  const updateParent = (type, e) => {
    setData({
      ...data,
      parents: {
        ...data.parents,
        [type]: {
          ...data.parents[type],
          [e.target.name]: e.target.value,
        },
      },
    });
    // Clear error for this field
    const key = `parent_${type}_${e.target.name}`;
    if (validationErrors[key]) {
      setValidationErrors({ ...validationErrors, [key]: "" });
    }
  };

  const addSibling = () => {
    setData({
      ...data,
      siblings: {
        ...data.siblings,
        list: [
          ...data.siblings.list,
          {
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            date_of_birth: "",
            national_id: "",
            is_alive: true,
            phone: "",
            email: "",
            createAccount: false,
            username: "",
            password: "",
          },
        ],
      },
    });
  };

  const updateSibling = (index, e) => {
    let list = [...data.siblings.list];
    list[index][e.target.name] = e.target.value;

    setData({
      ...data,
      siblings: {
        ...data.siblings,
        list,
      },
    });
    // Clear error for this field
    const key = `sibling_${index}_${e.target.name}`;
    if (validationErrors[key]) {
      setValidationErrors({ ...validationErrors, [key]: "" });
    }
  };

  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors({ ...validationErrors, [fieldName]: "" });
    }
  };

  // ---- VALIDATION ----
  const validateStep = (stepNumber) => {
    const errors = {};

    if (stepNumber === 1) {
      if (!data.family.family_name || data.family.family_name.trim() === "") {
        errors["family_name"] = "Family name is required";
      }
    }

    if (stepNumber === 2) {
      const required = [
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "national_id",
        "phone",
        "email",
        "username",
        "password",
      ];
      required.forEach((field) => {
        if (!data.founder[field] || data.founder[field].trim() === "") {
          errors[field] = `${field.replace(/_/g, " ")} is required`;
        }
      });
      // Email format
      if (data.founder.email && !/\S+@\S+\.\S+/.test(data.founder.email)) {
        errors["email"] = "Please enter a valid email address";
      }
    }

    if (stepNumber === 3) {
      if (data.parents.enabled) {
        // Father
        const fatherFields = ["first_name", "last_name", "national_id", "phone", "email"];
        fatherFields.forEach((field) => {
          if (!data.parents.father[field] || data.parents.father[field].trim() === "") {
            errors[`parent_father_${field}`] = `Father's ${field.replace(/_/g, " ")} is required`;
          }
        });
        // Mother
        const motherFields = ["first_name", "last_name", "national_id", "phone", "email"];
        motherFields.forEach((field) => {
          if (!data.parents.mother[field] || data.parents.mother[field].trim() === "") {
            errors[`parent_mother_${field}`] = `Mother's ${field.replace(/_/g, " ")} is required`;
          }
        });
      }
    }

    if (stepNumber === 4) {
      if (data.siblings.enabled && data.siblings.list.length > 0) {
        data.siblings.list.forEach((sibling, index) => {
          const fields = ["first_name", "last_name", "gender", "national_id", "phone", "email"];
          fields.forEach((field) => {
            if (!sibling[field] || sibling[field].trim() === "") {
              errors[`sibling_${index}_${field}`] =
                `Sibling ${index + 1} ${field.replace(/_/g, " ")} is required`;
            }
          });
        });
      }
    }

    if (stepNumber === 5) {
      const required = [
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "national_id",
        "phone",
        "email",
      ];
      required.forEach((field) => {
        if (!data.spouse[field] || data.spouse[field].trim() === "") {
          errors[`spouse_${field}`] = `Spouse's ${field.replace(/_/g, " ")} is required`;
        }
      });
      if (data.spouse.createAccount) {
        if (!data.spouse.username || data.spouse.username.trim() === "") {
          errors["spouse_username"] = "Spouse username is required";
        }
        if (!data.spouse.password || data.spouse.password.trim() === "") {
          errors["spouse_password"] = "Spouse password is required";
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const handleBack = (prevStep) => {
    setStep(prevStep);
    setValidationErrors({});
  };
const submit = async(e)=>{

    e.preventDefault();

    try{


        const submitData = {


            // FAMILY
            family:{
                family_name:data.family.family_name,
                family_origin:data.family.family_origin,
                family_description:data.family.family_description
            },



            // FOUNDER
            founder:{
                first_name:data.founder.first_name,
                middle_name:data.founder.middle_name,
                last_name:data.founder.last_name,
                gender:data.founder.gender,
                date_of_birth:data.founder.date_of_birth,
                national_id:data.founder.national_id,
                phone:data.founder.phone,
                email:data.founder.email,
                username:data.founder.username,
                password:data.founder.password
            },



            // PARENTS
            parents:data.parents.enabled
            ?
            {
                father:data.parents.father,
                mother:data.parents.mother
            }
            :
            {
                father:null,
                mother:null
            },



            // SIBLINGS
            siblings:data.siblings.enabled
            ?
            data.siblings.list
            :
            [],



// SPOUSE
spouse:
data.spouse.first_name.trim() !== ""
?
{
    first_name:data.spouse.first_name,
    middle_name:data.spouse.middle_name,
    last_name:data.spouse.last_name,
    gender:data.spouse.gender,
    date_of_birth:data.spouse.date_of_birth,
    national_id:data.spouse.national_id,
    phone:data.spouse.phone,
    email:data.spouse.email,
    is_alive:data.spouse.is_alive
}
:
null

        };



        console.log(
            "FINAL DATA SENT:",
            submitData
        );



        const response = await registerFamily(
            submitData
        );


        console.log(
            "SERVER RESPONSE:",
            response
        );


        alert(
            "Registration Successfully"
        );


    }

    catch(error){


        console.log(
            "FULL ERROR:",
            error
        );


        console.log(
            "SERVER RESPONSE:",
            error.response?.data
        );


        alert(
            error.response?.data?.message ||
            "Registration failed"
        );


    }


};




  // Step labels for the progress bar
  const steps = ["Family", "Founder", "Parents", "Siblings", "Spouse"];

  // Helper: render error message for a field
  const renderError = (fieldKey) => {
    if (validationErrors[fieldKey]) {
      return <span className="error-text">{validationErrors[fieldKey]}</span>;
    }
    return null;
  };

  // Helper: get error class for a field
  const getErrorClass = (fieldKey) => {
    return validationErrors[fieldKey] ? "error" : "";
  };

  return (
    <div className="register-container">
      <h1>Family Registration</h1>
      <p className="subtitle">Complete each step to register your family</p>

      {/* ===== STEP PROGRESS ===== */}
      <div className="step-progress">
        <div
          className="progress-fill"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;

          return (
            <div
              key={label}
              className={`step-dot ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
              onClick={() => setStep(stepNum)}
            >
              <div className="dot">
                {isCompleted ? <span className="check">✓</span> : stepNum}
              </div>
              <span className="label">{label}</span>
            </div>
          );
        })}
      </div>

      {/* ===== STEP CONTENT ===== */}
      <div className="step-content">
        {/* STEP 1: FAMILY */}
        {step === 1 && (
          <div className="grid">
            <input
              name="family_name"
              placeholder="Family Name"
              className={getErrorClass("family_name")}
              onChange={(e) => updateSection("family", e)}
            />
            {renderError("family_name")}

            <input
              name="family_origin"
              placeholder="Family Origin"
              onChange={(e) => updateSection("family", e)}
            />

            <textarea
              name="family_description"
              placeholder="Description"
              onChange={(e) => updateSection("family", e)}
            />
          </div>
        )}

        {/* STEP 2: FOUNDER */}
        {step === 2 && (
          <div className="grid">
            <input
              name="first_name"
              placeholder="First name"
              className={getErrorClass("first_name")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("first_name")}

            <input
              name="middle_name"
              placeholder="Middle name"
              onChange={(e) => updateSection("founder", e)}
            />

            <input
              name="last_name"
              placeholder="Last name"
              className={getErrorClass("last_name")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("last_name")}

            <select
              name="gender"
              className={getErrorClass("gender")}
              onChange={(e) => updateSection("founder", e)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {renderError("gender")}

            <input
              type="date"
              name="date_of_birth"
              className={getErrorClass("date_of_birth")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("date_of_birth")}

            <input
              name="national_id"
              placeholder="National ID"
              className={getErrorClass("national_id")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("national_id")}

            <input
              name="phone"
              placeholder="Phone"
              className={getErrorClass("phone")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("phone")}

            <input
              name="email"
              placeholder="Email"
              className={getErrorClass("email")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("email")}

            <input
              name="username"
              placeholder="Username"
              className={getErrorClass("username")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("username")}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className={getErrorClass("password")}
              onChange={(e) => updateSection("founder", e)}
            />
            {renderError("password")}
          </div>
        )}
        {/* STEP 3: PARENTS */}
        {step === 3 && (
          <>
            <label>
              <input
                type="checkbox"
                checked={data.parents.enabled}
                onChange={(e) =>
                  setData({
                    ...data,
                    parents: {
                      ...data.parents,
                      enabled: e.target.checked,
                    },
                  })
                }
              />
              Add Parents
            </label>

            {data.parents.enabled && (
              <>
                {/* FATHER */}
                <div className="grid-nested">
                  <h3>
                    <span className="icon">👨</span> Father
                  </h3>
                  {[
                    "first_name",
                    "middle_name",
                    "last_name",
                    "date_of_birth",
                    "national_id",
                    "phone",
                    "email",
                  ].map((x) => (
                    <input
                      key={x}
                      name={x}
                      placeholder={x.replace(/_/g, " ")}
                      className={getErrorClass(`parent_father_${x}`)}
                      onChange={(e) => updateParent("father", e)}
                    />
                  ))}
                  {renderError(`parent_father_first_name`)}
                  {renderError(`parent_father_last_name`)}
                  {renderError(`parent_father_national_id`)}
                  {renderError(`parent_father_phone`)}
                  {renderError(`parent_father_email`)}

                  <select
                    name="is_alive"
                    onChange={(e) => updateParent("father", e)}
                  >
                    <option value="true">Alive</option>
                    <option value="false">Dead</option>
                  </select>
                </div>

                {/* MOTHER */}
                <div className="grid-nested">
                  <h3>
                    <span className="icon">👩</span> Mother
                  </h3>
                  {[
                    "first_name",
                    "middle_name",
                    "last_name",
                    "date_of_birth",
                    "national_id",
                    "phone",
                    "email",
                  ].map((x) => (
                    <input
                      key={x}
                      name={x}
                      placeholder={x.replace(/_/g, " ")}
                      className={getErrorClass(`parent_mother_${x}`)}
                      onChange={(e) => updateParent("mother", e)}
                    />
                  ))}
                  {renderError(`parent_mother_first_name`)}
                  {renderError(`parent_mother_last_name`)}
                  {renderError(`parent_mother_national_id`)}
                  {renderError(`parent_mother_phone`)}
                  {renderError(`parent_mother_email`)}

                  <select
                    name="is_alive"
                    onChange={(e) => updateParent("mother", e)}
                  >
                    <option value="true">Alive</option>
                    <option value="false">Dead</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 4: SIBLINGS */}
        {step === 4 && (
          <>
            <label>
              <input
                type="checkbox"
                checked={data.siblings.enabled}
                onChange={(e) =>
                  setData({
                    ...data,
                    siblings: {
                      ...data.siblings,
                      enabled: e.target.checked,
                    },
                  })
                }
              />
              Have siblings
            </label>

            {data.siblings.enabled && (
              <>
                <button className="add-sibling" onClick={addSibling}>
                  ＋ Add sibling
                </button>

                {data.siblings.list.map((s, index) => (
                  <div className="sibling-card" key={index}>
                    <h4>Sibling {index + 1}</h4>
                    {[
                      "first_name",
                      "middle_name",
                      "last_name",
                      "date_of_birth",
                      "national_id",
                      "phone",
                      "email",
                    ].map((x) => (
                      <input
                        key={x}
                        name={x}
                        placeholder={x.replace(/_/g, " ")}
                        value={s[x] || ""}
                        className={getErrorClass(`sibling_${index}_${x}`)}
                        onChange={(e) => updateSibling(index, e)}
                      />
                    ))}
                    {renderError(`sibling_${index}_first_name`)}
                    {renderError(`sibling_${index}_last_name`)}
                    {renderError(`sibling_${index}_national_id`)}
                    {renderError(`sibling_${index}_phone`)}
                    {renderError(`sibling_${index}_email`)}

                    <select
                      name="gender"
                      className={getErrorClass(`sibling_${index}_gender`)}
                      onChange={(e) => updateSibling(index, e)}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {renderError(`sibling_${index}_gender`)}

                    <input
                      name="username"
                      placeholder="Username"
                      onChange={(e) => updateSibling(index, e)}
                    />
                    <input
                      name="password"
                      placeholder="Password"
                      type="password"
                      onChange={(e) => updateSibling(index, e)}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* STEP 5: SPOUSE */}
        {step === 5 && (
          <div className="grid-nested">
            <h3>
              <span className="icon">💑</span> Spouse
            </h3>

            <input
              placeholder="Spouse first name"
              name="first_name"
              className={getErrorClass("spouse_first_name")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, first_name: e.target.value },
                });
                clearFieldError("spouse_first_name");
              }}
            />
            {renderError("spouse_first_name")}

            <input
              placeholder="Spouse middle name"
              name="middle_name"
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, middle_name: e.target.value },
                });
              }}
            />

            <input
              placeholder="Spouse last name"
              name="last_name"
              className={getErrorClass("spouse_last_name")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, last_name: e.target.value },
                });
                clearFieldError("spouse_last_name");
              }}
            />
            {renderError("spouse_last_name")}

            <select
              name="gender"
              className={getErrorClass("spouse_gender")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, gender: e.target.value },
                });
                clearFieldError("spouse_gender");
              }}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {renderError("spouse_gender")}

            <input
              type="date"
              name="date_of_birth"
              className={getErrorClass("spouse_date_of_birth")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, date_of_birth: e.target.value },
                });
                clearFieldError("spouse_date_of_birth");
              }}
            />
            {renderError("spouse_date_of_birth")}

            <input
              placeholder="National ID"
              name="national_id"
              className={getErrorClass("spouse_national_id")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, national_id: e.target.value },
                });
                clearFieldError("spouse_national_id");
              }}
            />
            {renderError("spouse_national_id")}

            <input
              placeholder="Phone"
              name="phone"
              className={getErrorClass("spouse_phone")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, phone: e.target.value },
                });
                clearFieldError("spouse_phone");
              }}
            />
            {renderError("spouse_phone")}

            <input
              placeholder="Email"
              name="email"
              className={getErrorClass("spouse_email")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, email: e.target.value },
                });
                clearFieldError("spouse_email");
              }}
            />
            {renderError("spouse_email")}

            <input
              placeholder="Username"
              name="username"
              className={getErrorClass("spouse_username")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, username: e.target.value },
                });
                clearFieldError("spouse_username");
              }}
            />
            {renderError("spouse_username")}

            <input
              placeholder="Password"
              type="password"
              name="password"
              className={getErrorClass("spouse_password")}
              onChange={(e) => {
                setData({
                  ...data,
                  spouse: { ...data.spouse, password: e.target.value },
                });
                clearFieldError("spouse_password");
              }}
            />
            {renderError("spouse_password")}
          </div>
        )}
      </div>

      {/* ===== NAVIGATION BUTTONS ===== */}
      <div className="buttons">
        <div className="left">
          {step > 1 && (
            <button className="back" onClick={() => handleBack(step - 1)}>
              ← Back
            </button>
          )}
        </div>
        <div className="right">
          {step < 5 && (
            <button className="next" onClick={() => handleNext(step + 1)}>
              Next →
            </button>
          )}
          {step === 5 && (
            <button className="register" onClick={submit}>
              🌳 Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}