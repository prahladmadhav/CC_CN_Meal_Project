// Variable Declaration Start
const contentContainerFavouriteEl = document.getElementById(
  "contentContainerFavourite"
);
// Object to contain all favourite Meals required Data
var favObj = new Object();
// Array contains meal ids of all favourite meals
var propertyArr;
// Variable Declaration End
// Function Definition Start
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
    This function removes a meal in the favObj variable
*/
var removeFav = async (favEl) => {
  let mealName = favObj[favEl.id].strMeal;
  delete favObj[favEl.id];
  propertyArr = Object.getOwnPropertyNames(favObj);
  await updateLSV();
  let meal = document.getElementById(`meal${favEl.id}`);
  meal.remove();
  alert(`${mealName} has been removed from favourite meals`);
  if (propertyArr.length == 0) {
    alert("You have no favourite meals");
  }
};
/* 
    This function creates a favourite result entry.
*/
var createContentItemBlock = (idMeal) => {
  let contentItemBlockEl = document.createElement("div");
  contentItemBlockEl.id = `meal${idMeal}`;
  contentItemBlockEl.classList.add("content-item-block");
  let mealImageEl = document.createElement("img");
  mealImageEl.src = favObj[idMeal].strMealThumb;
  mealImageEl.alt = "Meal Image";
  mealImageEl.classList.add("meal-image");
  let mealNameEl = document.createElement("a");
  mealNameEl.href = `meal.html?idMeal=${idMeal}`;
  mealNameEl.innerText = favObj[idMeal].strMeal;
  mealNameEl.classList.add("meal-name");
  let mealFavEl = document.createElement("div");
  mealFavEl.id = idMeal;
  mealFavEl.classList.add("fav", "faved");
  mealFavEl.onclick = () => {
    removeFav(mealFavEl);
  };
  let mealFavIconEl = document.createElement("i");
  mealFavIconEl.classList.add("fa", "fa-heart");
  mealFavEl.appendChild(mealFavIconEl);
  contentItemBlockEl.appendChild(mealImageEl);
  contentItemBlockEl.appendChild(mealNameEl);
  contentItemBlockEl.appendChild(mealFavEl);
  contentContainerFavouriteEl.appendChild(contentItemBlockEl);
};
/* 
    This function sets all the favourite result entries.
*/
var setFavouritesData = () => {
  propertyArr = Object.getOwnPropertyNames(favObj);
  if (propertyArr.length > 0) {
    for (let i of propertyArr) {
      createContentItemBlock(i);
    }
  } else {
    alert("You have no favourite meals");
  }
};
// Function Definition End
// Main Process Start
createLSV();
setFavouritesData();
// Main Process End
