document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.querySelector("#login");
    const registerBtn = document.querySelector("#register");
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");

    function switchForm(activeBtn, inactiveBtn, activeForm, inactiveForm) {
        activeBtn.style.backgroundColor = "#21264D";
        inactiveBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

        activeForm.style.left = "50%";
        inactiveForm.style.left = "-50%";

        activeForm.style.opacity = "1";
        inactiveForm.style.opacity = "0";

        document.querySelector(".col-1").style.borderRadius = activeBtn.id === "login" ? "0 30% 20% 0" : "0 20% 30% 0";
    }

    document.querySelector('.btn-box').addEventListener('click', function (event) {
        const target = event.target;
        if (target.matches('#login')) {
            switchForm(loginBtn, registerBtn, loginForm, registerForm);
        } else if (target.matches('#register')) {
            switchForm(registerBtn, loginBtn, registerForm, loginForm);
        }
    });
});
