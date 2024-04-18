<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Головна</title>
    <link rel="stylesheet" type="text/css" href="/golovna.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> 
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script> 
    <script src="/js/test.js"></script>
    <!-- <link rel="stylesheet" type="text/css" href="/profil//profil_reg.css/style.css"> -->
</head>
<body> 
    
    <div class="form-containet">
        <div class="col col-2">
            <div class="btn-box">
                <button class="btn btn-1" id="login">Sign In</button>
                <button class="btn btn-2" id="register">Sign Up</button>
            </div>
        <header class="container-fluid">
            <div class="container">
                <div class="row">
                    <div class="col-4">
                        <h1><a href="/">MyEnglish</a></h1>
                    </div>
                    <nav class="col-8">
                    
                            </div>
                        <ul>
                            <li><a href="#">Головна</a></li>
                            <li><a href="#">Головна</a></li>
                            <li><a href="#">Головна</a></li>
                            <li><a href="#"><i class="fa fa-user" onclick="redirect()">Профіль</i></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    </div>

    <div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="d-block w-100" src="/picturegolovna/зображення1.jpg" alt="First slide">
                <div class="carousel-caption d-none d-md-block">
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="/picturegolovna/зображення3.jpg" alt="Second slide">
                <div class="carousel-caption d-none d-md-block">
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                </div>
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="/picturegolovna/зображення4.jpg" alt="Third slide">
                <div class="carousel-caption d-none d-md-block">
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                </div>
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleSlidesOnly" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleSlidesOnly" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>

    <form action="/register" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        <input type="password" id="password" name="password"><br><br>
        <button type="submit" >Register</button>

        
    </form>
    <button type="submit" onclick="redirect()">Тест</button>
</html>
