const url = 'https://secret-river-12005.herokuapp.com/api/v1';
const title = document.getElementsByTagName('title')[0];
const tags_pill = document.getElementsByClassName('tags_pill')[0];
const nav_username = document.getElementById('nav_img');
const subcontainer_top = document.getElementsByClassName('subcontainer_top')[0];
const meetup_img = document.getElementsByClassName('meetup_img')[0];
const title_body = document.getElementsByClassName('title_body')[0];
const date_title = document.getElementsByClassName('date_title')[0];
const venue_body = document.getElementsByClassName('venue_body')[0];
const rsvp_body = document.getElementsByClassName('rsvp_body')[0];
const tags_body = document.getElementsByClassName('tags_body')[0];
const submitBtn =document.querySelector("#Btn");
const questionList = document.querySelector('.ques_list');
const question_form = document.forms['post-question'];
//Localstorage values
const token = window.localStorage.getItem('token');
const id = window.localStorage.getItem('id');
const username = window.localStorage.getItem('username');
const meetup_title = window.localStorage.getItem('meetup_title');
// 
question_form.addEventListener('submit', (event) => Meetup.postQuestion(event,question_form,id));
title.innerText = meetup_title || 'Meetup';
nav_username.innerText = username;
const newHeaders = new Headers();
newHeaders.append('Content-type','application/json');
newHeaders.append('Accept','application/json');
newHeaders.append('x-access-token',token);

window.addEventListener('load', async () => {
  if(!window.localStorage.getItem('token')){
    setTimeout(()=>{
    window.location.href = '../pages/auth.html';
    },1000)
  }
  await Meetup.getMeetupById(id);
  await Meetup.getQuestions(id);
})
function getvalues(d){
  const id = d.dataset.id;
  const response = d.dataset.response;
  return Meetup.rsvpMeetup(id, response)
}
questionList.onclick = e => {
  let action = e.target.dataset.action;
  const questionid = e.target.dataset.questionid;
  if (action === 'up'){
    return Meetup.questionUpvote(questionid);
  }
  if (action === 'down') {
    return Meetup.questionDownvote(questionid);
  }
  if ( action == 'addComment'){
    e.target.parentNode.children[1].classList.toggle('commentBox');
  }
  if (action == 'postCom'){
    let id = e.target.dataset.questionid;
    const comment = document.getElementById(`commentText-${id}`);
    e.target.parentNode.children[1].style.display ='none';
    return Meetup.postComment(id,comment.value)
  }
}

