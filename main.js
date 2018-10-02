let mainArray = [];
let id = 0;
const post_per_page = 7;
$(function () {

    //Добавление по кнопке
    $("#new-todo-button").bind('click', function() {
        Addtodo();
    });
    //Добавление по enter
    $("body").keyup(function() {
        if(event.keyCode==13){
            Addtodo();
        }
    });
    //чекбоксы лишек
    $("body").on('change', '.toggle', function() {
        let checkedLi = $(this).parents('li').attr('id');
        mainArray.forEach((el) => {
            if (el.id == checkedLi) {
                el.checked = this.checked; 
            }});
            pagination();
    });
    //delete
    $("body").on('click', '.destroy', function () {
        const tododelete = $(this).parents('li').attr('id');
        mainArray.forEach((el,index) => {
            if(tododelete == el.id) {
                mainArray.splice(index, 1);
            }});
            pagination();
    });
    //delete all
    $("body").on('click', '.btn-danger', function() {
        mainArray = _.filter(mainArray, ['checked', false]);
        pagination();
    });

       //общий чекбокс
    $("body").on('click', '#maintoggle', function () {
        mainArray.forEach((el) => {
            if (el.checked === !this.checked) {
                el.checked = this.checked;
            } return false
        });
        pagination();
    });
    //двойной клик
    $("body").on('dblclick', '.todo-label', function() {
        let originalTodo = $(this).text();
        $(this).addClass("editing");
        $(this).html("<input class='edittodo' type='text' id='edit' value='" + originalTodo + "' />");
        $(this).children().focus();
        const liforcheck = $(this).parents('li').attr('id');
        let newTodo = $(this).text();
        $(this).children().keyup(function (){
             if (event.keyCode==13) {
                 editTodo(newTodo, liforcheck);
             }
         });
         $(this).children().first().blur(function (){
             editTodo(newTodo, liforcheck);
         });
        Addtodo();
    });

//Переключение пагинации
    $('body').on('click', '#pages .page', function() {
        $('#pages .page').removeClass('active');
        $(this).addClass('active');
        pagination();
    });

    //Переключение табов
    $('.tab').click(function(){
        $('.tab').removeClass('active');
        $(this).addClass('active');
        pagination('first');
    });
    
    
});

//изменение todo 
function editTodo(newTodo, liforcheck) {
    mainArray.forEach((el) => {
        if (el.id == liforcheck) {
            el.text = $('#edit').val();
        }
    });
    pagination();
}
//Сохранение данных в массив
function Addtodo (){ 
    let newTodo = $("#todo").val().trim();
    if (!newTodo) {
        return false
    }
    let infoTodo = {
        text: newTodo,
        id: id,
        checked: false
    }
    mainArray.push (infoTodo);
    $("#todo").val("");
    id++;
    pagination('last');
    
};
//detectArray
function detectArray() {
    const activeTab = $('.tab.active').attr('id');
    if (activeTab === 'tab_all') {
        return mainArray
    }
    const checked = (activeTab === 'tab_checked') ? true : false;
    return _.filter(mainArray, ['checked', checked]);
    pagination();
}
//pagination
function pagination(flagPage) {
    const numberOfItems = mainArray.length;
    const page_count = Math.ceil(numberOfItems / post_per_page);
    let pages = '';
    let currentPage = $('.page.active a').attr('id') || 1;
    if (currentPage > page_count || flagPage === 'last') {
        currentPage = page_count;
    }
    if (flagPage === 'first') {
        currentPage = 1;
    }
    const pagesContainer = $('#pages');
    pagesContainer.empty();
    for (let i = 1; i <= page_count; i++) {
        const className = (currentPage == i) ? 'page active' : 'page'
        pages += `<li class="${className}"><a href="#" id="${i}">${i}</a></li>`
    }
    pagesContainer.append(pages);
    render(currentPage);
    todosCount();
}

//Счетчики
function todosCount() {
    let allcount = mainArray.length;
    let comcount = allcount - _.filter(mainArray, ['checked', false]).length;
    let actcount = allcount - _.filter(mainArray, ['checked', true]).length;
    $('.active-count').html(actcount + " active")
    $('.completed-count').html(comcount + " completed")
    $('.all-count').html(allcount + " all");
}


//Вывод на экран
function render(page) {
    let currentArray = detectArray();
    const start = page * post_per_page;
    let activeArray = currentArray.slice(start - post_per_page, start);
    let mainList = "";
    $("#list").empty();
    activeArray.forEach(function(el){
        const className = (el.checked) ? 'supercsscheck' : 'supercss';
        mainList += `<li id='${el.id}' class='${className}  oneli'>
        <div class='col-xs-4 col-md-1'><input type='checkbox' class='toggle'></span></div>
        <div class='col-xs-4 col-md-9'><p class='todo-label' style='text-align: center'>${el.text}</p></div>
        <div class='col-xs-4 col-md-2'> <a style='text-decoration: none; font-size:25px;' href="#" class="remove todo destroy ">x</a></span></li>`;
    });
    $('#list').append(mainList);
    $('li.supercsscheck .toggle').prop('checked', true);
}

