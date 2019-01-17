const signup_form =document.getElementById("signup-form");
const login_form =document.getElementById("login-form");
const login = document.getElementById('login');
const signup =  document.getElementById('signup');
const btn = document.getElementsByClassName('btn')[0];
const input = document.getElementsByClassName('input');

btn.addEventListener("click", function(){
  input[0].value = "";
})

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