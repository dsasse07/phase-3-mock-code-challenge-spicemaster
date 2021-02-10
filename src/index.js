// Detail Panel
const detailsDiv = document.querySelector("#spice-blend-detail")
const detailsImg = detailsDiv.querySelector(".detail-image")
const detailsTitle = detailsDiv.querySelector(".title")
const ingredientsDiv = detailsDiv.querySelector(".ingredients-container")
const ingredientsList = detailsDiv.querySelector(".ingredients-list")

//Forms
const updateForm = document.querySelector('#update-form')
const newForm = document.querySelector('#ingredient-form')

//Urls
const spicesUrl = 'http://localhost:3000/spiceblends'

//ItemIDs
let firstSpiceID = "1"

// Network Requests //
const getAllSpices = _ =>{
  return fetch(spicesUrl)
  .then( response => response.json() )
}

const getSpice = id => {
  return fetch( spicesUrl+`/${id}` )
  .then( response => response.json() )
}

const patchSpice = e => {
  const id = e.target.dataset.id
  const title = e.target.title.value
  const config = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify( {title})
  }
  return fetch( spicesUrl+`/${id}?_embed=ingredients`, config )
  .then( response => response.json() )
}

// DOM Manipulation

const showSpice = id => {
  getSpice(id).then( spiceData => renderSpice(spiceData))
}

const updateSpice = e => {
  e.preventDefault()
  patchSpice(e).then(data => {
    debugger
    renderSpice(data)
  })
}

const renderSpice = spiceData => {
  detailsDiv.dataset.id = spiceData.id
  detailsImg.src = spiceData.image
  detailsImg.alt = spiceData.title
  detailsTitle.textContent =  spiceData.title
  for (ingredient of spiceData.ingredients) {
    const li = document.createElement("li")
    li.dataset.ingredientid = ingredient.id
    li.textContent = ingredient.name
    ingredientsList.append(li)
  }
  updateForm.dataset.id = spiceData.id
  newForm.dataset.id = spiceData.id
}

showSpice(firstSpiceID)

updateForm.addEventListener('submit', updateSpice)