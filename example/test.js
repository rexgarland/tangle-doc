window.addEventListener('DOMContentLoaded', function () {

    var model = {
        initialize: function () {
            this.cookies = 3;
            this.caloriesPerCookie = 50;
            this.caloriesPerDay = 2100;
        },
        update: function () {
            this.calories = this.cookies * this.caloriesPerCookie;
            this.dailyPercent = 100 * this.calories / this.caloriesPerDay;
        }
    };
    
    var element = document.getElementById("cookieExample");
    new Tangle(element,model);
    
});