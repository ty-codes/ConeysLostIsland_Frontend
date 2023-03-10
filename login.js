const loading = `
      <div class='spinner-border spinner-border-sm' role='status'>
        <span class="sr-only"></span>
      </div>`

async function validateDetails() {
  const username= document.getElementById("username").value;
  const password = document.getElementById("password").value;
  document.getElementById("login").innerHTML = loading;
  document.getElementById("error-message").innerText = "";

  try {
    await fetch('https://coneyslostisland.onrender.com/login', {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {
        'Content-Type': 'application/json',
      }
    }
    ).then(async (res) => {
      if(res.status === 200) {
        await res.json().then(token => {
        console.log("authenticated");
        localStorage.setItem("token", token.token);
        window.location.replace("admin.html");
        })
        
      } else if(res.status >= 400){
        localStorage.removeItem("token");
        const error = await res.json()
        throw Error(error.message)
    }
    })
  } catch(err) {
    document.getElementById("error-message").innerText = err;
    document.getElementById("login").innerText = "Login";
  }
}


class Login {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validateonSubmit();
  }

  validateonSubmit() {
    let self = this; // setup calls to the "this" values of the class described in the constructor

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateDetails();
    
    });
  }

  validateFields(field) {
    // remove any whitespace and check to see if the field is blank, if so return false
    if (field.value.trim() === "") {
      // set the status based on the field, the field label, and if it is an error message
      this.setStatus(
        field,
        `${field.previousElementSibling.innerText} cannot be blank`,
        "error"
      );
      return false;
    } else {
      // if the field is not blank, check to see if it is password
      if (field.type == "password") {
        // if it is a password, check to see if it meets our minimum character requirement
        if (field.value.length < 8) {
          // set the status based on the field, the field label, and if it is an error message
          this.setStatus(
            field,
            `${field.previousElementSibling.innerText} must be at least 8 characters`,
            "error"
          );
          return false;
        } else {
          // set the status based on the field without text and return a success message
          this.setStatus(field, null, "success");
          return true;
        }
      } else {
        // set the status based on the field without text and return a success message
        this.setStatus(field, null, "success");
        return true;
      }
    }
  }

  setStatus(field, message, status) {
    // create variable to hold message
    const errorMessage = field.parentElement.querySelector(".error-message");

    // if success, remove messages and error classes
    if (status == "success") {
      if (errorMessage) {
        errorMessage.innerText = "";
      }
      field.classList.remove("input-error");
    }
    // if error, add messages and add error classes
    if (status == "error") {
      errorMessage.innerText = message;
      field.classList.add("input-error");
    }
  }
}

const form = document.querySelector(".loginForm");
// if the form exists, run the class
if (form) {
  // setup the fields we want to validate, we only have two but you can add others
  const fields = ["username", "password"];
  // run the class
  const validator = new Login(form, fields);
}
