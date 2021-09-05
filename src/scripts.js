import styles from './styles.css';
import UserData from './classes/UserData.js';
import Recipe from './classes/Recipe.js';
import RecipeRepository from './classes/RecipeRepository.js';
import Ingredient from './classes/Ingredient.js';
import rightArrow from './data/assets/Right-arrow.svg';
import pancakes from './data/assets/pancakes.svg';
import starActive from './data/assets/star-active.svg';
import star from './data/assets/star.svg';
import {usersData} from './data/users.js';
import {recipeData} from './data/recipes.js';

// BUTTONS & SECTIONS //

const allRecipeGrid = document.querySelector('#allRecipeGrid');
const mainContent = document.querySelector('#mainContent');
const allRecipeContainer = document.querySelector('#allRecipeContainer');
const allRecipes = document.querySelector('#allRecipesButton');
const recipeGrid = document.querySelector('#recipeGrid');
const contentContainer = document.querySelector('.content-container');
const searchSubmitBtn = document.querySelector('.search-submit-btn');
const searchFieldInput = document.querySelector('.search-field');
const fullRecipe = document.querySelector('.full-recipe-container');
const recipeFormTitle = document.querySelector('#recipeFormTitle');
const recipeFormImage = document.querySelector('#recipeFormImage');
const recipeFormIngredient = document.querySelector('#recipeFormIngredient');
const unitSelection = document.querySelector('#unitSelection');
const ingredientAmount = document.querySelector('#ingredientAmount');

const homeButton = document.querySelector('#homeButton');
const savedRecipesButton = document.querySelector('#savedRecipesButton');
const addRecipeButton = document.querySelector('#addRecipeButton');
const addRecipeForm = document.querySelector('#addRecipeForm');
const loginPopup = document.querySelector('#loginPopup');
const loginButton = document.querySelector('#loginButton');
const plusButton = document.querySelector('#plusButtonContainer');
const submitRecipeButton = document.querySelector('#submitRecipe');
const addIngredientButton = document.querySelector('#plusButtonContainer');

// FILTER CHECKBOXES && SEARCH ARRAY //

const filters = document.querySelector('#filters');
let filterSelection = [];
let addedIngredients = [];

// EVENT LISTENERS //

searchSubmitBtn.addEventListener('click', searchByName);
allRecipes.addEventListener('click', viewAllRecipes);
contentContainer.addEventListener('click', getDirections);

homeButton.addEventListener('click', showHomeView);
addRecipeButton.addEventListener('click', showRecipeForm);
loginButton.addEventListener('click', showLogin);
savedRecipesButton.addEventListener('click', viewAllRecipes);
filters.addEventListener('click', filterRecipes);
plusButton.addEventListener('click', addIngredient);
submitRecipeButton.addEventListener('click', addNewRecipe);
addIngredientButton.addEventListener('click', addIngredient);
searchFavesBtn.addEventListener('click', searchFaves);


// MAIN FUNCTIONS //

function filterRecipes() {
  // event.preventDefault();
  if (event.target.value) {
    filterSelection.push(event.target.value);
    console.log(filterSelection);
    searchByTag(recipeData, filterSelection);
  }
}

function addIngredient() {
  let ingredient = recipeFormIngredient.value;
  let unit = unitSelection.value;
  let unitCount = ingredientAmount.value;
  addedIngredients.push(`${ingredient}: ${unitCount} ${unit}`);
  recipeFormIngredient.value = null;
  unitSelection.value = null;
  ingredientAmount.value = null;
}

function generateRandomNumber() {
  return Math.floor(Math.random()*90000) + 10000;
}

function addNewRecipe() {
  let titleField = recipeFormTitle.value;
  let imageField = recipeFormImage.value;
  let ingredients = recipeFormIngredient.value;
  let unitField = unitSelection.value;
  addIngredient();
  let newRecipe = new Recipe({id: generateRandomNumber(), name: titleField, image: imageField, ingredients: [addedIngredients]});

  console.log(newRecipe);a
  recipeData.push(newRecipe);
  addedIngredients = [];
}

function viewAllRecipes() {
  show(allRecipeContainer);
  hide(addRecipeForm);
  const recipeRepo = new RecipeRepository(recipeData);
  populateCards(recipeRepo.recipeData);
};

function showHomeView() {
  hide(addRecipeForm);
  hide(allRecipeContainer);
  // contentContainer.childNode = recipeGrid;
  // fullRecipeContainer.classList.add('push-to-back');
  // contentContainer.removeChild(fullRecipeContainer);
  // contentContainer.innerHTML = recipeGrid.innerHTML;
  show(recipeGrid);
  show(mainContent);
}

function showRecipeForm() {
  show(addRecipeForm);
  hide(recipeGrid);
  hide(allRecipeContainer);
  hide(fullRecipeContainer);
}

function showLogin() {
  loginPopup.classList.toggle('hidden');
}

