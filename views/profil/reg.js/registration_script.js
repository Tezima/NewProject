$(document).ready(function(){
    // Відправка форми реєстрації на сервер
    $('#registrationForm').submit(function(event){
        event.preventDefault();

        // Отримання даних з форми
        var username = $('#uasername').val();
        var email = $('#email').val();
        var password = $('#password').val();
        // Відправка AJAX-запиту на сервер
        $.ajax({
            type:'POST',
            url:'/profil/base/database.py',
            data:{
                username:username,
                email:email,
                password:password
            },
        success:function(response){
            alert('Реєстраія успішна')
            // Додаткові дії, які виконуються після успішної реєстрації
        },
        error:function(xhr,status,error){
            alert('Помилка під час реєстрації: ' + error);
                // Обробка помилки реєстрації
        }
        });
        
        // Після відправки форми очистимо поля
        $('#username').val('');
        $('#email').val('');
        $('#password').val('');
    })
})




