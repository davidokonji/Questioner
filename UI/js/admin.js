const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const newHeaders = new Headers();
newHeaders.append('Content-type','application/json');
newHeaders.append('Accept','application/json');
const form = document.forms['admin_signin'];
const showalert = document.getElementsByClassName('showalert')[0];
form.addEventListener('submit', (event) => Admin.loginAdmin(event,form));

class Admin {
  static loginAdmin(event, form) {
    event.preventDefault();
    const email = form.email.value; 
    const password = form.password.value;
    const data = {email, password};
    fetch(`${url}/auth/login`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: newHeaders,
    })
    .then(response => response.json())
		.then(data => {
        if (data.status === 200){
          if(window.localStorage.getItem('token') !==''){
          	window.localStorage.removeItem('token');
           }
           if (data.data[0].user.isadmin){
            localStorage.setItem('token',data.data[0].token);
            if (showalert.style.display = "none"){
              showalert.style.opacity= '1';
              showalert.style.display = 'block';
            }
            const message = `<div class="alert success">
              <b> Successful </b>
          </div>`
          showalert.innerHTML += message;
          const alertTimeout = setTimeout(()=> {
            showalert.style.opacity= '0';
            showalert.style.display = 'none';
            clearTimeout(alertTimeout);
          },2000);
          setTimeout(()=>{
            window.location.href = "../pages/admin.html";
          },1000);
           } else{
            if (showalert.style.display = "none"){
              showalert.style.opacity= '1';
              showalert.style.display = 'block';
            }
            const message = `<div class="alert">
            <b> Unauthorized Credentials </b>
            </div>`
            showalert.innerHTML += message;
            setTimeout(()=> {
              showalert.style.opacity= '0';
              showalert.style.display = 'none';
            },2000)
           }
        } else{
          console.log(data);
          alert('Invalid User Credentials');
        }
		})
		.catch(error => console.log(error))
  }

  static createMeetup (event, form) {

  }
}
