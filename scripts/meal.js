// Variable Declaration Start
const ingredientsSelectorEl = document.getElementById("ingredientsSelector");
const instructionsSelectorEl = document.getElementById("instructionsSelector");
const ingredientsEl = document.getElementById("ingredients");
const instructionsEl = document.getElementById("instructions");
const favIdEl = document.getElementById("favId");
// Object to contain the page's meal required Data
var mealObj = new Object();
// Object to contain all favourite Meals required Data
var favObj = new Object();
// Object to contain the page's meal id
var mainMealId = "";
// Variable Declaration End
// Function Definition Start
/* 
    Function to allow us to seach a specific meal by it's id.
    If the response is ok we return the json data in the response.
    If the response is not ok we will return the response itself.
*/
var getMealData = async (mealId) => {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURI(mealId)}`
  );
  if (response.ok) {
    const jsonValue = await response.json();
    return Promise.resolve(jsonValue);
  } else {
    return Promise.reject(response);
  }
};
/* 
    This function creates the local storage variable if not yet created.
    If the local storage variable is created it puts the values in the 
    favourite variables object.
*/
var createLSV = () => {
  if (localStorage.getItem("favData") === null) {
    localStorage.setItem("favData", JSON.stringify(favObj));
  } else {
    favObj = JSON.parse(localStorage.getItem("favData"));
  }
};
/* 
    This function updates the local storage variable the 
    favourite variables object.
*/
var updateLSV = () => {
  localStorage.setItem("favData", JSON.stringify(favObj));
};
/*
    This function checks if the meal exists in the 
    favObj variable
*/
var checkFav = () => {
  return favObj.hasOwnProperty(mainMealId);
};
/* 
    This function adds a meal in the favObj variable
*/
var addFav = async () => {
  favObj[mainMealId] = mealObj;
  let mealName = favObj[mainMealId].strMeal;
  await updateLSV();
  return `${mealName} has been added to favourite meals`;
};
/* 
    This function removes a meal in the favObj variable
*/
var removeFav = async () => {
  let mealName = favObj[mainMealId].strMeal;
  delete favObj[mainMealId];
  await updateLSV();
  return `${mealName} has been removed from favourite meals`;
};
/* 
    This function manages addFav() and removeFav() for 
    a onclick event for the favourite button of a meal
*/
var toggleFav = async (favEl) => {
  var message = "";
  if (favEl.classList.contains("faved")) {
    message = await removeFav();
    favEl.classList.remove("faved");
  } else {
    message = await addFav();
    favEl.classList.add("faved");
  }
  alert(message);
};
/* 
    This function updates the image source for a given element id
*/
var setImagePath = (id, value) => {
  let element = document.getElementById(id);
  element.src = value;
};
/* 
    This function updates the inner text for a given element id
*/
var setInnerText = (id, value) => {
  let element = document.getElementById(id);
  element.innerText = value;
};
/* 
    This function hides an element b passing an id
*/
var hideElement = (id) => {
  let element = document.getElementById(id);
  element.classList.add("hide");
};
/* 
    This function unhides an element b passing an id
*/
var unhideElement = (id) => {
  let element = document.getElementById(id);
  element.classList.remove("hide");
};
/* 
    The function uses the Meal Id provided in the URL to 
    obtain the meal data and update it in the content container 
*/
var setMealData = async () => {
  let currentURL = window.location.href;
  let urlArr = currentURL.split("?idMeal=");
  if (urlArr.length == 2) {
    getMealData(urlArr[1])
      .then((jsonValue) => {
        if (jsonValue.meals != null) {
          let meal = jsonValue.meals[0];
          mainMealId = meal.idMeal;
          mealObj = {
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
          };
          if (meal.strMealThumb != null && meal.strMealThumb != "") {
            setImagePath("mealImage", meal.strMealThumb);
          }
          if (meal.strMeal != null && meal.strMeal != "") {
            setInnerText("mealName", meal.strMeal);
          }
          if (meal.strDrinkAlternate != null && meal.strDrinkAlternate != "") {
            setInnerText("mealDrinkAlternate", meal.strDrinkAlternate);
          } else {
            hideElement("mealDrinkAlternate");
          }
          if (meal.strCategory != null && meal.strCategory != "") {
            setInnerText("mealCategory", meal.strCategory);
          } else {
            hideElement("mealCategory");
          }
          if (meal.strArea != null && meal.strArea != "") {
            setInnerText("mealArea", meal.strArea);
          } else {
            hideElement("mealArea");
          }
          for (let i = 1; i <= 20; i++) {
            let dataIngredient = `strIngredient${i}`;
            let dataMeasure = `strMeasure${i}`;
            let ingredientId = `ingredient${i}`;
            if (meal[dataIngredient] != null && meal[dataIngredient] != "") {
              setInnerText(
                ingredientId,
                `${meal[dataIngredient]} : ${meal[dataMeasure]}`
              );
            } else {
              hideElement(ingredientId);
            }
          }
          if (meal.strInstructions != null && meal.strInstructions != "") {
            setInnerText("instructions", meal.strInstructions);
          } else {
            hideElement("instructions");
          }
          if (checkFav()) {
            favIdEl.classList.add("faved");
          }
          unhideElement("contentTop");
          unhideElement("contentBottom");
        } else {
          alert("MealId is Invalid!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Request Failed!");
      });
  } else {
    console.log(urlArr);
    alert("Url is Incorrect!");
  }
  hideElement("pageLoader");
};
// Function Definition End
// Main Process Start
createLSV();
setMealData();
/* 
    On clicking the ingredients Selector ingredients are shown
*/
ingredientsSelectorEl.onclick = () => {
  ingredientsSelectorEl.classList.add("active");
  instructionsSelectorEl.classList.remove("active");
  ingredientsEl.classList.remove("hide");
  instructionsEl.classList.add("hide");
};
/* 
    On clicking the instructions Selector instructions are shown
*/
instructionsSelectorEl.onclick = () => {
  ingredientsSelectorEl.classList.remove("active");
  instructionsSelectorEl.classList.add("active");
  ingredientsEl.classList.add("hide");
  instructionsEl.classList.remove("hide");
};
/* 
    On clicking the favourite icon the status toggles
*/
favIdEl.onclick = () => {
  toggleFav(favIdEl);
};
// Main Process End
