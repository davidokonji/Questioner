const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const meetupform = document.forms['meetup-form'];
let meetupTable = document.getElementsByClassName('meetup-body')[0];
const token = window.localStorage.getItem('token');
const submitBtn =document.querySelector("#Btn");
function getid(d){
  let id = d.dataset.id;
  new duDialog('Delete meetup', 'This action cannot be undone, proceed?', duDialog.OK_CANCEL, { okText: 'Proceed',
  callbacks: {
    okClick: function(){
      Meetup.deleteMeetup(id);
      this.hide(); 
    },
    cancelClick: function(){
      this.hide();
    }
  }
});
}
meetupform.addEventListener('submit', (event) => Meetup.createMeetup(event, meetupform));

setTimeout(()=>{
  window.onload = function() {
    Meetup.getallMeetup();
  }
}, 5000)
window.onload = function() {
  Meetup.getallMeetup();
}

class Meetup {
  static createMeetup (event, form) {

    event.preventDefault();
    let formData = new FormData();
    formData.append('topic',form.topic.value);
    formData.append('location',form.location.value);
    formData.append('happeningOn',form.happeningon.value);
    formData.append('tags',form.tags.value);
    formData.append('images',form.images.files[0]);
    fetch(`${url}/meetups`,{
      method: 'POST',
      headers: new Headers({
        'x-access-token': token
      }),
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
       modal.classList.toggle("show-modal");
       Meetup.getallMeetup();
    })
		.catch(error => console.log(error));

  }
  static deleteMeetup (id) {
    fetch(`${url}/meetups/${id}`,{
      method: 'delete',
      headers: new Headers({
        'x-access-token': token
      }),
    })
    .then((response) => response.json())
    .then(data => {
      window.location.reload(true);
      Meetup.getallMeetup();
    })
    .catch((error) => console.log(error))
  }
  
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
        let rows = `<tr>
        <td class="topic">
          <p class="title">
            ${item.title}
          </p>
          <div class="title_section">
            <p class="date">
             <span><img src="../resources/svg/calendar.svg" alt="" width="20px"
              height="20px"> ${item.happeningOn}
            </span>
            </p>
            <p class="location">
               <span>
                  <img src="../resources/svg/location.svg" alt="" width="20px"
                  height="20px">
                  ${item.location}
               </span> 
            </p>
          </div>
        </td>
        <td class="operation">
          <button class="btn operationBtn delete" data-id='${item.id}' onclick="getid(this)">Delete</button>
          <button class="btn operationBtn view" data-id='${item.id}'>View</button>
        </td>
      </tr>`;
      meetupTable.innerHTML += rows;
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