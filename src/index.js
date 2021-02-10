// Detail Panel
const detailsDiv = document.querySelector("#spice-blend-detail")
const detailsImg = detailsDiv.querySelector(".detail-image")
const detailsTitle = detailsDiv.querySelector(".title")
const ingredientsDiv = detailsDiv.querySelector(".ingredients-container")
const ingredientsList = detailsDiv.querySelector(".ingredients-list")
const spiceImages = document.querySelector("#spice-images")
//Forms
const updateForm = document.querySelector('#update-form')
const newForm = document.querySelector('#ingredient-form')

//Urls
const spicesUrl = 'http://localhost:3000/spiceblends'
const ingredientsUrl = 'http://localhost:3000/ingredients'

//ItemIDs
let firstSpiceID = "1"

//***************** Network Requests *****************//
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

const postIngredient = e => {
  const spiceblendId = parseInt(e.target.dataset.id)
  let name = e.target.name.value
  // Select first letter of word and replace 
  name = name.replace(/\b\w/, name.charAt(0).toUpperCase())

  config = {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify( {name, spiceblendId})
  }

  //return promise to render function
  return fetch(ingredientsUrl, config)
  .then( r => r.json() )
}



//************* DOM Manipulation *****************//
const renderSpicesMenu = _ => {
  getAllSpices()
  .then( spiceArray => {
    Array.from(spiceImages.children).forEach(child => child.remove())
    for (spice of spiceArray){
      createMenuItem(spice)
    }
  })
}

const createMenuItem = spiceData => {
  const img = document.createElement("img")
  img.src = spiceData.image
  img.alt = spiceData.title
  img.className = "spice"
  img.dataset.id = spiceData.id
  spiceImages.append(img)
}


const showSpice = id => {
  getSpice(id).then( spiceData => renderSpice(spiceData))
}

const updateSpice = e => {
  e.preventDefault()
  patchSpice(e).then( spiceData => {
    detailsTitle.textContent = spiceData.title
  })
  e.target.reset()
}

//Update Details elements. 
const renderSpice = spiceData => {
  detailsDiv.dataset.id = spiceData.id
  detailsImg.src = spiceData.image
  detailsImg.alt = spiceData.title
  detailsTitle.textContent =  spiceData.title
  updateForm.dataset.id = spiceData.id
  newForm.dataset.id = spiceData.id
  
  // Remove existing Ingredients and re-render
  Array.from(ingredientsList.children).forEach (child => child.remove())
  for (ingredient of spiceData.ingredients) {
    renderIngredient(ingredient)
  }
}

const renderIngredient = ingredient => {
    const li = document.createElement("li")
    li.dataset.ingredientid = ingredient.id
    li.textContent = ingredient.name
    ingredientsList.append(li)
}

const createIngredient = e => {
  e.preventDefault()
  postIngredient(e).then( data => renderIngredient(data) )
  e.target.reset()
}


//***************** Listeners *****************//
const handleClick = e => {
  switch(true) {
    case (e.target.className === "spice"):
      showSpice(e.target.dataset.id)
  }
}

updateForm.addEventListener('submit', updateSpice)
newForm.addEventListener('submit', createIngredient)
spiceImages.addEventListener('click', handleClick)
//***************** Iniitialize the Page *****************//
renderSpicesMenu()
showSpice(firstSpiceID)
