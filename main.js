const searchInput = document.querySelector("input[type=text]");
const typeInput = document.querySelector("select");
const yearInput = document.querySelector("input[type=number]");
const yearHolder = yearInput.parentElement;
const submitButton = document.querySelector("#search button");
const cardHolder = document.getElementById("movie-holder");
const pagination = document.getElementById("pagination");

function GenerateLink(keywords, type, year, page)
{
    let link = `http://www.omdbapi.com/?apikey=2348f7d4`;
    if (keywords) { link += `&s=${keywords}` }
    if (type)     { link += `&type=${type}`  }
    if (year)     { link += `&y=${year}`     }
    if (page)     { link += `&page=${page}`  }
    return link;
}

function UpdateDOM(keywords, type, year, page)
{
    ClearDOM();

    let link = GenerateLink(keywords,type,year,page);

    fetch(link).then(response => response.json().then(data => {

        if (data.Response == false)
            console.log("No result found.");

        const cardTemplate = document.getElementById("movie-card-template");
        const results = data.Search;
        const pageCount = parseInt(data.totalResults / 10);

        ClearPagination();

        for (const result of results) {
            const card = cardTemplate.content.cloneNode(true);
            card.querySelector("h3").innerHTML = result.Title;
            card.querySelector("img").src = result.Poster;
            card.querySelector("p").innerHTML = result.Year;
            card.querySelector("a").href = `https://www.imdb.com/title/${result.imdbID}`;
            cardHolder.appendChild(card);
        }
        for (let i=1; i<=Math.min(pageCount, 50); i++) {
            AddPageButton(i, keywords,type,year,i);
        }

        if (page) { ActivatePageButton(page-1) }
        else      { ActivatePageButton(0) }

        ShowPagination(true);
    }));
}

ClearDOM();
function ClearDOM()
{
    while (cardHolder.firstChild)
        cardHolder.removeChild(cardHolder.firstChild);

    ShowPagination(false);
}

function Search()
{
    if (!searchInput.value)
        return;
    
    let year = yearInput.value == 0 ? null : yearInput.value;
    let type = typeInput.value;
    switch (type) {
        case "All":  type = null;     break;
        case "Show": type = "Series"; break;
    }

    UpdateDOM(searchInput.value, type, year, null);
}

function ShowPagination(show)
{ pagination.style.display = show ? "inline-block" : "none" }
function ClearPagination()
{
    while (pagination.firstChild)
        pagination.removeChild(pagination.firstChild);
}
function AddPageButton(pageIndex, keywords, type, year, page)
{
    const button = document.createElement("a");
    button.className = "page";
    button.innerHTML = pageIndex.toString();
    button.addEventListener("click", () => UpdateDOM(keywords,type,year,page))
    pagination.appendChild(button);
}
function ActivatePageButton(index)
{
    const buttons = document.querySelectorAll(".page");
    for (const button of buttons) {
        buttons.className = "page";
    }
    buttons[index].className += " active";
}

// VALIDATORS
searchInput.addEventListener("keyup", OnKeywordChange);
yearInput.addEventListener("change", OnYearChange);
OnKeywordChange();
OnYearChange();

function OnYearChange()
{
    if (yearInput.value == 1)
    {   yearInput.value = 1800 }

    if (yearInput.value < 1800)
    {
        yearInput.value = 0;
        yearHolder.style.opacity = .25;
    }
    else { yearHolder.style.opacity = 1 }

    if (yearInput.value > 2025)
    {   yearInput.value = 2025 }
}
function OnKeywordChange()
{
    if (searchInput.value.length > 1)
    {
        submitButton.style.pointerEvents = "unset";
        submitButton.style.opacity = 1;
    }
    else
    {
        submitButton.style.pointerEvents = "none";
        submitButton.style.opacity = .25;
    } 
}