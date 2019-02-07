const addBtn = document.querySelector('#new-toy-btn')
const orderButton = document.querySelector('#order-toys-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector("#toy-collection")
const submitButton = document.querySelector('#submit')
let sortedToys = []
let addToy = false

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    document.addEventListener('submit', () => {
      event.preventDefault()
      toyNameInput = event.target.image.value
      toyImageInput = event.target.name.value
      addNewToy(toyNameInput, toyImageInput)
    })
  } else {
    toyForm.style.display = 'none'
  }
})

//get toys
const getToys = () => {
  toyCollection.innerHTML = ""
  return fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toys => renderToys(toys))
}

//render toys
const renderToys = toys => toys.forEach(toy => renderToy(toy))

//render single toy
const renderToy = (toy) => {
  toyCard = document.createElement('div')
  toyCard.className="card"
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar">
    <p>${toy.likes} Likes <p>
    <button class="like-btn">Like <3</button>
    <button class="delete-btn">Delete <\/3</button>
  `
  toyLikeButton = toyCard.querySelector('.like-btn')
  toyLikeButton.addEventListener('click', () => {
    increaseLikes(toy)
  })

  toyDeleteButton = toyCard.querySelector('.delete-btn')
  toyDeleteButton.addEventListener('click', () => {
    deleteToy(toy)
  })

  toyCollection.append(toyCard)
}

//add a new toy
const addNewToy = (image, name) => {
  return fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      "image": image,
      "likes": 0
    })
  }).then(getToys)
}


//increase a toy's likes
const increaseLikes = toy => {
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "likes": toy.likes + 1
    })
  }).then(getToys)
}

//delete a toy
const deleteToy = toy => {
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'DELETE'
  }).then(getToys)
}


//order by umber of likes
orderButton.addEventListener('click', () => {
  fetchOrderedToys()
})

const fetchOrderedToys = () => {
  toyCollection.innerHTML = ""
  return fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toys => sortToys(toys))
}

const sortToys = (toys) => {
  sortedToys = toys.sort((a,b) => (a.likes > b.likes) ? -1 : (b.likes > a.likes) ? 1 : 0)
  renderToys(sortedToys)
}


//init function
const init = () => {
  getToys()
}


init()
