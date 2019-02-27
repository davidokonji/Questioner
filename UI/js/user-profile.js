const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const title = document.getElementsByTagName('title')[0];
const nav_username = document.getElementById('nav_img');
const fullname = document.querySelector('.user_fullname');
const user_name = document.querySelector('.name');
const editbtn = document.querySelector('.editbtn');
const count = document.querySelectorAll('.count');
const question_list = document.querySelector('.question_list');
const meetup_list = document.querySelector('.meetup_list');
const user_profile = document.forms['user-profile'];
const user_picture = document.querySelector('#profile-img-tag');
const display_pic = document.querySelector('.profile_img');
//Localstorage values
const token = window.localStorage.getItem('token');
const username = window.localStorage.getItem('username');

title.innerText = `${username}'s Profile- Questioner`;
nav_username.innerText = username;
const newHeaders = new Headers();
newHeaders.append('Content-type','application/json');
newHeaders.append('Accept','application/json');
newHeaders.append('x-access-token',token);
// window.addEventListener("click", function(){
//   modal.classList.toggle("show-modal");
// });
user_profile.addEventListener('submit', (event) => User.editProfile(event, user_profile));

document.querySelector("#profile-img").addEventListener('change',function readURL(input) {
  if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();          
      reader.onload = function (e) {
          user_picture.src = e.target.result;
      }
      reader.readAsDataURL(input.target.files[0]);
  }
});

window.addEventListener('load', async () => {
  if(!window.localStorage.getItem('token')){
    setTimeout(()=>{
    window.location.href = '../pages/auth.html';
    },1000);
  }
  document.getElementById('username').placeholder = username;
  await User.getuser();
  await User.getquestioncount();
  await User.getcommentcount();
  await User.getTopQuestions();
  await User.getUpcoming();
});
question_list.onclick = e => {
  let action = e.target.dataset.action;
  let meetupid = e.target.dataset.meetupid;

  if (action === 'question'){
    if (window.localStorage.getItem('id') !== '' ){
      window.localStorage.removeItem('id');
    }
    if(meetupid) {
      window.localStorage.setItem('id', meetupid);
      window.location.href = '../pages/meetup.html';
    }
  }
}
meetup_list.onclick = e => {
  let action = e.target.dataset.action;
  let meetupid = e.target.dataset.meetupid;

  if (action === 'upcoming'){
    if (window.localStorage.getItem('id') !== '' ){
      window.localStorage.removeItem('id');
    }
    if(meetupid) {
      window.localStorage.setItem('id', meetupid);
      window.location.href = '../pages/meetup.html';
    }
  }
}

class User {
  static getuser() {
    fetch(`${url}/user/`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((Response) => Response.json())
    .then((data) => {
      if(data.status === 401){
        window.localStorage.clear();
        window.location.href = '../pages/auth.html';
      }
      fullname.innerText = `${data.data[0].lastname} ${data.data[0].firstname}`
      user_name.innerText = data.data[0].username;
      editbtn.id = `${data.data[0].id}`;
      if (data.data[0].images !== null) {
        display_pic.src = data.data[0].images[0];
      }

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
      if (data.status === 404) {
        count[0].innerText = '0';
      }
      if (data.status === 200) {
        count[0].innerText = `${data.questionCount}`;
      }
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
      if (data.status === 404) {
        question_list.innerHTML = `<li class="list">
        <div class='feedback_text'>
           rsvp meetup questions not available
         </div>
      </li>`
      }
      if (data.data[0].length === 0) {
        question_list.innerHTML = `<li class="list">
            <div class='feedback_text'>
               rsvp meetup questions not available
             </div>
          </li>`
      }
      if (data.status === 200) {
        data.data[0].map((top) => {
          let text = ` <li class="list" data-action='question' data-meetupid=${top.meetupid}>
                  <div class="list_details">
                    <div class="question">
                        ${top.title}
                    </div>
                    <div class="meetup_name">
                      ${top.meetupTopic}
                    </div>
                  </div>
                  <div class="vote">
                    <span>${top.vote}</span> vote(s)
                  </div>
                </li>`;
          question_list.innerHTML += text;
        });
      }
    })
    .catch((error) => console.log(error))
  }

  static getUpcoming() {
    fetch(`${url}/user/upcomingmeetups`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 404) {
        question_list.innerHTML = `<li class="list">
        <div class='feedback_text'>
           rsvp meetup questions not available
         </div>
      </li>`
      }
      if (data.data[0].length === 0) {
        meetup_list.innerHTML = `<li class="list">
            <div class='feedback_text'>
               no upcoming scheduled meetup
             </div>
          </li>`
      }
      data.data[0].map((meetup) => {
        let text = ` <li class="list" data-action='upcoming' data-meetupid = ${meetup.id}>
                    <div class="list_details">
                      <div class="meetup_name">
                        ${meetup.topic}
                      </div>
                      <div class="meetup_location">
                          <img src="../resources/svg/location.svg" alt="" width="15px"
                          height="15px">
                          ${meetup.location}
                      </div>
                      <div class="meetup_date">
                          <img src="../resources/svg/calendar.svg" alt="" width="15px"
                          height="15px">
                          ${moment(meetup.happeningon).format('MMM D [at] h:mm a')}
                        </div>
                    </div>
                  </li>`;
        meetup_list.innerHTML += text;
      });
    })
    .catch((error) => console.log(error))
  }

  static editProfile(event, form) {
    event.preventDefault();
    let formData = new FormData();
    if (form.image.files[0] !== undefined) {
    formData.append('images',form.image.files[0]);
    }
    if (form.username.value.length !== 0) {
      formData.append('username', form.username.value);
    }
    if (form.aboutme.value.length !== 0) {
      formData.append('about', form.aboutme.value);
    }
    const data = {
      password: form.password.value,
      confirmpassword: form.c_password.value
    }

    const user = fetch(`${url}/user/edit`,{
      method: 'POST',
      headers: new Headers({
        'x-access-token': token
      }),
      body: formData,
    }).then((respone) => respone.json());

    const password = fetch(`${url}/user/edit/password`,{
      method: 'POST',
      headers: new Headers({
        'x-access-token': token
      }),
      body: JSON.stringify(data),
    }).then((respone) => respone.json());
    Promise.all([user, password])
    .then(([res1,res2]) => {
      console.log('result one', res1);
      console.log('result two', res2);
    })
    .catch(error => console.log(error))
    // .then((respone) => respone.json())
    // .then((data) => {
    //   display_pic.src = data.data[0].images[0];
    //   modal.classList.toggle("show-modal");
    // })
  }
}