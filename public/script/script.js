(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();

  // Get the toggle switch and tax-value elements
let toggle = document.getElementById("flexSwitchCheckDefault");
let taxValues = document.getElementsByClassName("tax-value");

// Function to update visibility of tax values based on toggle state
function updateTaxValues(state) {
  for (let tax of taxValues) {
    tax.style.display = state ? "block" : "none";
  }
}

// Check localStorage for the toggle state and apply it
let isToggled = localStorage.getItem("toggleState") === "true";
toggle.checked = isToggled; // Set the initial state of the toggle switch
updateTaxValues(isToggled); // Update the tax values based on the saved state

// Add an event listener to handle toggle changes
if (toggle) {
  toggle.addEventListener("click", () => {
    // Update the toggle state
    let currentState = toggle.checked;

    // Store the state in localStorage
    localStorage.setItem("toggleState", currentState);

    // Update the tax values
    updateTaxValues(currentState);
  });
}

  