function getDirections(event){
  if(event.target.classList.contains('favorite-star')){
    addToFavorites();
    return
  };
  if(event.target.classList.contains('content-container')){
    return
  };
    allRecipeGrid.classList.add('hidden');
    let targetID = event.target.closest('.mini-recipe').id;
    let newRecipeInfo = recipeData.find(recipe => recipe.id === Number(targetID));
    let selectedRecipe = new Recipe(newRecipeInfo);

    selectedRecipe.ingredients = selectedRecipe.ingredients.map((element) => {
      let ingredient = new Ingredient(element)
      return ingredient
    })
    let instructions = selectedRecipe.instructions.map((element) => {
      return element.instruction
    });

    let allIngredients = selectedRecipe.ingredients.map((element) => {
      let name = element.name;
      let amount = element.quantity.amount;
      let unit = element.quantity.unit;

      return [name, amount, unit]
    })

    let ingredients = allIngredients.reduce((acc, element) => {
      acc += element
      return acc
    }, '')

    let fullRecipe =
      `<section class="full-recipe-container" id="fullRecipeContainer">
        <h3 class= "full-recipe"> ${selectedRecipe.name}</h3>
        <img src= "${selectedRecipe.image}" alt="${selectedRecipe.name}">
        <p class= "ingredients">${ingredients.split(/[ ,]+/).join(' ,')}</p>
        <p class= "cost">${selectedRecipe.returnCostEstimation()}</p>
        <p class= "instructions">${instructions}</p>
      </section>`;

    return contentContainer.innerHTML = fullRecipe
};


function searchByName(){
  if(searchFieldInput.value ===""){
    popupMessage("Please enter a search term!", 2000, "red")
    return
  }
  let recipeRepo = new RecipeRepository(recipeData);
  let filteredRecipes = recipeRepo.filterByName(searchFieldInput.value)
  if (filteredRecipes.length === 0){

    popupMessage("No results found! Sorry!", 2000, "red")
    return
  }
  populateCards(filteredRecipes)

}

function populateCards(arr){
  show(allRecipeGrid);
  hide(recipeGrid);
  allRecipeGrid.innerHTML = ""
  const recipeCard = arr.reduce((acc, recipe) => {
    acc +=
      `<article class="mini-recipe" id="${recipe.id}">
       <img src= "${recipe.image}" alt= "${recipe.name}">
       <p>${recipe.name}</p>
       </article>`

    return acc;
  }, []);
  return allRecipeGrid.innerHTML = recipeCard

function searchFaves(){
  let searchInput = searchFavesInput.value.toLowerCase();
  let allTags = [];
  recipeData.forEach((element) => {
    element.tags.forEach((tag) => {
      if(!allTags.includes(tag)){
        allTags.push(tag)
      }
    })
  });

  if(allTags.includes(searchInput)){
    let searchedData = currentUser.favoriteRecipes.filter(recipe => recipe['tags'].includes(searchInput));
    console.log('tags',searchedData);
    return searchedData
  } else {
    let lowerCasedNames = currentUser.favoriteRecipes.map((element) => {
      element.name = element.name.toLowerCase();
      return element
    })
    let searchedData = lowerCasedNames.filter(recipe => recipe['name'].includes(searchInput));
    console.log('name',searchedData);
    return searchedData
  }

function setUserData(){
  let user = new UserData()



  // if the user login matches the user.name....
  //...then the app populates with that user's info
};


function joinToString(array){
  return array.join(" ")
}


function searchByTag(recipesArray, searchTags){
  let indexMatchAllStrings;
  let indexMatchAllSearchTags;
  let returnedArr = []
  let filteredArray = recipesArray.reduce((acc, recipe) => {
      let tagsString = joinToString(recipe.tags);
      let numOfTags = searchTags.length;
      // console.log(searchTags);
      let testTags = searchTags.reduce((acc, tag) => {
        if (tagsString.includes(tag)){
          acc++;
        }
        return acc;
      }, 0)
      // console.log(testTags===numOfTags)
      indexMatchAllSearchTags = (numOfTags===testTags)
      // console.log('NUMBER: ', numOfTags, 'TAGS: ', testTags)
      if (indexMatchAllSearchTags){
        returnedArr.push(recipe);
      }

    }, []);
    populateCards(returnedArr);
  return returnedArr;
};

function hide(element){
  element.classList.add('hidden')
}
function show(element){
  element.classList.remove('hidden')
}

function popupMessage(message, timeInMS, color = "gold"){
  let popupContainer = document.querySelector('#popup')
  popupContainer.classList.add(`${color}-popup`)
  popupContainer.innerHTML=`<p>${message}</p>`
  show(popupContainer)

  setTimeout(function(){
      popupContainer.classList.remove(`${color}-popup`)
      hide(popupContainer);
  }, timeInMS)
}
// Test //
