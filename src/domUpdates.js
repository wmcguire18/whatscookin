import {currentUser} from './scripts.js'
import RecipeRepository from './classes/RecipeRepository.js';
import {recipeData} from './scripts.js'
import {searchFavesInput} from './scripts.js'
import {addToLibrary} from './scripts.js'
import {selectedRecipeIngredients} from './scripts.js'
import Recipe from './classes/Recipe.js'
import {ingredientsData} from './scripts.js'
import Ingredient from './classes/Ingredient.js'
import {generateRandomUser} from './scripts.js'
import Pantry from './classes/Pantry.js'
import {contentContainer} from './scripts.js'
import {pantryContainer} from './scripts.js'
import {pantryDisplay} from './scripts.js'
import {getUserData} from './scripts.js'

let domUpdates = {
    hide(element){
        element.classList.add('hidden')
    },

    show(element){
        element.classList.remove('hidden')
    },

    showRecipesToCook() {
        domUpdates.hide(filters);
        domUpdates.hide(searchFieldContainer);
        domUpdates.hide(recipeDirectionsContainer);
        domUpdates.hide(pantryContainer);
        domUpdates.populateCards(currentUser.recipesToCook);
        domUpdates.show(featuredRecipes);
        domUpdates.show(allRecipeGrid);
        if(currentUser.recipesToCook.length===0){
          allRecipeGrid.innerHTML = `<h1>No recipes found!</h1>`
          return
        }
        featuredRecipes.innerHTML = `<h1>Recipes</h1>`
    },

    viewAllRecipes() {
        domUpdates.show(filters);
        domUpdates.show(filters);
        domUpdates.show(allRecipeContainer);
        domUpdates.hide(addRecipeForm);
        domUpdates.hide(recipeGrid);
        domUpdates.hide(recipeDirectionsContainer);
        domUpdates.hide(pantryContainer);
        domUpdates.show(allRecipeGrid);
        domUpdates.hide(searchFavesInput);
        domUpdates.hide(searchFavesSubmitBtn);
        domUpdates.show(featuredRecipes);
        domUpdates.show(searchFieldContainer);
        featuredRecipes.innerHTML = `<h1>All Recipes</h1>`;
        let recipeRepo = new RecipeRepository(recipeData);
        domUpdates.populateCards(recipeRepo.recipeData)
    },

    showHomeView() {
        domUpdates.show(recipeGrid);
        domUpdates.hide(filters);
        domUpdates.generateRandomHomeViewRecipes();
        domUpdates.hide(addRecipeForm);
        domUpdates.hide(allRecipeContainer);
        domUpdates.hide(allRecipeGrid);
        domUpdates.hide(recipeDirectionsContainer);
        domUpdates.hide(pantryContainer);
        domUpdates.show(mainContent);
        domUpdates.hide(searchFavesSubmitBtn);
        domUpdates.hide(searchFavesByName);
        domUpdates.hide(filters);
        domUpdates.show(featuredRecipes);
        domUpdates.hide(searchFieldContainer);
        featuredRecipes.innerHTML = `<h1>Featured Recipes</h1>`;
    },

    populateCards(arr){
        this.show(allRecipeGrid);
        this.hide(recipeGrid);
        allRecipeGrid.innerHTML = ""
        const recipeCard = arr.reduce((acc, recipe) => {
          let buttonClassesFaves = "favorite-star"
          if (currentUser.favoriteRecipes.includes(recipe)){
            buttonClassesFaves = "favorite-star is-favorite"
          }
          let buttonClassesToCook = "recipesToCook"
          if (currentUser.recipesToCook.includes(recipe)){
            buttonClassesToCook = "recipesToCook is-saved"
          }
          allRecipeGrid.innerHTML +=
            `<article class="mini-recipe" id="${recipe.id}">
             <img src= "${recipe.image}" alt= "${recipe.name}">
             <p>${recipe.name}</p>
             <button type="favoriteStar" name="favoriteStar" class="${buttonClassesFaves}" id="fave-${recipe.id}">???</button>
             <button type="recipesToCook" name="recipesToCook" class="${buttonClassesToCook}" id="${recipe.id}">???? Cook this week!</button>
             </article>`
            return acc;
          }, []);
      },

      popupMessage(message, timeInMS, color = "gold") {
        let popupContainer = document.querySelector('#popup')
        popupContainer.classList.add(`${color}-popup`)
        popupContainer.innerHTML=`<p>${message}</p>`
        domUpdates.show(popupContainer)

        setTimeout(function() {
            popupContainer.classList.remove(`${color}-popup`)
            domUpdates.hide(popupContainer);
        }, timeInMS)
},

  displayEmptyFavorites() {
    featuredRecipes.innerHTML = `<h1>Add a Recipe</h1>`;
},

displaySavedRecipes() {
  domUpdates.hide(searchFieldContainer);
  domUpdates.hide(filters);
  if(currentUser.favoriteRecipes.length===0){
    allRecipeGrid.innerHTML = `<h1>No recipes found!</h1>`
    return
  }
  featuredRecipes.innerHTML = `<h1>Saved Recipes</h1>`;
},

generateRandomHomeViewRecipes(){
domUpdates.show(featuredRecipes);
domUpdates.hide(searchFieldContainer);
let recipeRepo = new RecipeRepository(recipeData);
let randomRecipeIndex1 = Math.floor(Math.random() * recipeRepo.recipeData.length)
let randomRecipeIndex2 = Math.floor(Math.random() * recipeRepo.recipeData.length)
let randomRecipeIndex3 = Math.floor(Math.random() * recipeRepo.recipeData.length)
if (randomRecipeIndex2 === randomRecipeIndex1){
  randomRecipeIndex2 = Math.floor(Math.random() * recipeRepo.recipeData.length)
}
if (randomRecipeIndex3 === randomRecipeIndex1 || randomRecipeIndex2){
  randomRecipeIndex3 = Math.floor(Math.random() * recipeRepo.recipeData.length)
}
recipeGrid.innerHTML = ""
let randomRecipesIndex = [randomRecipeIndex1, randomRecipeIndex2, randomRecipeIndex3]
randomRecipesIndex.forEach((randomRecipeIndex) => {

  let index = randomRecipeIndex

 recipeGrid.innerHTML +=
  `<article class="recipe" id=${recipeRepo.recipeData[index].id}>
  <div class="meal-image" id=${recipeRepo.recipeData[index].id}>
    <img src="${recipeRepo.recipeData[index].image}" alt="meal image" class="image" id=${recipeRepo.recipeData[index].id}>
  </div>
  <div class="recipe-content" id=${recipeRepo.recipeData[index].id}>
    <div class="recipe-info" id=${recipeRepo.recipeData[index].id}>
      <h2 id=${recipeRepo.recipeData[index].id}>${recipeRepo.recipeData[index].name}</h2>
    </div>
  </div>
</article>`
  })
},

showSavedRecipes() {
  domUpdates.hide(searchFieldContainer);
  domUpdates.populateCards(currentUser.favoriteRecipes);
  domUpdates.hide(recipeDirectionsContainer);
  domUpdates.hide(pantryContainer);
  domUpdates.show(searchFavesSubmitBtn);
  domUpdates.show(searchFavesByName);
  domUpdates.show(filters);
  domUpdates.show(allRecipeGrid);
  domUpdates.show(featuredRecipes);
  domUpdates.displaySavedRecipes();
},

showMyPantry() {
  domUpdates.hide(filters);
  domUpdates.hide(recipeDirectionsContainer);
  domUpdates.hide(searchFieldContainer);
  domUpdates.show(allRecipeGrid);
  domUpdates.show(contentContainer);
  domUpdates.hide(recipeGrid);
  domUpdates.hide(allRecipeContainer);
  domUpdates.hide(addRecipeForm);
  domUpdates.show(pantryContainer);
  pantryDisplay.innerHTML = ''
  let userPantry = new Pantry(currentUser.pantry);

  let pantryIngredients = userPantry.pantry.map((ingredient) => {
    let userIngredients = new Ingredient(ingredient, ingredientsData)
    pantryDisplay.innerHTML +=
    `<article class="pantry-item" id="${userIngredients.id}">
       <h3>${userIngredients.name}</h3>
       <p class="pantry-quantity">${userIngredients.quantity}</p>
     </article>`
  })
},

getDirections(event){
  if(event.target.classList.contains('favorite-star')){
    addToLibrary();
    return
  }
  if(event.target.classList.contains('recipesToCook')){
    addToLibrary();
    return
  }
  let flag1 = event.target.parentElement.classList.contains('mini-recipe')
  console.log(flag1)
  let flag2 = event.target.parentElement.classList.contains('recipe-grid')
  console.log(flag2)
  let flag3 = event.target.parentElement.parentElement.parentElement.classList.contains('recipe-grid')
  console.log(flag3)
  if(!flag1 && !flag2 && !flag3){
    console.log("error!")
    return
  }
  let selectedRecipeIngredients = [];
  domUpdates.show(recipeGrid);
  domUpdates.hide(allRecipeContainer);
  domUpdates.hide(allRecipeGrid);
  domUpdates.show(recipeDirectionsContainer);
  domUpdates.hide(searchFieldContainer);
  domUpdates.hide(filters);

  recipeGrid.innerHTML = "";
  
  let targetID = "";
  if (flag1){
    targetID = event.target.closest('.mini-recipe').id

  }
  else if (flag2||flag3){
    targetID = event.target.closest('.recipe').id
  }


  let newRecipeInfo = recipeData.find(recipe => recipe.id === Number(targetID));
  let selectedRecipe = new Recipe(newRecipeInfo, ingredientsData);
  selectedRecipe.ingredients = selectedRecipe.ingredients.map((element) => {
    let ingredient = new Ingredient(element, ingredientsData)
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

  selectedRecipe.ingredients.forEach(function(element) {
    let currentIngredient = `${element.quantity.amount} ${element.quantity.unit} ${element.uniqueIngredientData.name}`
    selectedRecipeIngredients.push(currentIngredient);
    return selectedRecipeIngredients
  });

  let userPantry = new Pantry(currentUser.pantry)

  let fullRecipe =
    `<h3 class= "full-recipe"> ${selectedRecipe.name}</h3>
    <img src= "${selectedRecipe.image}" alt="${selectedRecipe.name}"><br>
    <br><b>Ingredients:</b><br>
    <p class= "ingredients">${selectedRecipeIngredients.join(',<br>')}</p>
    <p> ${userPantry.calculateIngredientsNeeded(selectedRecipe).split('You').join('<br> You')}</p>
    <p class= "cost"><b>${selectedRecipe.returnCostEstimation()}<b></p>
    <br><b>Instructions:</b></br>
    <p class= "instructions">${instructions}</p>`;

  recipeDirections.innerHTML = fullRecipe
}

}



export default domUpdates;
