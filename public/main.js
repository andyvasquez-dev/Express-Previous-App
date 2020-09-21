document.addEventListener('DOMContentLoaded', ()=>{
  shuffle();
  getLeaderBoard();
})

document.querySelector('.container').addEventListener('click',()=>{
  document.querySelector('.bar1').classList.toggle('change')
  document.querySelector('.bar2').classList.toggle('change')
  document.querySelector('.bar3').classList.toggle('change')
  document.querySelector('.overlay').classList.toggle('hidden')
  // document.querySelector('').classList.toggle()

})

function getLeaderBoard(){
  fetch('/leaderboard',{
    method:'GET'
  })
    .then(res=>res.json())
    .then(data=>{
      console.log(data.timestamps)
      const leaderboard =document.querySelector('.leaderboard')
      leaderboard.innerHTML = ""
      data.timestamps.sort((a,b) => parseFloat(a.time) - parseFloat(b.time))
      console.log(data.timestamps);
      data.timestamps.forEach((entry, i) => {

        let li = document.createElement('li')
        li.classList.add('entry')

        let pUser = document.createElement('p')
        let userNode = document.createTextNode(entry.username)
        pUser.appendChild(userNode)

        let pTime = document.createElement('p')
        let timeNode = document.createTextNode(entry.time)
        pTime.appendChild(timeNode)

        li.appendChild(pUser)
        li.appendChild(pTime)

        leaderboard.appendChild(li)
      });
    })
}

const button = document.querySelector('button')
let usersTimes = []
let hasEvent = false;

function shuffle(){
  usersTimes=[]
  console.log('shuffle');
  fetch('/shuffle',{
    method:'get'
  })
    .then(res => res.json())
    .then(data =>{
      let cards = document.querySelectorAll('.flipCard') // array of all cards
      Array.from(document.querySelectorAll('img')).forEach((image, i) => {
        image.src = data[i]
        let hasEvent=false;
        if( hasEvent === false ){
          for(let i = cards.length-1; i>=0; i--){
          document.querySelectorAll('.flipCard')[i].addEventListener('click', (e)=>{  // each time at click it is evalutating
              let twoReveals = document.querySelectorAll('.reveal') // how many have been selected
              if (twoReveals.length<2) { // once two have been revealed then ......
                cards[i].classList.add('reveal')
                if(usersTimes.length===0){
                  const start = new Date();
                  console.log('start: ' + start.getTime())
                  usersTimes.push(start.getTime())
                }
                    checkMatch(e)
              }
            })
          }
        }
      });
    })
}

function checkWin(){
  let userMatchList = document.querySelectorAll('.stayFlipped')
  if(userMatchList.length===10){
    console.log('winner');
    document.querySelector('.winner').textContent ='You Win';

    const end = new Date();
    console.log('end: ' + end.getTime())
    usersTimes.push(end.getTime())

    setTimeout(()=>{
      let userName=prompt('enter your username to be put on the leaderboards, if the username is taken, you will overwrite it')

      if(userName==="" || userName===undefined){
        console.log('no user inputted to the leaderboards');
      }
      else {
        fetch('/storewin', {
          method: 'PUT',
          headers:{'Content-Type' : 'application/json'},
          body:JSON.stringify({
            'username' : userName,
             'time' : usersTimes[1]-usersTimes[0]
          })
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            // window.location.reload(true)
            getLeaderBoard();
          })
      }
    },675)
  }
}

function checkMatch(e){
  const currentSelections = document.querySelectorAll('.reveal')
    if (currentSelections.length===2) {
      console.log('end of round');
      if (currentSelections[0].children[1].childNodes[1].src === currentSelections[1].children[1].childNodes[1].src) {
        Array.from(currentSelections).forEach((selection)=>{
          selection.classList.add('stayFlipped')
          selection.classList.remove('reveal')
          checkWin();
        })
      }
      else {
        console.log('not a match');
        let cards = Array.from(document.querySelectorAll('.flipCard')) // array of all cards
        setTimeout(()=>{
          console.log('finally');
          cards.forEach(card=>{
            setTimeout(()=>{
              card.classList.remove('reveal')
            },250)
          })
        }, 750);
      }
    }

}

button.addEventListener('click', function(){
  let flipped = document.querySelectorAll('.flipCard')

  Array.from(flipped).forEach(card => {
    console.log(card);
    if (card.classList.contains('reveal')) {
      card.classList.remove('reveal')
    }
     if(card.classList.contains('stayFlipped')) {
       card.classList.remove('stayFlipped')
    }
  })
setTimeout(()=>{shuffle()},250)

})
