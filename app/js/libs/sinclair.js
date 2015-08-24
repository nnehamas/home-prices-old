'use strict';

//GLOBAL VARIABLES
var $folio = $('.navbar-default'),
    $threshold = 20,
    $container = $('.container');

//CHANGE HEADER ON SCROLL
$(window).scroll(function() {
    var $t = $(this).scrollTop();
    $folio.css($t > $threshold ? {
        '-moz-box-shadow': '0px .25px 2px #ddd',
        '-webkit-box-shadow': '0px .25px 2px #ddd',
        'box-shadow': '0px .25px 2px #ddd'
    } : {
        '-moz-box-shadow': '0px .25px 2px #ddd',
        '-webkit-box-shadow': '0px .25px 2px #ddd',
        'box-shadow': '0px .25px 2px #ddd'
    });
});


//----------
// FUNCTIONS
//----------
var buildFooter = function() {
    $container.append('<div class=\"footer-list\"><a href=\"http://miamiherald.com\" target=\"_blank\"><img src=\"http://pubsys.miamiherald.com/static/media/projects/libraries/images/logo_b-tiny.png\" class=\'logo\'></a><a href=\"http://www.miamiherald.com/terms_of_service\" target=\"_blank\" class=\'footer-text\'>Terms of Service</a><a href=\"http://www.miamiherald.com/privacy_policy\" target=\"_blank\" class=\'footer-text\'>Privacy Policy</a><a href=\"http://www.miamiherald.com/copyright\" target=\"_blank\" class=\'footer-text\'>Copyright</a><a href=\"http://www.miamiherald.com/contact-us\" target=\"_blank\" class=\'footer-text\'>Contact</a></div>');
};

var buildFacebookComments = function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=133847067760&version=v2.3';
      fjs.parentNode.insertBefore(js, fjs);
};

$(document).ready(function() {
    
    $folio.css({
        'border-bottom': '1px solid #ddd'
    });

    buildFooter();
    buildFacebookComments(document, 'script', 'facebook-jssdk');
}); 