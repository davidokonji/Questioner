const signout = document.querySelector('.signout');
signout.addEventListener('click', function (){
  window.localStorage.clear();
  setTimeout(()=>{
    window.location.href = '../../index.html';
  }, 1000)
});