const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const nav_username = document.getElementById('nav_img');
const title = document.getElementsByTagName('title')[0];
const token = window.localStorage.getItem('token');
const username = localStorage.getItem('username');
const cardslide = document.getElementsByClassName('cardslide')[0];
nav_username.innerText = username;
title.innerText = `${username} Dashboard`;
function getid (d){
  const id = d.dataset.id;
  if (window.localStorage.getItem(id) !== ''){
    window.localStorage.removeItem('id');
  }
  window.localStorage.setItem('id', id);
  window.location.href = '../pages/meetup.html';
}
window.onload = () => {
  Dashboard.getallMeetup();
}
class Dashboard {
  static getallMeetup () {
    fetch(`${url}/meetups`,{
      method: 'GET',
      headers: {
        'Content-type':'application/json',
        'Accept': 'application/json',
        'x-access-token': token,
      },
    })
    .then(response => response.json())
    .then(data => {
      data.data.map((item)=> {
          // console.log(moment(item.happeningOn).format('YYYY DD'));
        let tag_pills = ``;
        const tags = item.tags;
          tags.forEach((tag) => {
              if (tags){
                  tag_pills += ` <span class="tag_pills">
                            ${tag}
                        </span>`;
              }
          });
        const data = ` <div class="card">
        <div class="card_image">
            <img src="${item.images}" alt="meetup image" data-id=${item.id} onclick="getid(this)">
        </div>
        <div class="card_body">
            <div class='side_date'>
                <span class="month">Jan</span>
                <span class="day">10</span>
            </div>
            <div class="body_side">
                <div class="card_title">
                    <span class="title"><a data-id=${item.id} onclick="getid(this)">${item.title} </a></span>
                </div>
                <div class="card_date">
                    <span class="date_logo"><img src="../resources/svg/calendar.svg" alt="" width="20px"
                            height="20px"></span>
                    <span class="date">${item.happeningOn}</span>
                </div>
                <div class="card_location">
                    <span class="location_logo"><img src="../resources/svg/location.svg" alt="" width="20px"
                            height="20px"></span>
                    <span class='location'> ${item.location}</span>
                </div>
                <div class="card_question">
                  <div class="tags">
                    ${tag_pills}
                   </div>
                    <span class="question"> 20 questions</span>
                </div>
            </div>
        </div>
    </div>`;
    cardslide.innerHTML += data;
      })
    })
		.catch(error => console.log(error));
  }
  static getMeetupById(id) {
    fetch(`${url}/meetups/${id}`,{
      method: 'GET',
      headers: new Headers({
        'x-access-token': token
      }),
    })
    .then((response) => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => console.log(error))
  }
}