// Variable Declaration Start
// mealsOutputContainer Element
const mealsOutputContainerEl = document.getElementById("mealsOutputContainer");
// mealsOutputContainer Element
const mealsLoaderContainerEl = document.getElementById("mealsLoaderContainer");
// inputSearch Element
const inputSearchEl = document.getElementById("inputSearch");
// Object to contain all searched Meals required Data
var mealsObj = new Object();
// Object to contain all favourite Meals required Data
var favObj = new Object();
// Variable Declaration End
// Function Definition Start
/* 
    Function to allow us to seach all the meals that match the search parameter.
    If the response is ok we return the json data in the response.
    If the response is not ok we will return the response itself.
*/
var getSearchResults = async (searchParam) => {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURI(
      searchParam
    )}`
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
    This function adds meals that are searched onto the
    mealsObj variable
*/
var addMeal = (meal) => {
  if (!mealsObj.hasOwnProperty(meal.idMeal)) {
    mealsObj[meal.idMeal] = {
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    };
  }
};
/*
    This function checks if the meal exists in the 
    favObj variable
*/
var checkFav = (idMeal) => {
  return favObj.hasOwnProperty(idMeal);
};
/* 
    This function adds a meal in the favObj variable
*/
var addFav = async (idMeal) => {
  favObj[idMeal] = mealsObj[idMeal];
  let mealName = favObj[idMeal].strMeal;
  await updateLSV();
  return `${mealName} has been added to favourite meals`;
};
/* 
    This function removes a meal in the favObj variable
*/
var removeFav = async (idMeal) => {
  let mealName = favObj[idMeal].strMeal;
  delete favObj[idMeal];
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
    message = await removeFav(favEl.id);
    favEl.classList.remove("faved");
  } else {
    message = await addFav(favEl.id);
    favEl.classList.add("faved");
  }
  alert(message);
};
/* 
    This function creates a search result entry.
*/
var createContentOutputEntry = (meal) => {
  let contentOutputEntryEl = document.createElement("div");
  contentOutputEntryEl.classList.add("content-output-entry");
  let contentOutputEntryNameEl = document.createElement("a");
  contentOutputEntryNameEl.innerText = meal.strMeal;
  contentOutputEntryNameEl.href = `meal.html?idMeal=${meal.idMeal}`;
  contentOutputEntryNameEl.classList.add("content-output-entry-item", "name");
  let contentOutputEntryGrowEl = document.createElement("div");
  contentOutputEntryGrowEl.classList.add("content-output-entry-item", "grow");
  let contentOutputEntryFavEl = document.createElement("div");
  if (checkFav(meal.idMeal)) {
    contentOutputEntryFavEl.classList.add(
      "content-output-entry-item",
      "fav",
      "faved"
    );
  } else {
    contentOutputEntryFavEl.classList.add("content-output-entry-item", "fav");
  }
  contentOutputEntryFavEl.id = meal.idMeal;
  contentOutputEntryFavEl.onclick = () => {
    toggleFav(contentOutputEntryFavEl);
  };
  let contentOutputEntryFavIconEl = document.createElement("i");
  contentOutputEntryFavIconEl.classList.add("fa", "fa-heart");
  contentOutputEntryFavEl.appendChild(contentOutputEntryFavIconEl);
  contentOutputEntryEl.appendChild(contentOutputEntryNameEl);
  contentOutputEntryEl.appendChild(contentOutputEntryGrowEl);
  contentOutputEntryEl.appendChild(contentOutputEntryFavEl);
  return contentOutputEntryEl;
};
/* 
    This function creates a delay for getting the search result
*/
var sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
/* 
    This function search input data
*/
var search = async () => {
  let searchParam = inputSearchEl.value.trim();
  if (searchParam != "") {
    mealsOutputContainerEl.style.display = "none";
    mealsLoaderContainerEl.style.display = "block";
    await getSearchResults(searchParam)
      .then(async (jsonValue) => {
        var meals = jsonValue.meals;
        mealsOutputContainerEl.innerHTML = "";
        if (meals != null) {
          for (var meal of meals) {
            await addMeal(meal);
            await mealsOutputContainerEl.appendChild(
              createContentOutputEntry(meal)
            );
          }
        } else {
          mealsOutputContainerEl.innerHTML = `<div style="font-size:20px; text-align:center;">No Search Results</div>`;
        }
      })
      .catch((err) => {
        console.log(err);
        mealsOutputContainerEl.innerHTML = `<div style="font-size:20px; text-align:center;">Request Failed</div>`;
      });
    await sleep(300);
    if (searchParam == inputSearchEl.value.trim()) {
      mealsLoaderContainerEl.style.display = "none";
      mealsOutputContainerEl.style.display = "block";
    }
  } else {
    mealsLoaderContainerEl.style.display = "none";
    mealsOutputContainerEl.style.display = "none";
  }
};
// Function Definition End
// Main Process Start
createLSV();
inputSearchEl.onkeyup = async () => {
  await search();
};
// Main Process End
