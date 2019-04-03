$(document).ready(function(){
    
    $(".sidebar-toggler").click(function(e) {
        e.preventDefault();
        $(".wrapper").toggleClass("toggled");
    });

    $(".btn-animated").click(function(){
        $(this).toggleClass("is-active");
    });
  
});  