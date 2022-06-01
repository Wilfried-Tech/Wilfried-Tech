initSwipeMenu();
initCircularMenu();

const tabs = document.querySelectorAll('.tab'),
    contents = document.querySelectorAll('.content'),
    menuItems = document.querySelectorAll(".nav-menu-item:not(.disabled)");

tabs.forEach((tab, index) => {
    tab.onclick = function (e) {
        tabs.forEach((tab, index) => {
            tab.classList.remove('active');
            contents[index].classList.remove('active')
        })
        tab.classList.add('active');
        contents[index].classList.add('active');
    }
})

menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", function (e) {
        menuItems.forEach((menuItem) => {
            menuItem.classList.remove('active');
        })
        menuItem.classList.add('active');
    })
})

writeOnTerminal($("#console-line"))
