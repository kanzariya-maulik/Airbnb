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

  let toogle = document.getElementById("flexSwitchCheckDefault");
  toogle.addEventListener("click",()=>{
    let tax_val = document.getElementsByClassName("tax-value");
    for(tax of tax_val){
      if(tax.style.display != "block"){
        tax.style.display="block";
      }else{
        tax.style.display="none";
      }
    }
  })