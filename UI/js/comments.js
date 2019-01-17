var btnAsk = document.querySelector(".btnAsk");
var counter = document.querySelector("#num");
var upvote = document.getElementById("up");
var downvote = document.getElementById("down");
var questions = document.getElementsByClassName("question_sess");
var quesList = document.querySelector("#ques_list");
var commentBtn = document.getElementById("commentBtn");
var postBtn = document.getElementById("postCom");
var commentPost = document.getElementById("commentPost");

quesList.onclick = e => {
  let action = e.target.dataset.action;
  if (action == "up") {
    e.target.parentNode.children[1].children[0].stepUp(1);
  } else if (action == "down") {
    e.target.parentNode.children[1].children[0].stepDown(1);
  } else if (action == "addComment") {
    //shows comment box
    e.target.parentNode.children[1].style.display = "block";
    e.target.parentNode.children[2].style.display = "block";
  } else if (action == "postCom") {
    // add a new comment
    e.target.parentNode.parentNode.parentNode.children[1].innerHTML +=`<div class="commentPost">${e.target.parentNode.children[1].value}</div>`;
      // e.target.parentNode.children[1].innerText;
    e.target.parentNode.parentNode.parentNode.children[1].style.display =
      "block";
  }
};
btnAsk.addEventListener("click", addQuestion);
function addQuestion(e) {
  e.preventDefault();
  //picks the value in the question input box
  var ques = document.getElementById("question").value;
  //create a new DOM element in string format
  let domManipulation = `<li class='question_tab' >
      <div class="vote">
        <button class="voteBtn" data-action = 'up'> <i class="fa fa-caret-up fa-3x" id="up"></i></button>
        <div id="count">
          <input type='number' min= 0 id="num" value="0" disabled/>
        </div>
        <button class="voteBtn" data-action = 'down'> <i class="fa fa-caret-down fa-3x" id="down" ></i></button>
      </div>
      <div class="question_sess" >
        <!--modified here make changes in javascript -->
        <div class = 'postQues'> 
            ${ques}
        </div>
        <div id="commentPost">
          
        </div>
        <div>
          <div class="comment">
            <a class='commentBtn' id="commentBtn" class="postC" data-action='addComment'>add a comment <i class='fa fa-comments fa-lg'></i></a>
              <textarea class='commentBox' id='commentBox' ></textarea>
            <button class='btn btn-primary'  id='postCom' data-action='postCom'>submit</button>
          </div>
      </div>
    </li>`;
  //appends the question list
  quesList.innerHTML += domManipulation;
  //queslist.appendChild(domManipulation);
}
