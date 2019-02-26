const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const title = document.getElementsByTagName('title')[0];
const nav_username = document.getElementById('nav_img');
const fullname = document.querySelector('.user_fullname');
const user_name = document.querySelector('.name');
const editbtn = document.querySelector('.editbtn');
const count = document.querySelectorAll('.count');
const question_list = document.querySelector('.question_list');
//Localstorage values
const token = window.localStorage.getItem('token');
const username = window.localStorage.getItem('username');

title.innerText = `${username}'s Profile- Questioner`;
nav_username.innerText = username;
const newHeaders = new Headers();
newHeaders.append('Content-type','application/json');
newHeaders.append('Accept','application/json');
newHeaders.append('x-access-token',token);

window.addEventListener('load', async () => {
  if(!window.localStorage.getItem('token')){
    setTimeout(()=>{
    window.location.href = '../pages/auth.html';
    },1000);
  }
  await User.getuser();
  await User.getquestioncount();
  await User.getcommentcount();
  await User.getTopQuestions();
})

class User {
  static getuser() {
    fetch(`${url}/user/`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((Response) => Response.json())
    .then((data) => {
      fullname.innerText = `${data.data[0].lastname} ${data.data[0].firstname}`
      user_name.innerText = data.data[0].username;
      editbtn.id = `${data.data[0].id}`;

    })
    .catch((error) => console.log(error))
  }
  static getquestioncount() {
    fetch(`${url}/user/questions`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      count[0].innerText = `${data.questionCount}`
    })
    .catch((error) => console.log(error))
  }
  static getcommentcount() {
    fetch(`${url}/user/questions/comments`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      count[1].innerText = `${data.commentCount}`
    })
    .catch((error) => console.log(error))
  }
  static getTopQuestions() {
    fetch(`${url}/meetups/rsvp/topquestions`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.data[0].length === 0) {
        question_list.innerHTML = `<li class="list">
            <div class='feedback_text'>
               rsvp meetup questions not available
             </div>
          </li>`
      }
      let text = ` <li class="list">
                <div class="list_details">
                  <div class="question">
                      question titlequestion titlequestion titlequestion titlequestion titlequestion title
                  </div>
                  <div class="meetup_name">
                    meetup name
                  </div>
                </div>
                <div class="vote">
                  <span>2 </span> vote(s)
                </div>
              </li>`;
    })
    .catch((error) => console.log(error))
  }
}