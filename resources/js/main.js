$(document).ready(function(){
    
    $("#sidebar-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $(".hamburger").click(function(){
        $(this).toggleClass("is-active");
    });
  
});  