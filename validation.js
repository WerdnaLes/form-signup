// validation script here
const inputs = document.querySelectorAll("input");
const showBtn = document.getElementById("show-button");
const passInput = document.getElementById("password");
let intervalId;
const submitBtn = document.getElementById("submit-button");
let isFormValid = true;
let neededFieldsCount = 0;

const patterns = {
  username: /^\w{5,12}$/,
  //   email: /^[\w\-\.]+@[\w-]+\.[a-z]+?\.?[a-z]+$/,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
  password: /^[\w\-@]{8,20}$/,
  telephone: /^\d{11}$/,
  slug: /^[a-z\d-]{8,20}$/,
};

// Add listeners to every input and check if input's value matches its regex:
addInputsListeners();
addButtonsListeners();

function addInputsListeners() {
  inputs.forEach((input) => {
    input.addEventListener("keyup", (e) => {
      // console.log(e.target.attributes.name.value)

      validate(e.target, patterns[e.target.attributes.name.value]);

      console.log(e.target.attributes.name.value);
    });
  });
}

function addButtonsListeners() {
  showBtn.addEventListener("mousedown", handleMouseDown);
  showBtn.addEventListener("mouseup", handleMouseUp);

  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    submitForm();
  });
}
// Change input's border color depending if it is valid or not:
function validate(field, regex) {
  if (!field.value) {
    field.className = "empty";
    return;
  }
  const isValid = regex.test(field.value);

  if (!isValid) {
    field.className = "invalid";
  } else {
    field.className = "valid";
  }
}

function handleMouseDown() {
  if (passInput.type === "password") {
    showBtn.innerHTML = "Hide";
    passInput.type = "text";
    intervalId = setInterval(() => {
      passInput.type = "text";
    }, 100);
  }
}

function handleMouseUp() {
  clearInterval(intervalId);
  if (passInput.type === "text") {
    passInput.type = "password";
    showBtn.innerHTML = "Show";
  }
}

// Submit form via 'Submit' button:
function submitForm() {
  const form = document.getElementById("my-form");
  const formData = new FormData(form);
  // receive a string line of fields that aren't filled correctly:
  let errorField = validateSubmit();

  if (isFormValid) {
    const blob = new Blob(
      [...formData.entries()].map(([key, value]) => `${key}: ${value}\n`),
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);

    downloadFile(url);
  } else {
    let fieldsCount = neededFieldsCount > 1 ? "fields" : "field";
    alert(`Please fill the following ${fieldsCount}: (${errorField})`);
  }
}

// Download the form in a .txt format to your PC:
function downloadFile(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "form-data.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Check what fields are invalid for submitting:
function validateSubmit() {
  let neededField = "";
  inputs.forEach((val) => {
    let inputName = val.attributes.name.value;
    let inputValue = val.value;

    if (!patterns[inputName].test(inputValue)) {
      isFormValid = false;
      neededFieldsCount++;
      // If the field is yet empty - fill it with the new val, if not - add space and comma between them:
      if (!neededField) {
        neededField += inputName;
      } else {
        neededField += ", " + inputName;
      }
    } else {
      if (neededFieldsCount > 0) {
        neededFieldsCount--;
      }
      isFormValid = true;
    }
  });
  return neededField;
}