class Meetup {
  static getMeetupById(id) {
    fetch(`${url}/meetups/${id}`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then(data => {
        let tag_pills = ``;
        const tags = data.data[0].tags;
          tags.forEach((tag) => {
              if (tags){
                  tag_pills += ` <div class="tags_pill" data-id = ${data.data[0].id} >
                            ${tag}
                        </div>`;
              }
          });
          meetup_img.innerHTML = ` <img src="${data.data[0].images}" alt="meetup image">`;
          title_body.innerText = `${data.data[0].topic}`;
          date_title.innerHTML = ` <img src="../resources/svg/calendar.svg" alt="" width="40px" height="40px">
                                  ${data.data[0].happeningOn}`;
          venue_body.innerText = ` ${data.data[0].location}`;
          rsvp_body.innerHTML = `<button class="rsvpBtn1" data-id = ${data.data[0].id} data-response="yes" onclick="getvalues(this)" >Yes</button>
                                <button class="rsvpBtn2" data-id = ${data.data[0].id} data-response="no" onclick="getvalues(this)">No</button>
                                <button class="rsvpBtn3" data-id = ${data.data[0].id} data-response="maybe" onclick="getvalues(this)">Maybe</button>`;
          tags_body.innerHTML = `${tag_pills}`;
    })
    .catch((error) => console.log(error))
  }

  static rsvpMeetup (id, val){
    const data =  {
      response: `${val}`,
    }
    fetch(`${url}/meetups/${id}/rsvps`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 201) {
        rsvp_body.innerHTML = '<p> Thanks for the response!</p>';
      }
      if (data.status === 400) {
        if (data.message === 'meetup cannot be RSVP more than once') {
          rsvp_body.innerHTML = '<p class="rsvpResponse"> Thanks, Response already taken </p>';
        }
      }
    })
    .catch((error) => console.log(error))
  }

  static postQuestion (event,form,id) {
    event.preventDefault();
    const title = form.title.value;
    const body = form.body.value;
    const meetupId = id;
    const data = {meetupId,title,body};
    fetch(`${url}/questions`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: newHeaders,
    })
    .then((response)=> response.json())
    .then((data) => {
      modal.classList.toggle("show-modal");
        let newQuestion = ` <li class='question_tab'>
                    <div class="vote">
                        <button class="voteBtn" data-action='up' data-questionid=${data.data[0].id} >
                            <i class="fa fa-caret-up fa-3x" data-action='up' id="up"></i>
                        </button>
                        <div id="count" class="count">
                          <span class="num" id = ${data.data[0].id}>
                          ${data.data[0].vote}
                          </span>
                        </div>
                        <button class="voteBtn" data-action='down' data-questionid=${data.data[0].id} >
                            <i class="fa fa-caret-down fa-3x" data-action='down' id="down"></i>
                        </button>
                    </div>
                    <div class="question_sess">
                        <div class="quesTitle">
                         ${data.data[0].title}
                        </div>
                        <div class='postQues'>
                        ${data.data[0].body}
                        </div>
                        <div class="quesDetail">
                            <div class="detailTop"> 
                                asked <span class="quesDate">${moment(data.data[0].createdon).format('MMM D [at] h:mm a')}</span>
                            </div>
                            <div class="detailBottom">
                                ${data.data[0].user}
                            </div>
                        </div>
                        <div>
                          <ul>
                          </ul>
                        </div>
                        <div class="comment">
                        <a class="commentBtn" id="commentBtn" class="postC"
                            data-action='addComment'>add a comment
                            <i class='fa fa-comments fa-lg'></i>
                        </a>
                        <div class="commentBox">
                        <textarea class = 'commentText' id= 'commentText-${question.id}' name="comment" ></textarea>
                        <button class="btn btn-primary" id='postCom'
                        data-action='postCom' data-questionid=${question.id} 
                         onsubmit= "test(this)"
                        > post </button>
                    </div>
                    </div>
                    </div>
                </li>`;
                questionList.innerHTML += newQuestion;
    })
    .catch((error) => console.log(error))
  }
  static postComment (id, comment) {
    const data = {
      questionId: id,
      comment: comment,
    }
    fetch(`${url}/comments/`,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      const commentList = document.querySelector('.commentList');
      const comment = `<li class= "commentPost">${data.data[0].comment}
                    <span class='commentDetails'>
                      <span class = 'commentUser'> ${data.data[0].userid} </span>
                      <span class='commentDate'> ${moment(data.data[0].createdon).format('MMM D [at] h:mm a')}
                      </span>
                    </span>
                    </li>`;
      commentList.innerHTML += comment;
    })
    .catch((error) => console.log(error))
  }

  static getQuestions(id){
    fetch(`${url}/meetups/${id}/questions`,{
      method: 'GET',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then(data => {
      if (data.data.length === 0){
        questionList.innerHTML = '<p class="questionFeedback">No questions available for this meetup</p>'
      }
      data.data.map((question)=> {
        let comment = ``;
        const comments = question.comments;
        comments.forEach((comm) => {
          if(comm) {
            comment += `<li class= "commentPost">${comm.comment}
                       <span class='commentDetails'>
                       <span class = 'commentUser'> ${comm.userid} </span>
                       <span class='commentDate'> ${moment(comm.createdon).format('MMM D [at] h:mm a')}
                       </span>
                       </span>
                       </li>`
          }
        })
        let newQuestion = ` <li class='question_tab'>
                    <div class="vote">
                        <button class="voteBtn" data-action='up' data-questionid=${question.id} >
                            <i class="fa fa-caret-up fa-3x" data-action='up' id="up"></i>
                        </button>
                        <div id="count" class="count">
                        <span class="num" id = ${question.id}>
                        ${question.vote}
                        </span>
                        </div>
                        <button class="voteBtn" data-action='down' data-questionid=${question.id} >
                            <i class="fa fa-caret-down fa-3x" data-action='down' id="down"></i>
                        </button>
                    </div>
                    <div class="question_sess">
                        <div class="quesTitle">
                         ${question.title}
                        </div>
                        <div class='postQues'>
                        ${question.body}
                        </div>
                        <div class="quesDetail">
                            <div class="detailTop"> 
                                asked <span class="quesDate">${moment(question.createdon).format('MMM D [at] h:mm a')}</span>
                            </div>
                            <div class="detailBottom">
                                ${question.createdby}
                            </div>
                        </div>
                        <div>
                          <ul class = 'commentList'>
                            ${comment}
                          </ul>
                        </div>
                            <div class="comment">
                                <a class="commentBtn" id="commentBtn" class="postC"
                                    data-action='addComment'>add a comment
                                    <i class='fa fa-comments fa-lg'></i></a>
                                    <div class="commentBox">
                                        <textarea class = 'commentText' id= 'commentText-${question.id}' name="comment" ></textarea>
                                        <button class="btn btn-primary" id='postCom'
                                        data-action='postCom' data-questionid=${question.id} 
                                         onsubmit= "test(this)"
                                        > post </button>
                                </div>
                            </div>
                    </div>
                </li>`;
                questionList.innerHTML += newQuestion;
      })
    })
  }

  static questionUpvote (id){
    fetch(`${url}/questions/${id}/upvote/`,{
      method: 'PATCH',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      const questionid = document.getElementById(`${id}`);
      questionid.innerHTML = data.data[0].votes;
    })
    .catch((error) => console.log(error))
  }

  static questionDownvote (id){
    fetch(`${url}/questions/${id}/downvote/`,{
      method: 'PATCH',
      headers: newHeaders,
    })
    .then((response) => response.json())
    .then((data) => {
      const questionid = document.getElementById(`${id}`);
      questionid.innerHTML = data.data[0].votes;
    })
    .catch((error) => console.log(error))
  }
}