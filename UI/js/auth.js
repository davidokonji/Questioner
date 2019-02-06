const signup_form =document.getElementById("signup-form");
const login_form =document.getElementById("login-form");
const login = document.getElementById('login');
const signup =  document.getElementById('signup');
const btn = document.getElementsByClassName('btn')[0];
const input = document.getElementsByClassName('input');
const showalert = document.getElementsByClassName('showalert')[0];
const alert = document.getElementsByClassName('alert')[0];
const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const newHeaders = new Headers();
newHeaders.append('Content-type','application/json');
newHeaders.append('Accept','application/json');
signup.addEventListener('click', show_signup);
login.addEventListener('click', show_login);
btn.addEventListener("click", function(){
  for (let i = 0; i < this.length; i++){
    input[i].value = "";
  }
});

function show_login(){
  signup_form.style.display="none";
login_form.style.display="block";
  login.style.background = "#fff";
 signup.style.background = "none";
}
function show_signup(){
   login_form.style.display="none";
  signup_form.style.display="block";
  signup.style.background = "#fff";
  login.style.background = "none";
}
window.onload = function() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('login').style.background = 'none';
};
class Authentication {
  static loginUser(event, form) {
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
          localStorage.setItem('token',data.data[0].token);
          localStorage.setItem('username',data.data[0].user.username);
          if (showalert.style.display = "none"){
            showalert.style.opacity= '1';
            showalert.style.display = 'block';
          }
          const message = `<div class="alert success">
            <b> successful </b>
        </div>`
        showalert.innerHTML += message;
        const alertTimeout = setTimeout(()=> {
          showalert.style.opacity= '0';
          showalert.style.display = 'none';
          clearTimeout(alertTimeout);
        },2000);
        setTimeout(()=>{
          window.location.href = "../pages/dashboard.html";
        },1000)
        }
        else{
          if (showalert.style.display = "none"){
            showalert.style.opacity= '1';
            showalert.style.display = 'block';
          }
          const message = `<div class="alert">
          <b> ${data.message} </b>
          </div>`
          showalert.innerHTML += message;
          setTimeout(()=> {
            showalert.style.opacity= '0';
            showalert.style.display = 'none';
          },2000)
        }

		})
		.catch(error => console.log(error))
  }
  static createUser(event, form) {
    event.preventDefault();
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const othername = form.othername.value;
    const username = form.username.value;
    const email = form.email.value;
    const phonenumber = form.phonenumber.value;
    const password = form.password.value;
    const body = {
      firstname,
      lastname,
      othername,
      username,
      email,
      phonenumber,
      password,
    };
    fetch(`${url}/auth/signup`,{
      method: 'post',
      body: JSON.stringify(body),
      headers: newHeaders,
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 201) {
        if(window.localStorage.getItem('token') !==''){
          window.localStorage.removeItem('token');
         }
        localStorage.setItem('token',data.data[0].token);
       
        if (showalert.style.display = "none"){
          showalert.style.opacity= '1';
          showalert.style.display = 'block';
        }
        const message = `<div class="alert success">
          <b> Welcome ${data.data[0].user.username} </b>
      </div>`
      showalert.innerHTML += message;
      const alertTimeout = setTimeout(()=> {
        showalert.style.opacity= '0';
        showalert.style.display = 'none';
        clearTimeout(alertTimeout);
      },2000);
      setTimeout(()=>{
        window.location.href = "../pages/dashboard.html";
      },1000);
      }
      else if(data.status === 400){
        if (showalert.style.display = "none"){
          showalert.style.opacity= '1';
          showalert.style.display = 'block';
        }
        const message = `<div class="alert">
        <b> Invalid Credentials </b>
        </div>`
        showalert.innerHTML += message;
        setTimeout(()=> {
          showalert.style.opacity= '0';
          showalert.style.display = 'none';
        },2000)
      }
    })
    .catch(error => console.log(error.message))
  }
}